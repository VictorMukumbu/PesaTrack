import { totalAmountDisplay,foodTotalDisplay,transportTotalDisplay,
    airtimeTotalDisplay,billsTotalDisplay,otherTotalDisplay,
    totalExpensesCountDisplay,averageExpenseDisplay,topCategoryDisplay,
    lastExpenseDisplay,
 } from "./dom.js";

import { state } from "./state.js"; 

import { getDefaultCategoryTotals,formatDate } from "./utils.js";

function updateTotalUI() {
  totalAmountDisplay.textContent = `KES ${state.total.toFixed(2)}`;
}

function updateCategoryTotalsUI() {
  foodTotalDisplay.textContent = `KES ${state.categoryTotals["Food"].toFixed(2)}`;
  transportTotalDisplay.textContent = `KES ${state.categoryTotals["Transport"].toFixed(2)}`;
  airtimeTotalDisplay.textContent = `KES ${state.categoryTotals["Airtime/Data"].toFixed(2)}`;
  billsTotalDisplay.textContent = `KES ${state.categoryTotals["Bills"].toFixed(2)}`;
  otherTotalDisplay.textContent = `KES ${state.categoryTotals["Other"].toFixed(2)}`;
}
//update dashboard insights
function updateInsightsUI() {
  const totalExpensesCount = state.expenses.length;
  totalExpensesCountDisplay.textContent = totalExpensesCount;

  if (totalExpensesCount === 0) {
    averageExpenseDisplay.textContent = "KES 0.00";
    topCategoryDisplay.textContent = "No category yet";
    lastExpenseDisplay.textContent = "No expenses yet";
    return;
  }

  const averageExpense = state.total / totalExpensesCount;
  averageExpenseDisplay.textContent = `KES ${averageExpense.toFixed(2)}`;

  let topCategory = "None";
  let highestCategoryTotal = 0;

  for (const category in state.categoryTotals) {
    if (state.categoryTotals[category] > highestCategoryTotal) {
      highestCategoryTotal = state.categoryTotals[category];
      topCategory = category;
    }
  }

  topCategoryDisplay.textContent = topCategory;

  const lastExpense = state.expenses[state.expenses.length - 1];
  lastExpenseDisplay.textContent = `${lastExpense.name} - KES ${lastExpense.amount.toFixed(2)} (${lastExpense.category}, ${formatDate(lastExpense.date) || "No date"})`;
}

// recalculate totals from the expenses array
function recalculateTotals() {
  state.total = 0;
  state.categoryTotals = getDefaultCategoryTotals();

  state.expenses.forEach((expense) => {
    state.total += expense.amount;
    state.categoryTotals[expense.category] += expense.amount;
  });

  updateTotalUI();
  updateCategoryTotalsUI();
  updateInsightsUI();
}

export {
  updateTotalUI,
  updateCategoryTotalsUI,
  updateInsightsUI,
  recalculateTotals,
};