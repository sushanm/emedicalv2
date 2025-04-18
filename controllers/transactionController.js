const sequelize = require("../models/db"); // Import the Sequelize instance
const Transaction = require("../models/transactionModel");
const TransactionItem = require("../models/transactionItemModel");
const Batch = require("../models/batchModel");
const { Op } = require("sequelize");

const transactionController = {
  create: async (req, res) => {
    const t = await sequelize.transaction(); // Start transaction

    try {
      const { customerName, discount, mobile, saleDate, totalPrice, items } =
        req.body;

      // Excluded item names for batch operations
      const excludedItemNames = ["Doctor Consultation", "BP/Sugar Test"];

      // Create the transaction
      const newTransaction = await Transaction.create(
        { customerName, discount, mobile, saleDate, totalPrice },
        { transaction: t }
      );

      // Fetch all necessary batches in one query
      const batchIds = items
        .filter((item) => !excludedItemNames.includes(item.name)) // Exclude items that should not update batches
        .map((item) => item.batchId)
        .filter(Boolean);

      const batches = await Batch.findAll({
        where: { id: batchIds },
        transaction: t,
      });

      // Create maps for quick access
      const batchMap = new Map(batches.map((batch) => [batch.id, batch]));

      // Process items
      for (const item of items) {
        if (!excludedItemNames.includes(item.name) && item.batchId) {
          let batch = batchMap.get(item.batchId);
          if (!batch || batch.quantity < item.selectedQuantity) {
            throw new Error(
              `Batch with ID ${item.batchId} has insufficient quantity.`
            );
          }

          // Deduct the selected quantity from the batch
          batch.quantity -= item.selectedQuantity;

          // If quantity becomes zero, remove the batch
          if (batch.quantity === 0) {
            await batch.destroy({ transaction: t });
          } else {
            // Otherwise, save the updated batch
            await batch.save({ transaction: t });
          }
        }

        // Create transaction item
        await TransactionItem.create(
          {
            transaction_id: newTransaction.id,
            batchId: item.batchId || null,
            gst: item.gst || 0,
            gstValue: item.gstValue || 0,
            name: item.name,
            actualPricePerUnit: item.actualPricePerUnit,
            actualTotalPrice: item.actualTotalPrice,
            discount: item.discount,
            quantity: item.selectedQuantity,
          },
          { transaction: t }
        );
      }

      await t.commit(); // Commit transaction
      res.status(201).json(newTransaction);
    } catch (error) {
      await t.rollback(); // Rollback transaction on error
      console.error("Transaction Error:", error.message); // Log the error for debugging
      res.status(500).send(error.message);
    }
  },

  getAll: async (req, res) => {
    try {
      const transactions = await Transaction.findAll({
        include: {
          model: TransactionItem,
          as: "items",
        },
      });
      res.json(transactions);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const transaction = await Transaction.findByPk(id, {
        include: {
          model: TransactionItem,
          as: "items",
        },
      });
      if (!transaction) return res.status(404).send("Transaction not found");
      res.json(transaction);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  getBySaleDate: async (req, res) => {
    try {
      const { date } = req.query; // Expecting saleDate in 'YYYY-MM-DD' format

      if (!date) {
        return res.status(400).send("Sale date query parameter is required.");
      }

      // Fetch transactions where the date part of saleDate matches the provided date
      const transactions = await Transaction.findAll({
        where: sequelize.where(
          sequelize.fn("DATE", sequelize.col("saleDate")), // Extract only the date part
          date // Compare with the provided saleDate
        ),
        include: {
          model: TransactionItem,
          as: "items", // Ensure this alias matches your model association
        },
        order: [["id", "ASC"]], // Order transactions by ID
        logging: console.log, // Enable query logging for debugging
      });

      if (transactions.length === 0) {
        return res.status(404).send(`No transactions found for date: ${date}`);
      }

      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions by sale date:", error);
      res.status(500).send(error.message);
    }
  },

  getSearchByNameMobileID: async (req, res) => {
    try {
      const { name, mobile, id, date } = req.query;

      if (!name && !mobile && !id && !date) {
        return res
          .status(400)
          .send(
            "At least one of name, mobile, id, or date query parameter is required."
          );
      }

      // Build the where clause dynamically based on provided parameters
      const whereClause = {};
      if (id) {
        whereClause.id = id;
      }
      if (name) {
        whereClause.customerName = { [Op.like]: `%${name}%` }; // Use LIKE for partial match
      }
      if (mobile) {
        whereClause.mobile = { [Op.like]: `%${mobile}%` }; // Use LIKE for partial match
      }
      if (date) {
        whereClause[Op.and] = [
          sequelize.where(
            sequelize.fn("DATE", sequelize.col("saleDate")),
            date
          ),
        ];
      }

      // Fetch transactions based on the where clause
      const transactions = await Transaction.findAll({
        where: whereClause,
        include: {
          model: TransactionItem,
          as: "items", // Ensure this alias matches your model association
        },
        order: [["id", "ASC"]], // Order transactions by ID
      });

      if (transactions.length === 0) {
        return res
          .status(404)
          .send("No transactions found for the provided query.");
      }

      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions by search:", error);
      res.status(500).send(error.message);
    }
  },
  getCustomerNameByMobile: async (req, res) => {
    try {
      const { mobile } = req.query;

      if (!mobile) {
        return res.status(400).json({ error: "Mobile number is required" });
      }

      const customers = await Transaction.findAll({
        where: {
          mobile: {
            [require("sequelize").Op.like]: `${mobile}%`, // Matches partial input
          },
          customerName: {
            [require("sequelize").Op.ne]: null, // Excludes null customer names
          },
        },
        attributes: [
          [
            require("sequelize").fn(
              "DISTINCT",
              require("sequelize").col("customerName")
            ),
            "customerName",
          ],
          "mobile", // Include the mobile number in the results
        ],
        raw: true, // Returns raw data instead of Sequelize instances
      });

      return res.status(200).json(customers);
    } catch (error) {
      console.error("Error fetching customer names:", error);
      return res.status(500).json({ error: "Server error" });
    }
  },
  deleteTransaction: async (req, res) => {
    try {
      let transactionId = req.params.id;

      console.log("Received Transaction ID:", transactionId); // Debugging log

      // Ensure the ID is a valid integer
      if (!transactionId || isNaN(transactionId)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid transaction ID" });
      }

      transactionId = parseInt(transactionId, 10); // Convert to integer

      // Delete related TransactionItems first
      await TransactionItem.destroy({
        where: { transaction_id: transactionId },
      });

      // Delete the Transaction
      const deletedCount = await Transaction.destroy({
        where: { id: transactionId },
      });

      if (deletedCount === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Transaction not found" });
      }

      return res
        .status(200)
        .json({ success: true, message: "Transaction deleted successfully" });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
  deleteTransactionItem: async (req, res) => {
    const { id } = req.params;

    try {
      // Find the TransactionItem to get its transaction_id
      const item = await TransactionItem.findByPk(id);

      if (!item) {
        return res.status(404).json({ message: "TransactionItem not found" });
      }

      const transactionId = item.transaction_id;

      // Delete the item
      await item.destroy();

      // Get remaining items for this transaction
      const remainingItems = await TransactionItem.findAll({
        where: { transaction_id: transactionId },
      });

      // Recalculate totalPrice
      const newTotalPrice = remainingItems.reduce(
        (sum, item) => sum + item.actualTotalPrice,
        0
      );

      // Update the Transaction totalPrice
      await Transaction.update(
        { totalPrice: newTotalPrice },
        { where: { id: transactionId } }
      );

      return res.status(200).json({
        message: "TransactionItem deleted and totalPrice updated",
        updatedTotalPrice: newTotalPrice,
      });
    } catch (error) {
      console.error("Error deleting TransactionItem:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = transactionController;
