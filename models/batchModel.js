const { DataTypes } = require("sequelize");
const sequelize = require("./db");
const Stock = require("./stockModel");

const Batch = sequelize.define(
  "Batch",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    stock_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Stocks",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    expiryDateMonth: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 12,
      },
    },
    expiryDateYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1900,
        isInt: true,
      },
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

// Relationship
Stock.hasMany(Batch, { foreignKey: "stock_id", as: "Batches" });
Batch.belongsTo(Stock, { foreignKey: "stock_id", as: "Stock" });

module.exports = Batch;
