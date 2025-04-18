const Audit = require("../models/auditModel");
const AuditStock = require("../models/auditStockModel");
const AuditBatch = require("../models/auditBatchModel");
const Stock = require("../models/stockModel");
const Batch = require("../models/batchModel");

const startAudit = async (req, res) => {
  try {
    const audit = await Audit.create();

    const stocks = await Stock.findAll({
      include: [{ model: Batch, as: "Batches" }],
    });

    for (const stock of stocks) {
      const auditStock = await AuditStock.create({
        audit_id: audit.id,
        stock_id: stock.id,
        name: stock.name,
        usage: stock.usage,
        giveDiscount: stock.giveDiscount,
        gst: stock.gst,
        totalQuantity: stock.totalQuantity,
        result: null, // No result initially
      });

      for (const batch of stock.Batches) {
        await AuditBatch.create({
          audit_stock_id: auditStock.id,
          batch_id: batch.id,
          expiryDateMonth: batch.expiryDateMonth,
          expiryDateYear: batch.expiryDateYear,
          price: batch.price,
          quantity: batch.quantity,
        });
      }
    }

    res.status(200).json({ message: "Audit started", auditId: audit.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to start audit" });
  }
};

const getCurrentAudit = async (req, res) => {
  try {
    const currentAudit = await Audit.findOne({
      where: { status: "in_progress" },
      include: [
        {
          model: AuditStock,
          include: [AuditBatch],
        },
      ],
    });

    if (!currentAudit) {
      return res.status(404).json({ message: "No in-progress audit found" });
    }

    res.status(200).json(currentAudit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch current audit" });
  }
};

const updateAuditStockResult = async (req, res) => {
  const { id } = req.params;
  const { result } = req.body;

  try {
    const auditStock = await AuditStock.findByPk(id);
    if (!auditStock) {
      return res.status(404).json({ message: "AuditStock not found" });
    }

    await auditStock.update({ result });
    res.status(200).json({ message: "Result updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update result" });
  }
};

const refreshAudit = async (req, res) => {
  try {
    const { auditId } = req.params;

    const audit = await Audit.findByPk(auditId, {
      include: [
        {
          model: AuditStock,
          as: "AuditStocks",
          include: [{ model: AuditBatch, as: "AuditBatches" }],
        },
      ],
    });

    if (!audit) {
      return res.status(404).json({ error: "Audit not found" });
    }

    const stocks = await Stock.findAll({
      include: [{ model: Batch, as: "Batches" }],
    });

    for (const actualStock of stocks) {
      //let auditStock = audit.AuditStocks.get(actualStock.id);
      let auditStock = audit.AuditStocks.find(
        (aStock) => aStock.stock_id === actualStock.id
      );
      let needsReset = false;

      // New stock not present in audit → create it
      if (!auditStock) {
        auditStock = await AuditStock.create({
          stock_id: actualStock.id,
          AuditId: audit.id,
          result: null,
        });

        for (const batch of actualStock.Batches) {
          await AuditBatch.create({
            audit_stock_id: auditStock.id,
            expiryDateMonth: batch.expiryDateMonth,
            expiryDateYear: batch.expiryDateYear,
            quantity: batch.quantity,
            price: batch.price,
            batch_id: batch.id,
          });
        }

        continue; // nothing to compare, it's new
      }

      const auditBatches = auditStock.AuditBatches;

      // === Compare and sync batches ===

      //      const matchedAuditBatchKeys = new Set();

      for (const actualBatch of actualStock.Batches) {
        const match = auditBatches.find(
          (item) => item.batch_id == actualBatch.id
        );

        if (match) {
          if (
            match.expiryDateMonth != actualBatch.expiryDateMonth ||
            match.expiryDateYear != actualBatch.expiryDateYear
          ) {
            needsReset = true;
          }
          if (
            match.quantity !== actualBatch.quantity ||
            match.price !== actualBatch.price
          ) {
            needsReset = true;
          }

          const batchToBeUpdated = await AuditBatch.findByPk(match.id);
          if (!batchToBeUpdated)
            return res.status(404).send("Stock item not found");

          batchToBeUpdated.expiryDateMonth = actualBatch.expiryDateMonth;
          batchToBeUpdated.expiryDateYear = actualBatch.expiryDateYear;
          batchToBeUpdated.quantity = actualBatch.quantity;
          batchToBeUpdated.price = actualBatch.price;
          await batchToBeUpdated.save();
        } else {
          // NEW BATCH → create + trigger reset
          await AuditBatch.create({
            audit_stock_id: actualStock.id,
            expiryDateMonth: actualBatch.expiryDateMonth,
            expiryDateYear: actualBatch.expiryDateYear,
            quantity: actualBatch.quantity,
            price: actualBatch.price,
            batch_id: actualBatch.id,
          });

          needsReset = true;
        }
      }

      // === Check for removed batches ===
      for (const auditBatch of auditBatches) {
        const match = actualStock.Batches.find(
          (item) => item.id == auditBatch.batch_id
        );
        if (!match) {
          await auditBatch.destroy();
          needsReset = true;
        }
      }

      if (needsReset) {
        await auditStock.update({ result: null });
      }
    }

    res
      .status(200)
      .json({ message: "Audit refreshed and synced successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to refresh audit." });
  }
};

module.exports = {
  startAudit,
  getCurrentAudit,
  updateAuditStockResult,
  refreshAudit,
};
