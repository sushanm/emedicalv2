const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const itemRoutes = require("./routes/itemRoutes");
const stockRoutes = require("./routes/stockRoutes");
const batchRoutes = require("./routes/batchRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const sequelize = require("./models/db");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/api/items", itemRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/batch", batchRoutes);
app.use("/api/transactions", transactionRoutes);

// Sync Database with Alter
(async () => {
  try {
    await sequelize.sync({ alter: true }); // Automatically updates table structure
    console.log("Database synchronized with model changes.");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
})();

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
