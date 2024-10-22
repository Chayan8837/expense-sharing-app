const express = require('express');
const router = express.Router();
const { createExpense, updateExpenseSplit } = require('../controllers/expenseController');

// Route to create a new expense
// POST /api/expenses
router.post('/', createExpense);

// Route to update an existing expense with split details
// PUT /api/expenses/:id/split
router.put('/:id', updateExpenseSplit);

module.exports = router;
