const { DataTypes } = require("sequelize");
const sequelize = require("./db");

// Define the Item model
const Stock = sequelize.define(
  "Stock",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    usage: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    giveDiscount: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    gst: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalQuantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt columns
  }
);

module.exports = Stock;
