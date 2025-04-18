const { DataTypes } = require("sequelize");
const sequelize = require("./db");
const AuditStock = require("./auditStockModel");

const AuditBatch = sequelize.define(
  "AuditBatch",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    audit_stock_id: {
      type: DataTypes.INTEGER,
      references: { model: "AuditStocks", key: "id" },
      onDelete: "CASCADE",
    },
    batch_id: DataTypes.INTEGER,
    expiryDateMonth: DataTypes.INTEGER,
    expiryDateYear: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
  },
  { timestamps: true }
);

AuditStock.hasMany(AuditBatch, { foreignKey: "audit_stock_id" });
AuditBatch.belongsTo(AuditStock, { foreignKey: "audit_stock_id" });

module.exports = AuditBatch;
