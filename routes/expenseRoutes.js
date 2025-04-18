const express = require("express");
const expenseController = require("../controllers/expenseController");

const router = express.Router();

// Route to create a new expense
router.post("/", expenseController.create);

// Route to get all expenses grouped by month
router.get("/", expenseController.getAllByMonth);

// Route to get expenses for a specific month
router.get("/month", expenseController.getByMonth);

// Route to delete an expense
router.delete("/:id", expenseController.delete);

module.exports = router;
