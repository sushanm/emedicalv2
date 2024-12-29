const { DataTypes } = require("sequelize");
const sequelize = require("./db");

// Define the Item model
const Item = sequelize.define(
  "Item",
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
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt columns
  }
);

module.exports = Item;
