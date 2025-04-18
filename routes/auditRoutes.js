const express = require("express");
const router = express.Router();
const {
  startAudit,
  getCurrentAudit,
  updateAuditStockResult,
  refreshAudit,
} = require("../controllers/auditController");

router.post("/audit/start", startAudit);
router.get("/audit/current", getCurrentAudit);
router.patch("/audit/:id/result", updateAuditStockResult);
router.patch("/audit/:auditId/refresh", refreshAudit);
module.exports = router;
