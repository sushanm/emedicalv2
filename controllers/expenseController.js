const Expense = require("../models/Expense");
const { Op } = require("sequelize");

const expenseController = {
  // Create a new expense
  create: async (req, res) => {
    try {
      const { amount, description, date } = req.body;

      if (!amount || !description || !date) {
        return res
          .status(400)
          .json({ error: "Amount, description, and date are required." });
      }

      const newExpense = await Expense.create({
        amount,
        description,
        date,
      });

      res.status(201).json(newExpense);
    } catch (error) {
      console.error("Error creating expense:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Get all expenses grouped by month
  getAllByMonth: async (req, res) => {
    try {
      const expenses = await Expense.findAll();

      const groupedExpenses = expenses.reduce((acc, expense) => {
        const monthYear = new Date(expense.date).toISOString().slice(0, 7); // Format YYYY-MM
        if (!acc[monthYear]) {
          acc[monthYear] = [];
        }
        acc[monthYear].push(expense);
        return acc;
      }, {});

      res.json(groupedExpenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Get expenses for a specific month
  getByMonth: async (req, res) => {
    try {
      const { year, month } = req.query;

      if (!year || !month) {
        return res
          .status(400)
          .json({ error: "Year and month query parameters are required." });
      }

      const startOfMonth = new Date(`${year}-${month}-01`);
      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);

      const expenses = await Expense.findAll({
        where: {
          date: {
            [Op.gte]: startOfMonth,
            [Op.lt]: endOfMonth,
          },
        },
      });

      res.json(expenses);
    } catch (error) {
      console.error("Error fetching expenses by month:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Delete an expense
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const expense = await Expense.findByPk(id);

      if (!expense) {
        return res.status(404).json({ error: "Expense not found." });
      }

      await expense.destroy();

      res.json({ message: "Expense deleted successfully." });
    } catch (error) {
      console.error("Error deleting expense:", error);
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = expenseController;
