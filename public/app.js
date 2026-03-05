// Get HTML elements
const form = document.getElementById("tx-form");
const list = document.getElementById("transactions");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expenses = document.getElementById("expenses");

// Load transactions from server
async function loadTransactions() {

    const response = await fetch("/api/transactions");
    const data = await response.json();

    if (!data.success) {
        console.log("Error loading data");
        return;
    }

    const transactions = data.data.transactions;

    list.innerHTML = "";

    for (let i = 0; i < transactions.length; i++) {

        const t = transactions[i];

        const item = document.createElement("li");

        const date = new Date(t.date).toISOString().split("T")[0];

        item.textContent =
            t.type.toUpperCase() +
            " | " +
            t.category +
            " | ₱" +
            parseFloat(t.amount).toFixed(2) +
            " | " +
            (t.description || "") +
            " | " +
            date;

        // Edit button
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.onclick = function () {
            editTransaction(t);
        };

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = function () {
            deleteTransaction(t._id);
        };

        item.appendChild(editButton);
        item.appendChild(deleteButton);

        list.appendChild(item);
    }

    income.textContent = "₱" + (data.data.total_income || 0).toFixed(2);
    expenses.textContent = "₱" + (data.data.total_expenses || 0).toFixed(2);
    balance.textContent = "₱" + (data.data.balance || 0).toFixed(2);
}


// Add transaction
form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const type = document.getElementById("type").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value;
    const date = document.getElementById("date").value;

    if (!amount || !category || !date) {
        alert("Please fill out all required fields.");
        return;
    }

    const transaction = {
        type: type,
        amount: amount,
        category: category,
        description: description,
        date: date
    };

    const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(transaction)
    });

    const result = await response.json();

    if (!result.success) {
        alert("Error: " + result.message);
        return;
    }

    form.reset();

    document.getElementById("date").value =
        new Date().toISOString().split("T")[0];

    loadTransactions();
});


// Edit transaction
async function editTransaction(transaction) {

    const newAmount = prompt("Amount:", transaction.amount);
    const newCategory = prompt("Category:", transaction.category);
    const newDescription = prompt("Description:", transaction.description || "");
    const newDate = prompt(
        "Date (YYYY-MM-DD):",
        new Date(transaction.date).toISOString().split("T")[0]
    );

    const updated = {
        type: transaction.type,
        amount: parseFloat(newAmount),
        category: newCategory,
        description: newDescription,
        date: newDate
    };

    const response = await fetch("/api/transactions/" + transaction._id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updated)
    });

    const result = await response.json();

    if (!result.success) {
        alert("Error: " + result.message);
        return;
    }

    loadTransactions();
}


// Delete transaction
async function deleteTransaction(id) {

    const confirmDelete = confirm("Delete this transaction?");
    if (!confirmDelete) return;

    await fetch("/api/transactions/" + id, {
        method: "DELETE"
    });

    loadTransactions();
}


// Set today's date when page loads
document.getElementById("date").value =
    new Date().toISOString().split("T")[0];

loadTransactions();