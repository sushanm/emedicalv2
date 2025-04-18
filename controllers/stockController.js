const Stock = require("../models/stockModel");
const Batch = require("../models/batchModel");

const stockController = {
  getAllStock: async (req, res) => {
    try {
      const stocks = await Stock.findAll({
        include: [
          {
            model: Batch,
            as: "Batches", // Alias for the relationship
          },
        ],
        order: [["name", "ASC"]], // Order by 'name' in ascending order
      });
      res.json(stocks);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const stock = await Stock.findByPk(id, {
        include: [
          {
            model: Batch,
            as: "Batches", // Alias for the relationship
          },
        ],
      });
      if (!stock) return res.status(404).send("Stock item not found");
      res.json(stock);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  create: async (req, res) => {
    try {
      const { name, giveDiscount, gst, usage } = req.body;

      // Create stock with default totalQuantity = 0
      const newStock = await Stock.create({
        name,
        giveDiscount,
        gst,
        usage,
        totalQuantity: 0, // Default value for new stocks
      });
      res.status(201).json(newStock);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, giveDiscount, gst, usage } = req.body;
      const stock = await Stock.findByPk(id);
      if (!stock) return res.status(404).send("Stock item not found");

      stock.name = name;
      stock.giveDiscount = giveDiscount;
      stock.gst = gst;
      stock.usage = usage;
      await stock.save();
      res.json(stock);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const stock = await Stock.findByPk(id);
      if (!stock) return res.status(404).send("Stock item not found");

      // Cascade delete related batches
      await Batch.destroy({ where: { stock_id: id } });

      await stock.destroy();
      res.send("Stock item and associated batches deleted successfully.");
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  updateTotalQuantity: async (req, res) => {
    try {
      const { id } = req.params;

      // Calculate total quantity for the stock
      let totalQuantity = await Batch.sum("quantity", {
        where: { stock_id: id },
      });

      // Update totalQuantity in Stock
      const stock = await Stock.findByPk(id);
      if (!stock) return res.status(404).send("Stock item not found");
      if (totalQuantity == null) {
        totalQuantity = 0;
      }
      stock.totalQuantity = totalQuantity;
      await stock.save();
      res.json(stock);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
};

module.exports = stockController;
