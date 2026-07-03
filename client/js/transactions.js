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
    addExpenseSection.classList.add("editing");

    // scroll to the add/edit form and focus the name input for better UX
    addExpenseSection.scrollIntoView({
    behavior: "smooth",
    });

    expenseNameInput.focus();
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("delete-btn");

  deleteBtn.addEventListener("click", function () {
  state.expenses = state.expenses.filter((item) => item !== expense);

  saveExpenses();

  expenseList.dispatchEvent(
    new CustomEvent("expenseDeleted")
  );
});

  listItem.appendChild(nameSpan);
  listItem.appendChild(categorySpan);
  listItem.appendChild(dateSpan);
  listItem.appendChild(amountSpan);
  listItem.appendChild(editBtn);
  listItem.appendChild(deleteBtn);

  expenseList.appendChild(listItem);
}

function renderExpenses() {
  expenseList.innerHTML = "";

  const searchTerm = searchExpenseInput.value.toLowerCase();
  const sortValue = sortExpensesSelect.value;

  let filteredExpenses = state.expenses.filter((expense) => {
    const nameMatch = expense.name.toLowerCase().includes(searchTerm);
    const categoryMatch = expense.category.toLowerCase().includes(searchTerm);
    const dateMatch = (expense.date || "").toLowerCase().includes(searchTerm);

    return nameMatch || categoryMatch || dateMatch;
  });

  if (sortValue === "name-asc") {
    filteredExpenses.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortValue === "name-desc") {
    filteredExpenses.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortValue === "amount-asc") {
    filteredExpenses.sort((a, b) => a.amount - b.amount);
  } else if (sortValue === "amount-desc") {
    filteredExpenses.sort((a, b) => b.amount - a.amount);
  } else if (sortValue === "category-asc") {
    filteredExpenses.sort((a, b) => a.category.localeCompare(b.category));
  }

  if (filteredExpenses.length === 0) {
    const emptyMessage = document.createElement("li");

    if (state.expenses.length === 0) {
      emptyMessage.textContent = "No expenses added yet.";
    } else {
      emptyMessage.textContent = "No matching expenses found.";
    }

    expenseList.appendChild(emptyMessage);
    return;
  }

  filteredExpenses.forEach((expense) => {
    createExpenseListItem(expense);
  });

//   renderCategoryChart();

}

export {
  createExpenseListItem,renderExpenses
};