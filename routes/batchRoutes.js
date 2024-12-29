const express = require("express");
const batchController = require("../controllers/batchController");

const router = express.Router();

router.get("/", batchController.getAll);
router.get("/:id", batchController.getById);
router.get("/:stock_id", batchController.getStockId);
router.post("/", batchController.create);
router.put("/:id", batchController.update);
router.delete("/:id", batchController.delete);

module.exports = router;
