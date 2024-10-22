const Balance = require('../models/Balance');
const User = require('../models/User');
const Expense = require('../models/Expense');
const ExcelJS = require('exceljs');

exports.downloadBalanceSheet = async (req, res) => {
    const { id } = req.params; // User ID

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const balanceSheet = await Balance.findOne({ userId: id });
    if (!balanceSheet) return res.status(404).json({ msg: 'No balance sheet found for this user' });

    const expenses = await Expense.find({
        $or: [
            { creator: id },
            { "split_members.user": id }
        ]
    });

    // Create a new Excel workbook
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Balance Sheet');

    // Style for labels
    const labelStyle = {
        font: { bold: true, color: { argb: 'FFFFFFFF' } },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0000FF' } },
        alignment: { vertical: 'middle', horizontal: 'center' },
        border: {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }
    };

    // Style for data
    const dataStyle = {
        alignment: { vertical: 'middle', horizontal: 'center' },
        border: {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }
    };

    // Add user details section
    sheet.addRow(['User Details']).font = { bold: true, size: 16 };
    sheet.mergeCells('A1:E1');

    sheet.addRow(['Name', 'Phone', 'Email', 'Total Expense Created', 'Total Paid in Split']);
    const userDetailsRow = [
        user.name, 
        user.phone, 
        user.email, 
        balanceSheet.total_expense_created, 
        balanceSheet.total_paid_in_split
    ];
    sheet.addRow(userDetailsRow);

    // Format the user details cells
    sheet.getRow(3).eachCell(cell => cell.style = labelStyle);
    sheet.getRow(4).eachCell(cell => cell.style = dataStyle);

    // Add expenses section
    sheet.addRow([]);
    sheet.addRow(['Expenses']).font = { bold: true, size: 16 };
    sheet.mergeCells('A6:E6');

    sheet.addRow([ 'Description', 'Amount', 'Split Type', 'Created At', 'Split Members']);
    sheet.getRow(7).eachCell(cell => cell.style = labelStyle);

    expenses.forEach(exp => {
        const expenseRow = [
            exp.description,
            exp.amount,
            exp.split_type,
            new Date(exp.createdAt).toLocaleString(),
            exp.split_members.length
                ? exp.split_members.map(member => `${member.user} (amount: ${member.amount})`).join(', ')
                : 'None'
        ];
        sheet.addRow(expenseRow);
        sheet.getRow(sheet.rowCount).eachCell(cell => cell.style = dataStyle);
    });

    // Set column widths for better visibility
    sheet.columns = [
        { width: 25 },
        { width: 30 },
        { width: 15 },
        { width: 15 },
        { width: 25 },
        { width: 500 }
    ];

    // Write the workbook to a file and send as a response
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="balance_sheet.xlsx"');

    await workbook.xlsx.write(res);
    res.end();
};
