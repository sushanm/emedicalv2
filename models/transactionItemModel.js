const { DataTypes } = require("sequelize");
const sequelize = require("./db");
const Transaction = require("./transactionModel");
const Batch = require("./batchModel");

const TransactionItem = sequelize.define("TransactionItem", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  transaction_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Transaction,
      key: "id",
    },
    onDelete: "CASCADE", // Optional: handle related rows when a parent row is deleted
    onUpdate: "CASCADE", // Optional: handle related rows when a parent row is updated
  },
  batchId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  gst: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  gstValue: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  actualPricePerUnit: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  actualTotalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  discount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Transaction.hasMany(TransactionItem, {
  foreignKey: "transaction_id",
  as: "items",
});
TransactionItem.belongsTo(Transaction, {
  foreignKey: "transaction_id",
  as: "transaction",
});

module.exports = TransactionItem;
