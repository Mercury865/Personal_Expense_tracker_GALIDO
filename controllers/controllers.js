const Transaction = require('../models/transaction');

// Get all transactions
async function getTransactions(req, res) {
  try {

    const list = await Transaction.find().sort({ date: -1, createdAt: -1 });

    const result = await Transaction.aggregate([
      {
        $group: {
          _id: null,
          total_income: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } },
          total_expenses: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } }
        }
      }
    ]);

    const tot = result[0] || { total_income: 0, total_expenses: 0 };
    const bal = tot.total_income - tot.total_expenses;

    res.json({
      success: true,
      data: {
        transactions: list,
        total_income: tot.total_income,
        total_expenses: tot.total_expenses,
        balance: bal
      }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch transactions."
    });
  }
}


// Add transaction
async function addTransaction(req, res) {
  try {

    const type = req.body.type;
    const amount = req.body.amount;
    const category = req.body.category;
    const description = req.body.description;
    const date = req.body.date;

    const tx = await Transaction.create({
      type: type,
      amount: amount,
      category: category,
      description: description,
      date: date
    });

    res.status(201).json({
      success: true,
      data: tx
    });

  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
}


// Update transaction
async function updateTransaction(req, res) {
  try {

    const id = req.params.id;

    const updated = await Transaction.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found."
      });
    }

    res.json({
      success: true,
      data: updated
    });

  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
}


// Delete transaction
async function deleteTransaction(req, res) {
  try {

    const id = req.params.id;

    const deleted = await Transaction.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found."
      });
    }

    res.json({
      success: true,
      message: "Transaction is deleted."
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed to delete transaction."
    });
  }
}

module.exports = {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction
};