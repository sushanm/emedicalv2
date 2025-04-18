const express = require("express");
const cashAuditController = require("../controllers/cashAuditController");
const router = express.Router();

router.post("/opening-balance", cashAuditController.createOpeningBalance);
router.put("/closing-balance", cashAuditController.updateClosingBalance);
router.get("/today", cashAuditController.getTodayAudit);

module.exports = router;
