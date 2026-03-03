const Transaction = require('../models/transaction');

// Get all transactions
async function getTransactions(req, res) {
  try {
    const transactions = await Transaction.find().sort({ date: -1, createdAt: -1 });

    const stats = await Transaction.aggregate([
      {
        $group: {
          _id: null,
          total_income: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } },
          total_expenses: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } }
        }
      }
    ]);

    const totals = stats[0] || { total_income: 0, total_expenses: 0 };
    const balance = totals.total_income - totals.total_expenses;

    res.json({ 
      success: true, 
      data: { transactions, total_income: totals.total_income, total_expenses: totals.total_expenses, balance } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch transactions.' });
  }
}

// Add a transaction
async function addTransaction(req, res) {
  try {
    const { type, amount, category, description, date } = req.body;
    const newTx = await Transaction.create({ type, amount, category, description, date });
    res.status(201).json({ success: true, data: newTx });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
}

// Update a transaction
async function updateTransaction(req, res) {
  try {
    const updatedTx = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedTx) return res.status(404).json({ success: false, message: 'Transaction not found.' });

    res.json({ success: true, data: updatedTx });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
}

// Delete a transaction
async function deleteTransaction(req, res) {
  try {
    const deletedTx = await Transaction.findByIdAndDelete(req.params.id);

    if (!deletedTx) return res.status(404).json({ success: false, message: 'Transaction not found.' });

    res.json({ success: true, message: 'Transaction deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to delete transaction.' });
  }
}

module.exports = {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction
};