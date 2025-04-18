const { DataTypes } = require("sequelize");
const sequelize = require("./db");

const CashAudit = sequelize.define("CashAudit", {
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  openingDenomination: {
    type: DataTypes.JSON, // Store denominations and counts as JSON
    allowNull: false,
    defaultValue: {},
  },
  closingDenomination: {
    type: DataTypes.JSON, // Store denominations and counts as JSON
    allowNull: false,
    defaultValue: {},
  },
  openingBalance: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  closingBalance: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  onlineTransaction: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  cashPurchase: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  salesToday: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
});

module.exports = CashAudit;
