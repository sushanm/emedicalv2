const express = require("express");
const transactionController = require("../controllers/transactionController");

const router = express.Router();

// Create a new transaction
router.post("/", transactionController.create);

// Get transactions by date
router.get("/date", transactionController.getBySaleDate);

// Search transactions by name, mobile, or ID
router.get("/search", transactionController.getSearchByNameMobileID);

// Get all transactions
router.get("/", transactionController.getAll);

router.get("/searchmobile", transactionController.getCustomerNameByMobile);

// Get a specific transaction by ID
router.get("/:id", transactionController.getById);

router.delete("/:id", transactionController.deleteTransaction);

router.delete("/item/:id", transactionController.deleteTransactionItem);

module.exports = router;
