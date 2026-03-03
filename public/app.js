// Get elements
const form = document.getElementById('tx-form');
const txList = document.getElementById('transactions');
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expenses');

// Helpers
function formatCurrency(n) {
  return '₱' + parseFloat(n).toFixed(2);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

// Load all transactions
async function loadTransactions() {
  try {
    const res = await fetch('/api/transactions');
    const data = await res.json();

    if (!data.success) {
      console.error(data.message);
      return;
    }

    const txs = data.data.transactions;
    txList.innerHTML = '';

    txs.forEach(tx => {
      const li = document.createElement('li');
      li.textContent = `${tx.type.toUpperCase()} | ${tx.category} | ${formatCurrency(tx.amount)} | ${tx.description || ''} | ${formatDate(tx.date)}`;

      // Edit button
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.onclick = () => editTransaction(tx);
      li.appendChild(editBtn);

      // Delete button
      const delBtn = document.createElement('button');
      delBtn.textContent = 'Delete';
      delBtn.onclick = () => deleteTransaction(tx._id);
      li.appendChild(delBtn);

      txList.appendChild(li);
    });

    // Use backend totals
    incomeEl.textContent = formatCurrency(data.data.total_income || 0);
    expenseEl.textContent = formatCurrency(data.data.total_expenses || 0);
    balanceEl.textContent = formatCurrency(data.data.balance || 0);

  } catch (err) {
    console.error('Error loading transactions:', err);
  }
}

// Add transaction
form.addEventListener('submit', async e => {
  e.preventDefault();

  const dateInput = document.getElementById('date').value;

  const tx = {
    type: document.getElementById('type').value,
    amount: parseFloat(document.getElementById('amount').value),
    category: document.getElementById('category').value,
    description: document.getElementById('description').value,
    date: dateInput
  };

  if (!tx.amount || !tx.category || !dateInput) {
    alert('Please fill out all required fields!');
    return;
  }

  const response = await fetch('/api/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tx)
  });

  const result = await response.json();
  if (!result.success) {
    alert('Error: ' + result.message);
    return;
  }

  form.reset();
  loadTransactions();
});

// Edit transaction
async function editTransaction(tx) {
  const newAmount = prompt('Amount', tx.amount);
  const newCategory = prompt('Category', tx.category);
  const newDesc = prompt('Description', tx.description || '');
  const newDate = prompt('Date (YYYY-MM-DD)', formatDate(tx.date));

  const response = await fetch(`/api/transactions/${tx._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: tx.type,
      amount: parseFloat(newAmount),
      category: newCategory,
      description: newDesc,
      date: newDate
    })
  });

  const result = await response.json();
  if (!result.success) {
    alert('Error: ' + result.message);
    return;
  }

  loadTransactions();
}

// Delete transaction
async function deleteTransaction(id) {
  if (!confirm('Delete this transaction?')) return;

  await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
  loadTransactions();
}

// Initialize
document.getElementById('date').value = new Date().toISOString().split('T')[0];
loadTransactions();