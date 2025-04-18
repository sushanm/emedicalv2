const PurchaseOrder = require("../models/PurchaseOrder");
const Stock = require("../models/stockModel");

const purchaseOrderController = {
  getAll: async (req, res) => {
    try {
      const orders = await PurchaseOrder.findAll();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const { stockName, stockId, quantity } = req.body;

      const newOrder = await PurchaseOrder.create({
        stockName,
        stockId,
        quantity,
      });

      res.status(201).json(newOrder);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const order = await PurchaseOrder.findByPk(id);
      if (!order) return res.status(404).send("Item not found");
      order.quantity = quantity;
      await order.save();
      res.json(order);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  markAsReceived: async (req, res) => {
    try {
      const { id } = req.params;

      const order = await PurchaseOrder.findByPk(id);
      if (!order) {
        return res.status(404).json({ error: "Purchase order not found" });
      }

      await order.destroy();
      res.json({ message: "Purchase order marked as received and removed" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  cleanOrders: async (req, res) => {
    try {
      const { id } = req.params;
      // Fetch all orders from the database
      const orders = await PurchaseOrder.findAll();

      // Create a map to track unique stockId and the first occurrence of each stockId
      const seenStockIds = new Set();

      for (const order of orders) {
        if (order.stockId) {
          // Old logic: Remove orders if the stock quantity is greater than 0
          const stock = await Stock.findByPk(order.stockId);
          if (stock && stock.totalQuantity > 0 && stock.id == id) {
            await order.destroy(); // Remove from purchase order if stock quantity > 0
          }
          // New logic: Remove duplicates by checking stockId
          else if (seenStockIds.has(order.stockId)) {
            await order.destroy(); // If stockId is duplicate, remove this order
          } else {
            seenStockIds.add(order.stockId); // Keep the first order for each stockId
          }
        }
      }

      res.json({ message: "Purchase orders cleaned and duplicates removed" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = purchaseOrderController;
