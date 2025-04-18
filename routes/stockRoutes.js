const express = require("express");
const stockController = require("../controllers/stockController");

const router = express.Router();

// Get all stocks with associated batches
router.get("/", stockController.getAllStock);

// Get a specific stock by ID with associated batches
router.get("/:id", stockController.getById);

// Create a new stock
router.post("/", stockController.create);

// Update an existing stock
router.put("/:id", stockController.update);

// Recalculate and update total quantity for a specific stock
router.put("/:id/updateTotalQuantity", stockController.updateTotalQuantity);

// Delete a stock and its associated batches
router.delete("/:id", stockController.delete);

module.exports = router;
