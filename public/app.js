const form = document.getElementById("form-area");
const list = document.getElementById("transactions");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expenses = document.getElementById("expenses");

// edit elements
const editTypeSelect = document.getElementById("edit-type");
const editModal = document.getElementById("edit-modal");
const editAmountInput = document.getElementById("edit-amount");
const editCategorySelect = document.getElementById("edit-category");
const editDescriptionInput = document.getElementById("edit-description");
const editDateInput = document.getElementById("edit-date");
const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");

let currentTransactionId = null;

function loadTransactions() {
    fetch("/api/transactions")
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if (data.success === false) {
                console.log("Error loading data");
                return;
            }

            const transactions = data.data.transactions;

            list.innerHTML = "";

            for (let i = 0; i < transactions.length; i++) {
                const t = transactions[i];

                const item = document.createElement("li");

                const date = new Date(t.date).toISOString().split("T")[0];

                // Create the text to display: happy face for income, sad face for expense lol
                let typeIcon;
                if (t.type === "expense") {
                    typeIcon = "😢";
                } else {
                    typeIcon = "😊";
                }
                const text =
                    typeIcon + " : " 
                    + t.category + " : ₱" 
                    + parseFloat(t.amount) +" : " 
                    + "Desc: \"" + (t.description || "") + "\" : " 
                    + date;

                item.textContent = text;

                const editButton = document.createElement("button");
                editButton.textContent = "Edit";
                editButton.type = "button";
                editButton.onclick = function() {
                    editTransaction(t);
                };

                // Create a Delete button
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.type = "button";
                deleteButton.onclick = function() {
                    deleteTransaction(t._id);
                };

                // Add buttons to the list 
                item.appendChild(editButton);
                item.appendChild(deleteButton);

                // Add the list item to the page itself
                list.appendChild(item);
            }

            income.textContent = "₱" + (data.data.total_income || 0).toFixed(2);
            expenses.textContent = "₱" + (data.data.total_expenses || 0).toFixed(2);
            balance.textContent = "₱" + (data.data.balance || 0).toFixed(2);
        });
}

form.addEventListener("submit", function(e) {
    e.preventDefault();

    // Get the values from the form
    const type = document.getElementById("type").value;
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value;
    const date = document.getElementById("date").value;

    // Check if all required fields are actually filled or not
    if (amount === "" || category === "" || date === "") {
        alert("Fill out ALL the required fields!");
        return;
    }

    const amountNumber = parseFloat(amount);
    const transaction = {
        type: type,
        amount: amountNumber,
        category: category,
        description: description,
        date: date
    };

    // Send the transaction to the server
    fetch("/api/transactions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(transaction)
    })
        .then(function(response) {
            return response.json();
        })
        .then(function(result) {
            if (result.success === false) {
                alert("Error: " + result.message);
                return;
            }

            form.reset();

            const today = new Date().toISOString().split("T")[0];
            document.getElementById("date").value = today;

            loadTransactions();
        });
});

function editTransaction(transaction) {
    // Store the transaction ID to use in save
    currentTransactionId = transaction._id;

    // Fill the edit tab with current transaction data
    editAmountInput.value = transaction.amount;
    editCategorySelect.value = transaction.category;
    editDescriptionInput.value = transaction.description || "";
    editDateInput.value = new Date(transaction.date).toISOString().split("T")[0];

    // Show the edit screen
    editModal.classList.remove("hidden");
}

// Save button click handler
saveBtn.addEventListener("click", function() {
    const updated = {
        type: editTypeSelect.value, 
        amount: parseFloat(editAmountInput.value),
        category: editCategorySelect.value,
        description: editDescriptionInput.value,
        date: editDateInput.value
    };

    fetch("/api/transactions/" + currentTransactionId, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updated)
    })
        .then(function(response) {
            return response.json();
        })
        .then(function(result) {
            if (result.success === false) {
                alert("Error: " + result.message);
                return;
            }

            // Hides it
            editModal.classList.add("hidden");
            
            loadTransactions();
        });
});

// Cancel button click handler
cancelBtn.addEventListener("click", function() {
    editModal.classList.add("hidden");
});

function deleteTransaction(id) {
    const confirmDelete = confirm("Delete this transaction?");

    // If the user clicks cancel, then it stops
    if (confirmDelete === false) {
        return;
    }

    fetch("/api/transactions/" + id, {
        method: "DELETE"
    })
        .then(function(response) {
            return response.json();
        })
        .then(function(result) {
            loadTransactions();
        });
}

const today = new Date().toISOString().split("T")[0];
document.getElementById("date").value = today;

loadTransactions();