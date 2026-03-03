const express = require('express');
const router = express.Router();
const controllers = require('../controllers/controllers');

// Get all transactions
router.get('/transactions', controllers.getTransactions);

// Add a new transaction
router.post('/transactions', controllers.addTransaction);

// Update a transaction
router.put('/transactions/:id', controllers.updateTransaction);

// Delete a transaction
router.delete('/transactions/:id', controllers.deleteTransaction);

module.exports = router;