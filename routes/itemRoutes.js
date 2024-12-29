const express = require("express");
const itemsController = require("../controllers/itemsController");

const router = express.Router();

router.get("/", itemsController.getAll);
router.get("/:id", itemsController.getById);
router.post("/", itemsController.create);
router.put("/:id", itemsController.update);
router.delete("/:id", itemsController.delete);

module.exports = router;
