import {
  totalAmountDisplay,
  expenseNameInput,
  expenseAmountInput,
  expenseCategoryInput,
  expenseDateInput,
  addExpenseBtn,
  clearExpensesBtn,
  expenseList,
  searchExpenseInput,
  sortExpensesSelect,
  foodTotalDisplay,
  transportTotalDisplay,
  airtimeTotalDisplay,
  billsTotalDisplay,
  otherTotalDisplay,
  totalExpensesCountDisplay,
  averageExpenseDisplay,
  topCategoryDisplay,
  lastExpenseDisplay,
  navLinks,
  trackedSections,
  categoryChart,
} from "./dom.js";

import {
  getDefaultCategoryTotals,
  formatDate,
  clearInputs,
} from "./utils.js";

import { state } from "./state.js";

import {
  saveExpenses,
  loadExpenses,
  clearExpenseStorage,
} from "./storage.js";

import {
  createExpenseListItem,renderExpenses,
} from "./transactions.js";

import {
  updateTotalUI,
  updateCategoryTotalsUI,
  updateInsightsUI,
  recalculateTotals,
} from "./dashboard.js";

import { renderCategoryChart } from "./chart.js";






function addExpense() {
  const expenseName = expenseNameInput.value.trim();
  const expenseAmount = Number(expenseAmountInput.value);
  const expenseCategory = expenseCategoryInput.value;
  const expenseDate = expenseDateInput.value;

  if (
    expenseName === "" ||
    expenseAmountInput.value.trim() === "" ||
    expenseCategory === "" ||
    expenseDate === ""
  ) {
    alert("Please enter expense name, amount, category, and date.");
    return;
  }

  if (isNaN(expenseAmount) || expenseAmount <= 0) {
    alert("Amount must be greater than zero.");
    return;
  }

  const expense = {
    name: expenseName,
    amount: expenseAmount,
    category: expenseCategory,
    date: expenseDate
  };

  if (state.editingExpenseIndex !== null) {
    state.expenses[state.editingExpenseIndex] = expense;
    state.editingExpenseIndex = null;
  } else {
    state.expenses.push(expense);
  }
  saveExpenses ();
  
  recalculateTotals();
  renderExpenses();
  renderCategoryChart();

  clearInputs({
    expenseNameInput,
    expenseAmountInput,
    expenseCategoryInput,
    expenseDateInput,
  });

  addExpenseBtn.textContent = "Add Expense";
  // remove editing class to return form to normal state
  document
  .getElementById("addExpenseSection")
  .classList.remove("editing");
}


function clearAllExpenses() {
  state.expenses = [];
  state.categoryTotals = getDefaultCategoryTotals();
  state.total = 0;
  state.editingExpenseIndex = null;

  clearExpenseStorage();
  recalculateTotals();
  renderExpenses();
  renderCategoryChart();

  addExpenseBtn.textContent = "Add Expense";
}


// focus on updating active nav link based on scroll position
function updateActiveNavLink() {
  let currentSectionId = "";

  trackedSections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      currentSectionId = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");

    const targetId = link.getAttribute("href").slice(1);

    if (targetId === currentSectionId) {
      link.classList.add("active");
    }
  });
}





addExpenseBtn.addEventListener("click", addExpense);
clearExpensesBtn.addEventListener("click", clearAllExpenses);
searchExpenseInput.addEventListener("input", renderExpenses);
sortExpensesSelect.addEventListener("change", renderExpenses);

expenseList.addEventListener("expenseDeleted", () => {
  recalculateTotals();

  renderExpenses();

  renderCategoryChart();
});

window.addEventListener("scroll", updateActiveNavLink);
window.addEventListener("load", updateActiveNavLink);

loadExpenses();

recalculateTotals();
renderExpenses();
renderCategoryChart();