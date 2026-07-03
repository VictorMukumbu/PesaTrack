import {
  expenseList,
  expenseNameInput,
  expenseAmountInput,
  expenseCategoryInput,
  expenseDateInput,
  addExpenseBtn,
  searchExpenseInput,
  sortExpensesSelect,
  addExpenseSection,
} from "./dom.js";

import { state } from "./state.js";

import {
  formatDate,
  clearInputs,
} from "./utils.js";

import {
  saveExpenses,
  clearExpenseStorage,
} from "./storage.js";

function createExpenseListItem(expense) {
  const listItem = document.createElement("li");

  const nameSpan = document.createElement("span");
  nameSpan.classList.add("name");
  nameSpan.textContent = expense.name;

  const categorySpan = document.createElement("span");
  categorySpan.classList.add("category");
  categorySpan.textContent = expense.category;

  const dateSpan = document.createElement("span");
  dateSpan.classList.add("date");
  dateSpan.textContent = formatDate(expense.date);
  
  const amountSpan = document.createElement("span");
  amountSpan.classList.add("amount");
  amountSpan.textContent = `KES ${expense.amount.toFixed(2)}`;

  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.textContent = "Edit";
  editBtn.classList.add("edit-btn");

  editBtn.addEventListener("click", function () {
    const expenseIndex = state.expenses.indexOf(expense);

    state.editingExpenseIndex = expenseIndex;

    expenseNameInput.value = expense.name;
    expenseAmountInput.value = expense.amount;
    expenseCategoryInput.value = expense.category;
    expenseDateInput.value = expense.date || "";


    addExpenseBtn.textContent = "Update Expense";

    // add editing class to highlight the form when in edit mode
    document
    .getElementById("addExpenseSection")
    .classList.add("editing");

    // scroll to the add/edit form and focus the name input for better UX
    document
      .getElementById("addExpenseSection")
      .scrollIntoView({ behavior: "smooth" });

    expenseNameInput.focus();
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("delete-btn");

  deleteBtn.addEventListener("click", function () {
    state.expenses = state.expenses.filter((item) => item !== expense);
    saveExpenses();
    recalculateTotals();
    renderExpenses();
  });

  listItem.appendChild(nameSpan);
  listItem.appendChild(categorySpan);
  listItem.appendChild(dateSpan);
  listItem.appendChild(amountSpan);
  listItem.appendChild(editBtn);
  listItem.appendChild(deleteBtn);

  expenseList.appendChild(listItem);
}

export {
  createExpenseListItem,
};