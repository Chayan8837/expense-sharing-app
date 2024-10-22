const mongoose = require('mongoose');

const BalanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  user: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
  },
  total_expense_created: { type: Number, default: 0 }, // Total amount of expenses created by the user
  total_paid_in_split: { type: Number, default: 0 }, // Total amount paid by the user in splits
  balance_with_others: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User model
      balance: { type: Number, default: 0 }, // Amount owed or to be received from this user
    }
  ],
  expenses: [
    {
      type: mongoose.Schema.Types.ObjectId, // Reference to Expense model
      ref: 'Expense',
    }
  ]
}, { timestamps: true }); // Include createdAt and updatedAt fields

module.exports = mongoose.model('Balance', BalanceSchema);
