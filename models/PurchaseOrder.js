const { DataTypes } = require("sequelize");
const sequelize = require("./db");

const PurchaseOrder = sequelize.define("PurchaseOrder", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  stockName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stockId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Can be null
  },
  quantity: {
    type: DataTypes.STRING, // Supports both number or text
    allowNull: false,
  },
});

module.exports = PurchaseOrder;
