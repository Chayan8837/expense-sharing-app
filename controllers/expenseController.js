const Expense = require('../models/Expense');
const Balance = require('../models/Balance');
const User = require('../models/User');

// Create Expense
exports.createExpense = async (req, res) => {
    const { creator, description, amount, split_type = 'none', split_members = [] } = req.body;

    try {
        // Validate required fields
        if (!creator || !description || !amount || amount <= 0) {
            return res.status(400).json({ msg: 'Invalid input data' });
        }

        // Create a new expense instance
        const newExpense = new Expense({ creator, description, amount, split_type });
        await newExpense.save();

        let processedSplitMembers = [];
        
        // Handle expense creation without splitting
        if (split_type === 'none') {
            await updateBalanceForUser(creator, newExpense._id, amount, 0);
            return res.status(201).json({ msg: 'Expense created without split', expense: newExpense });
        }

        // Handle expense splitting logic
        if (split_type === 'equal') {
            const splitAmount = amount / split_members.length;
            processedSplitMembers = split_members.map(userId => ({ user: userId, amount: splitAmount }));
        } else if (split_type === 'exact') {
            const totalSplitAmount = split_members.reduce((total, member) => total + member.amount, 0);
            if (totalSplitAmount !== amount) {
                return res.status(400).json({ msg: 'Total split amount must equal the expense amount' });
            }
            processedSplitMembers = split_members.map(({ user, amount }) => ({ user, amount }));
        } else if (split_type === 'percentage') {
            const totalPercentage = split_members.reduce((total, member) => total + member.percentage, 0);
            if (totalPercentage !== 100) {
                return res.status(400).json({ msg: 'Total percentage must be 100%' });
            }
            processedSplitMembers = split_members.map(({ user, percentage }) => ({
                user,
                amount: (percentage / 100) * amount
            }));
        } else {
            return res.status(400).json({ msg: 'Invalid split type' });
        }

        // Save processed split members and update balances
        newExpense.split_members = processedSplitMembers;
        await newExpense.save();

        // Update balance entries for the creator and split members
        await updateBalanceForUser(creator, newExpense._id, amount, 0);  // Creator pays full amount but no split share
        for (const member of processedSplitMembers) {
            await updateBalanceForUser(member.user, newExpense._id, 0, member.amount);
        }

        res.status(201).json({ msg: 'Expense created with split', expense: newExpense });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error creating expense', error: error.message });
    }
};

// Helper function to update balance for a user
const updateBalanceForUser = async (userId, expenseId, totalCreated, totalPaid) => {
    try {
        let balanceEntry = await Balance.findOne({ userId });
        if (!balanceEntry) {
            const user = await User.findById(userId);
            if (!user) throw new Error('User not found');

            balanceEntry = new Balance({
                userId: user._id,
                user: {
                    name: user.name,
                    phone: user.phone,
                    email: user.email,
                },
                total_expense_created: totalCreated,
                total_paid_in_split: totalPaid,
                balance_with_others: [],
                expenses: [expenseId]  // Add reference to the expense
            });
            await balanceEntry.save();
        } else {
            balanceEntry.total_expense_created += totalCreated;
            balanceEntry.total_paid_in_split += totalPaid;
            balanceEntry.expenses.push(expenseId);  // Add reference to the expense
            await balanceEntry.save();
        }
    } catch (error) {
        throw new Error(`Error updating balance for user ${userId}: ${error.message}`);
    }
};

// Update Expense to Add Split
exports.updateExpenseSplit = async (req, res) => {
    const { id } = req.params;
    const { split_type, split_members } = req.body;

    try {
        // Fetch the expense from the database
        const expense = await Expense.findById(id);
        if (!expense) {
            return res.status(404).json({ msg: 'Expense not found' });
        }

        let processedSplitMembers = [];

        // Process splitting logic
        if (split_type === 'equal') {
            const splitAmount = expense.amount / split_members.length;
            processedSplitMembers = split_members.map(userId => ({ user: userId, amount: splitAmount }));
        } else if (split_type === 'exact') {
            const totalSplitAmount = split_members.reduce((total, member) => total + member.amount, 0);
            if (totalSplitAmount !== expense.amount) {
                return res.status(400).json({ msg: 'Total split amount must equal the expense amount' });
            }
            processedSplitMembers = split_members.map(({ user, amount }) => ({ user, amount }));
        } else if (split_type === 'percentage') {
            const totalPercentage = split_members.reduce((total, member) => total + member.percentage, 0);
            if (totalPercentage !== 100) {
                return res.status(400).json({ msg: 'Total percentage must be 100%' });
            }
            processedSplitMembers = split_members.map(({ user, percentage }) => ({
                user,
                amount: (percentage / 100) * expense.amount
            }));
        } else {
            return res.status(400).json({ msg: 'Invalid split type' });
        }

        // Save the updated split members
        expense.split_type = split_type;
        expense.split_members = processedSplitMembers;
        await expense.save();

        // Update balance entries accordingly
        for (const member of processedSplitMembers) {
            await updateBalanceForUser(member.user, expense._id, 0, member.amount);
        }

        res.status(200).json({ msg: 'Expense updated with split', expense });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error updating expense', error: error.message });
    }
};
