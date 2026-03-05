const Transaction = require('../models/transaction');

// Get all transactions
async function getTransactions(req, res) {
  try {
    const list = await Transaction.find().sort({ date: -1 });

    let total_income = 0;
    let total_expenses = 0;

    for (let i = 0; i < list.length; i++) {
      if (list[i].type === 'income') {
        total_income += list[i].amount;
      } else if (list[i].type === 'expense') {
        total_expenses += list[i].amount;
      }
    }

    // calculates the balance based on the present transacts
    const balance = total_income - total_expenses;

    res.json({
      success: true,
      data: {
        transactions: list,
        total_income: total_income,
        total_expenses: total_expenses,
        balance: balance
      }
    });
  } catch (err) {
    res.json({ success: false, message: "Failed to fetch transactions." });
  }
}

// Add transaction
async function addTransaction(req, res) {
  try {
    const tx = await Transaction.create(req.body);
    res.json({ success: true, data: tx });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
}

// Updates the transaction
async function updateTransaction(req, res) {
  try {
    const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    if (!updated) {
      return res.json(
        { 
          success: false, 
          message: "Transaction not found." 
        });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
}

// Delete transaction
async function deleteTransaction(req, res) {
  try {
    const deleted = await Transaction.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.json(
        { success: false, 
          message: "Transaction not found." 
        });
    }

    res.json({ success: true, message: "Transaction deleted." });
  } catch (err) {
    res.json({ success: false, message: "Failed to delete transaction." });
  }
}

module.exports = { getTransactions, addTransaction, updateTransaction, deleteTransaction };