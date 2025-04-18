const { DataTypes } = require("sequelize");
const sequelize = require("./db");
const Audit = require("./auditModel");

const AuditStock = sequelize.define(
  "AuditStock",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    audit_id: {
      type: DataTypes.INTEGER,
      references: { model: "Audits", key: "id" },
      onDelete: "CASCADE",
    },
    stock_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    usage: DataTypes.TEXT,
    giveDiscount: DataTypes.BOOLEAN,
    gst: DataTypes.INTEGER,
    totalQuantity: DataTypes.INTEGER,
    result: {
      type: DataTypes.ENUM("passed", "failed"),
      allowNull: true,
    },
  },
  { timestamps: true }
);

Audit.hasMany(AuditStock, { foreignKey: "audit_id" });
AuditStock.belongsTo(Audit, { foreignKey: "audit_id" });

module.exports = AuditStock;
