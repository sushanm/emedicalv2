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
      });
      res.json(stocks);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  getAll: async (req, res) => {
    try {
      const stocks = await Stock.findAll({
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
      const newStock = await Stock.create({ name, giveDiscount, gst, usage });
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

      await stock.destroy();
      res.send("Stock item deleted successfully.");
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
};

module.exports = stockController;
