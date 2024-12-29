const { Sequelize } = require("sequelize");

// Initialize Sequelize with MySQL database configuration
const sequelize = new Sequelize("react_mysql_crud", "root", "sa123", {
  host: "localhost",
  dialect: "mysql",
});

// Test the database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = sequelize;
