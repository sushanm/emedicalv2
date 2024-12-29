const Item = require("../models/itemModel");

const itemsController = {
  getAll: async (req, res) => {
    try {
      const items = await Item.findAll();
      res.json(items);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findByPk(id);
      if (!item) return res.status(404).send("Item not found");
      res.json(item);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  create: async (req, res) => {
    try {
      const { name, description } = req.body;
      const newItem = await Item.create({ name, description });
      res.status(201).json(newItem);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const item = await Item.findByPk(id);
      if (!item) return res.status(404).send("Item not found");

      item.name = name;
      item.description = description;
      await item.save();
      res.json(item);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findByPk(id);
      if (!item) return res.status(404).send("Item not found");

      await item.destroy();
      res.send("Item deleted successfully.");
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
};

module.exports = itemsController;
