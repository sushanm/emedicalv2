const { DataTypes } = require("sequelize");
const sequelize = require("./db");

const Audit = sequelize.define(
  "Audit",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.ENUM("in_progress", "completed"),
      defaultValue: "in_progress",
    },
  },
  { timestamps: true }
);

module.exports = Audit;
