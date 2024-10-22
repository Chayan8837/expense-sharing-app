// const mongoose = require('mongoose');

// const ExpenseSchema = new mongoose.Schema({
//   creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   description: { type: String, required: true },
//   amount: { type: Number, required: true },
//   split_type: { type: String, default: 'none' }, // "equal", "percentage", "exact", or "none"
//   split_members: [
//     {
//       user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//       amount: { type: Number }
//     }
//   ],
//   date: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Expense', ExpenseSchema);


const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  split_type: { type: String, enum: ['none', 'equal', 'exact', 'percentage'], default: 'none' },
  split_members: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      amount: { type: Number, required: true }, // or percentage for percentage split
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);
