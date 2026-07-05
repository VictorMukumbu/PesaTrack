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
  addExpenseSection,
} from "./dom.js";

import {
  getDefaultCategoryTotals,
  formatDate,
  clearInputs,
} from "./utils.js";

import { state } from "./state.js";

import { loadExpenses } from "./storage.js";

import {
  renderExpenses,
  addExpense as addExpenseTransaction,
  updateExpense,
  clearAllExpenses as clearAllExpensesTransaction,
} from "./transactions.js";

import {
  updateTotalUI,
  updateCategoryTotalsUI,
  updateInsightsUI,
  recalculateTotals,
} from "./dashboard.js";

import { renderCategoryChart } from "./chart.js";

import { showToast } from "./notifications.js";




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
    showToast(
      "Please enter expense name, amount, category, and date.",
      "warning"
    );
    return;
  }

  if (isNaN(expenseAmount) || expenseAmount <= 0) {
    showToast(
      "Amount must be greater than zero.",
      "error"
    );
    return;
  }

  const expense = {
    name: expenseName,
    amount: expenseAmount,
    category: expenseCategory,
    date: expenseDate
  };


  let message ="";

  if (state.editingExpenseIndex !== null) {
    updateExpense(expense);
    message = "Expense updated successfully!";
  } else {
    addExpenseTransaction(expense);
    message = "Expense added successfully!";
  }
  
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
  addExpenseSection.classList.remove("editing");

  showToast(message, "success");
}


function clearAllExpenses() {
  clearAllExpensesTransaction();

  state.categoryTotals = getDefaultCategoryTotals();
  state.total = 0;

  recalculateTotals();
  renderExpenses();
  renderCategoryChart();

  addExpenseBtn.textContent = "Add Expense";

  showToast(
    "All expenses cleared successfully!",
    "info"
  );
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