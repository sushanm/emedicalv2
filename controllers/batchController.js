const Batch = require("../models/batchModel");
const Stock = require("../models/stockModel");

const batchController = {
  // Get all batches with optional stock_id filter
  getAll: async (req, res) => {
    try {
      const { stock_id } = req.query; // Retrieve stock_id from query parameters
      const whereClause = stock_id ? { stock_id } : {}; // If stock_id is provided, filter by it
      const batches = await Batch.findAll({
        where: whereClause,
        include: [
          {
            model: Stock,
            as: "Stock", // Use the alias defined in the Batch model
          },
        ],
      });
      res.json(batches);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  // Get a batch by ID with associated stock details
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const batch = await Batch.findByPk(id, {
        include: [
          {
            model: Stock,
            as: "Stock", // Use the alias defined in the Batch model
          },
        ],
      });
      if (!batch) return res.status(404).send("Batch not found");
      res.json(batch);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  // Get all batches by stock ID
  getStockId: async (req, res) => {
    try {
      const { stock_id } = req.query; // Retrieve stock_id from query parameters
      if (!stock_id) {
        return res.status(400).send("stock_id is required");
      }
      const batches = await Batch.findAll({
        where: { stock_id },
        include: [
          {
            model: Stock,
            as: "Stock", // Use the alias defined in the Batch model
          },
        ],
      });
      res.json(batches);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  // Create a new batch
  create: async (req, res) => {
    try {
      const { stock_id, expiryDateMonth, expiryDateYear, price, quantity } =
        req.body;
      const newBatch = await Batch.create({
        stock_id,
        expiryDateMonth,
        expiryDateYear,
        price,
        quantity,
      });
      res.status(201).json(newBatch);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  // Update an existing batch
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { stock_id, expiryDateMonth, expiryDateYear, price, quantity } =
        req.body;
      const batch = await Batch.findByPk(id);
      if (!batch) return res.status(404).send("Batch not found");

      batch.stock_id = stock_id;
      batch.expiryDateMonth = expiryDateMonth;
      batch.expiryDateYear = expiryDateYear;
      batch.price = price;
      batch.quantity = quantity;
      await batch.save();
      res.json(batch);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  // Delete a batch
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const batch = await Batch.findByPk(id);
      if (!batch) return res.status(404).send("Batch not found");

      await batch.destroy();
      res.send("Batch deleted successfully.");
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
};

module.exports = batchController;
