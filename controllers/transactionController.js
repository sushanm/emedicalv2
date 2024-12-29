const sequelize = require("../models/db"); // Import the Sequelize instance
const Transaction = require("../models/transactionModel");
const TransactionItem = require("../models/transactionItemModel");
const Batch = require("../models/batchModel");

const transactionController = {
  create: async (req, res) => {
    const t = await sequelize.transaction(); // Start transaction
    try {
      const { customerName, discount, mobile, saleDate, totalPrice, items } =
        req.body;

      // Create transaction
      const newTransaction = await Transaction.create(
        { customerName, discount, mobile, saleDate, totalPrice },
        { transaction: t }
      );

      // Process items and deduct batch quantities
      for (const item of items) {
        const batch = await Batch.findByPk(item.batchId, { transaction: t });
        if (!batch || batch.quantity < item.quantity) {
          throw new Error(
            `Batch with ID ${item.batchId} has insufficient quantity.`
          );
        }

        // Deduct batch quantity
        batch.quantity -= item.quantity;
        await batch.save({ transaction: t });

        // Create transaction item
        await TransactionItem.create(
          {
            transaction_id: newTransaction.id,
            batchId: item.batchId,
            discounted: item.discounted,
            giveDiscount: item.giveDiscount,
            gst: item.gst,
            gstValue: item.gstValue,
            name: item.name,
            price: item.price,
            pricePerUnit: item.pricePerUnit,
            quantity: item.quantity,
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
};

module.exports = transactionController;
