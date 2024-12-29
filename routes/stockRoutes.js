const express = require("express");
const stockController = require("../controllers/stockController");

const router = express.Router();

router.get("/", stockController.getAll);
router.get("/:id", stockController.getById);
router.post("/", stockController.create);
router.put("/:id", stockController.update);
router.delete("/:id", stockController.delete);

module.exports = router;
