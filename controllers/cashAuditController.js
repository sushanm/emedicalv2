const CashAudit = require("../models/CashAudit");
const { Op } = require("sequelize");

const cashAuditController = {
  createOpeningBalance: async (req, res) => {
    try {
      const { date, openingDenomination, openingBalance } = req.body;

      // Check if opening balance for today already exists
      const existingAudit = await CashAudit.findOne({ where: { date } });
      if (existingAudit) {
        return res
          .status(400)
          .send("Opening balance for today already exists.");
      }

      const newAudit = await CashAudit.create({
        date,
        openingDenomination,
        openingBalance,
      });
      res.status(201).json(newAudit);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  updateClosingBalance: async (req, res) => {
    try {
      const {
        date,
        closingDenomination,
        closingBalance,
        onlineTransaction,
        cashPurchase,
        salesToday,
      } = req.body;

      const audit = await CashAudit.findOne({ where: { date } });
      if (!audit) {
        return res.status(404).send("Audit record not found.");
      }

      audit.closingBalance = closingBalance;
      audit.onlineTransaction = onlineTransaction;
      audit.cashPurchase = cashPurchase;
      audit.closingDenomination = closingDenomination;
      audit.salesToday = salesToday;
      await audit.save();

      res.json(audit);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  getTodayAudit: async (req, res) => {
    try {
      const { date } = req.query;

      const audit = await CashAudit.findOne({ where: { date } });
      if (!audit) {
        return res.status(404).send("Audit record not found.");
      }

      res.json(audit);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
};

module.exports = cashAuditController;
