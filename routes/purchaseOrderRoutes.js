const express = require("express");
const purchaseOrderController = require("../controllers/purchaseOrderController");

const router = express.Router();

router.get("/", purchaseOrderController.getAll);
router.post("/", purchaseOrderController.create);
router.delete("/:id", purchaseOrderController.markAsReceived);
router.post("/:id/clean", purchaseOrderController.cleanOrders);
// router.post("/clean", purchaseOrderController.cleanOrders);
router.put("/:id/update", purchaseOrderController.update);

module.exports = router;
