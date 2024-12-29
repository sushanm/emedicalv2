const express = require("express");
const transactionController = require("../controllers/transactionController");

const router = express.Router();

router.post("/", transactionController.create);
router.get("/", transactionController.getAll);
router.get("/:id", transactionController.getById);

module.exports = router;
