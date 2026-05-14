const API_URL = '/api/expenses';
const expenseForm = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const totalAmountEl = document.getElementById('total-amount');

let expenses = [];

// Fetch all expenses
async function fetchExpenses() {
    try {
        const response = await fetch(API_URL);
        expenses = await response.json();
        renderExpenses();
    } catch (error) {
        console.error('Error fetching expenses:', error);
    }
}

// Render expenses to UI
function renderExpenses() {
    expenseList.innerHTML = '';
    let total = 0;

    expenses.forEach(expense => {
        total += expense.amount;
        const item = document.createElement('div');
        item.className = 'expense-item';
        item.innerHTML = `
            <div class="expense-info">
                <span class="expense-title">${expense.title}</span>
                <span class="expense-meta">${expense.category} • ${new Date(expense.date).toLocaleDateString()}</span>
            </div>
            <div class="expense-amount-row">
                <span class="expense-amount">$${expense.amount.toFixed(2)}</span>
                <button class="btn-delete" onclick="deleteExpense(${expense.id})">
                    <i data-lucide="trash-2" style="width: 18px; height: 18px;"></i>
                </button>
            </div>
        `;
        expenseList.appendChild(item);
    });

    totalAmountEl.textContent = `$${total.toFixed(2)}`;
    lucide.createIcons();
}

// Add new expense
expenseForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const amount = document.getElementById('amount').value;
    const category = document.getElementById('category').value;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, amount, category })
        });

        if (response.ok) {
            expenseForm.reset();
            fetchExpenses();
        }
    } catch (error) {
        console.error('Error adding expense:', error);
    }
});

// Delete expense
async function deleteExpense(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            fetchExpenses();
        }
    } catch (error) {
        console.error('Error deleting expense:', error);
    }
}

// Initial fetch
fetchExpenses();
