const Balance = require('../models/Balance');
const User = require('../models/User');
const Expense = require('../models/Expense');

exports.getBalanceForUser = async (req, res) => {
    const { id } = req.params; // User ID
  
    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ msg: 'User not found' });
  
        // Fetch balance sheet data using userId
        const balanceSheet = await Balance.findOne({ userId: id });
        if (!balanceSheet) return res.status(404).json({ msg: 'No balance sheet found for this user' });
  
        // Fetch all expenses for this user
        const expenses = await Expense.find({ 
            $or: [
                { creator: id },
                { "split_members.user": id }
            ]
        });
  
        // Format balance sheet response
        const response = {
            user: {
                name: user.name,
                phone: user.phone,
                email: user.email,
            },
            total_expense_created: balanceSheet.total_expense_created || 0,
            total_paid_in_split: balanceSheet.total_paid_in_split || 0,
            balance_with_others: balanceSheet.balance_with_others || 0,
            expenses: expenses.map(exp => ({
                id: exp._id,
                description: exp.description,
                amount: exp.amount,
                split_type: exp.split_type,
                split_members: exp.split_members,
                createdAt: exp.createdAt,
            })),
        };
  
        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching user balance:", error);
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
};
