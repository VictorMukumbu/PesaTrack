let total = 0;
let expenses = [];
let editingExpenseIndex = null;

// one reusable function that returns a fresh category totals object
function getDefaultCategoryTotals() {
  return {
    Food: 0,
    Transport: 0,
    "Airtime/Data": 0,
    Bills: 0,
    Other: 0
  };
}



let categoryTotals = getDefaultCategoryTotals();

const totalAmountDisplay = document.getElementById("totalAmount");

const expenseNameInput = document.getElementById("expenseName");
const expenseAmountInput = document.getElementById("expenseAmount");
const expenseCategoryInput = document.getElementById("expenseCategory");
const expenseDateInput = document.getElementById("expenseDate");

const addExpenseBtn = document.getElementById("addExpenseBtn");
const clearExpensesBtn = document.getElementById("clearExpensesBtn");
const expenseList = document.getElementById("expenseList");

const searchExpenseInput = document.getElementById("searchExpense");
const sortExpensesSelect = document.getElementById("sortExpenses");

const foodTotalDisplay = document.getElementById("foodTotal");
const transportTotalDisplay = document.getElementById("transportTotal");
const airtimeTotalDisplay = document.getElementById("airtimeTotal");
const billsTotalDisplay = document.getElementById("billsTotal");
const otherTotalDisplay = document.getElementById("otherTotal");

const totalExpensesCountDisplay = document.getElementById("totalExpensesCount");
const averageExpenseDisplay = document.getElementById("averageExpense");
const topCategoryDisplay = document.getElementById("topCategory");
const lastExpenseDisplay = document.getElementById("lastExpense");

function updateTotalUI() {
  totalAmountDisplay.textContent = `KES ${total.toFixed(2)}`;
}

function updateCategoryTotalsUI() {
  foodTotalDisplay.textContent = `KES ${categoryTotals["Food"].toFixed(2)}`;
  transportTotalDisplay.textContent = `KES ${categoryTotals["Transport"].toFixed(2)}`;
  airtimeTotalDisplay.textContent = `KES ${categoryTotals["Airtime/Data"].toFixed(2)}`;
  billsTotalDisplay.textContent = `KES ${categoryTotals["Bills"].toFixed(2)}`;
  otherTotalDisplay.textContent = `KES ${categoryTotals["Other"].toFixed(2)}`;
}
//update dashboard insights
function updateInsightsUI() {
  const totalExpensesCount = expenses.length;
  totalExpensesCountDisplay.textContent = totalExpensesCount;

  if (totalExpensesCount === 0) {
    averageExpenseDisplay.textContent = "KES 0.00";
    topCategoryDisplay.textContent = "No category yet";
    lastExpenseDisplay.textContent = "No expenses yet";
    return;
  }

  const averageExpense = total / totalExpensesCount;
  averageExpenseDisplay.textContent = `KES ${averageExpense.toFixed(2)}`;

  let topCategory = "None";
  let highestCategoryTotal = 0;

  for (const category in categoryTotals) {
    if (categoryTotals[category] > highestCategoryTotal) {
      highestCategoryTotal = categoryTotals[category];
      topCategory = category;
    }
  }

  topCategoryDisplay.textContent = topCategory;

  const lastExpense = expenses[expenses.length - 1];
  lastExpenseDisplay.textContent = `${lastExpense.name} - KES ${lastExpense.amount.toFixed(2)} (${lastExpense.category}, ${formatDate(lastExpense.date) || "No date"})`;
}

// recalculate totals from the expenses array
function recalculateTotals() {
  total = 0;
  categoryTotals = getDefaultCategoryTotals();

  expenses.forEach((expense) => {
    total += expense.amount;
    categoryTotals[expense.category] += expense.amount;
  });

  updateTotalUI();
  updateCategoryTotalsUI();
  updateInsightsUI();
}

function saveExpensesToLocalStorage() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

// one function that clears the form inputs
function clearInputs() {
  expenseNameInput.value = "";
  expenseAmountInput.value = "";
  expenseCategoryInput.value = "";
  expenseDateInput.value = "";
}

//make date readable
function formatDate(dateString) {
  if (!dateString) return "No date";// handle empty date
  
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "Invalid date";
  }//handle invalid date input

  const options = {
    day: "numeric",
    month: "short",
    year: "numeric"
  };

  return date.toLocaleDateString("en-GB", options);
}

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
    const expenseIndex = expenses.indexOf(expense);

    editingExpenseIndex = expenseIndex;

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
    expenses = expenses.filter((item) => item !== expense);
    saveExpensesToLocalStorage();
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

function renderExpenses() {
  expenseList.innerHTML = "";

  const searchTerm = searchExpenseInput.value.toLowerCase();
  const sortValue = sortExpensesSelect.value;

  let filteredExpenses = expenses.filter((expense) => {
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

    if (expenses.length === 0) {
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

  renderCategoryChart();

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

  if (editingExpenseIndex !== null) {
    expenses[editingExpenseIndex] = expense;
    editingExpenseIndex = null;
  } else {
    expenses.push(expense);
  }
  saveExpensesToLocalStorage();
  
  recalculateTotals();
  renderExpenses();

  clearInputs();

  addExpenseBtn.textContent = "Add Expense";
  // remove editing class to return form to normal state
  document
  .getElementById("addExpenseSection")
  .classList.remove("editing");
}


function clearAllExpenses() {
  expenses = [];
  categoryTotals = getDefaultCategoryTotals();
  total = 0;
  editingExpenseIndex = null;

  localStorage.removeItem("expenses");
  recalculateTotals();
  renderExpenses();

  addExpenseBtn.textContent = "Add Expense";
}

const navLinks = document.querySelectorAll(".section-nav a");
const trackedSections = document.querySelectorAll(
  "#addExpenseSection, #expensesSection, #insightsSection,#spendingChartSection, #categoryTotalsSection"
);

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

function renderCategoryChart() {
  const chartContainer = document.getElementById("categoryChart");

  // clear previous chart
  chartContainer.innerHTML = "";

  const maxValue = Math.max(...Object.values(categoryTotals), 1);

  for (let category in categoryTotals) {
    const amount = categoryTotals[category];

    const percentage = (amount / maxValue) * 100;

    const row = document.createElement("div");
    row.className = "chart-row";

    row.innerHTML = `
      <div class="chart-label">${category}</div>
      <div class="chart-bar-container">
        <div class="chart-bar" style="width:${percentage}%"></div>
      </div>
      <div class="chart-value">KES ${amount.toFixed(2)}</div>
    `;

    chartContainer.appendChild(row);
  }
}


function loadExpensesFromLocalStorage() {
  const savedExpenses = localStorage.getItem("expenses");

  if (!savedExpenses) {
    return;
  }

  expenses = JSON.parse(savedExpenses);
  
  recalculateTotals();
  renderExpenses();

}

addExpenseBtn.addEventListener("click", addExpense);
clearExpensesBtn.addEventListener("click", clearAllExpenses);
searchExpenseInput.addEventListener("input", renderExpenses);
sortExpensesSelect.addEventListener("change", renderExpenses);

window.addEventListener("scroll", updateActiveNavLink);
window.addEventListener("load", updateActiveNavLink);

loadExpensesFromLocalStorage();