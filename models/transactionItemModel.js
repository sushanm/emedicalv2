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
  },
  batchId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  discounted: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  giveDiscount: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
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
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  pricePerUnit: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

TransactionItem.belongsTo(Transaction, {
  foreignKey: "transaction_id",
  as: "transaction",
});

module.exports = TransactionItem;
