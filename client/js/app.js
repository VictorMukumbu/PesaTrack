import {
  totalAmountDisplay,
  expenseNameInput,
  expenseAmountInput,
  expenseCategoryInput,
  expenseDateInput,
  addExpenseBtn,
  clearExpensesBtn,
  exportCsvBtn,
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

  confirmModal,
  confirmTitle,
  confirmMessage,
  confirmActionBtn,
  cancelConfirmBtn,

  startDateFilter,
  endDateFilter,
  clearFiltersBtn,
} from "./dom.js";

import {
  getDefaultCategoryTotals,
  formatDate,
  clearInputs,
} from "./utils.js";

import { state } from "./state.js";

import { loadExpenses,saveExpenses, } from "./storage.js";

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

import { generateCSV,
  downloadCSV,
 } from "./export.js";




//  Confirmation Modal Helper

function openConfirmationModal(title, message,confirmButtonText, onConfirm) {
  confirmTitle.textContent = title;
  confirmMessage.textContent = message;

  confirmActionBtn.textContent = confirmButtonText;

  confirmModal.classList.remove("hidden");

  confirmActionBtn.onclick = () => {
    onConfirm();
    confirmModal.classList.add("hidden");
  };

  cancelConfirmBtn.onclick = () => {
    confirmModal.classList.add("hidden");
  };

  confirmModal.onclick = (event) => {
  if (event.target === confirmModal) {
    confirmModal.classList.add("hidden");
  }
};
}

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
  openConfirmationModal(
  "Clear All Expenses",
  "Are you sure you want to delete all expenses? This action cannot be undone.",
  "Delete All",
  () => {
      clearAllExpensesTransaction();

      state.categoryTotals = getDefaultCategoryTotals();
      state.total = 0;
      state.editingExpenseIndex = null;

      recalculateTotals();
      renderExpenses();
      renderCategoryChart();

      addExpenseBtn.textContent = "Add Expense";
      addExpenseSection.classList.remove("editing");

      showToast(
        "All expenses cleared successfully!",
        "info"
      );
    }
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


function exportCSV() {
  if (state.expenses.length === 0) {
    showToast(
      "There are no expenses to export.",
      "warning"
    );
    return;
  }

  const csv = generateCSV();

  // console.log(csv);
  downloadCSV(csv);

  showToast(
    "CSV generated successfully!",
    "success"
  );
}


addExpenseBtn.addEventListener("click", addExpense);
clearExpensesBtn.addEventListener("click", clearAllExpenses);
exportCsvBtn.addEventListener(
  "click",
  exportCSV
);
searchExpenseInput.addEventListener("input", renderExpenses);
sortExpensesSelect.addEventListener("change", renderExpenses);

startDateFilter.addEventListener(
  "change",
  renderExpenses
);
endDateFilter.addEventListener(
  "change",
  renderExpenses
);

expenseList.addEventListener("deleteExpense", (event) => {
  const expense = event.detail;

  openConfirmationModal(
    "Delete Expense",
    `Are you sure you want to delete "${expense.name}"?\nThis action cannot be undone.`,
    "Delete",
    () => {
      state.expenses = state.expenses.filter(
        (item) => item !== expense
      );

      saveExpenses();

      recalculateTotals();
      renderExpenses();
      renderCategoryChart();

      showToast(
        "Expense deleted successfully!",
        "info"
      );
    }
  );
});

window.addEventListener("scroll", updateActiveNavLink);
window.addEventListener("load", updateActiveNavLink);

window.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    !confirmModal.classList.contains("hidden")
  ) {
    confirmModal.classList.add("hidden");
  }
});

loadExpenses();

recalculateTotals();
renderExpenses();
renderCategoryChart();