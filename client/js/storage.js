// ======================================================
// PesaTrack Storage Module
// Handles saving/loading application data
// ======================================================

import { state } from "./state.js";

export function saveExpenses() {
  localStorage.setItem(
    "expenses",
    JSON.stringify(state.expenses)
  );
}

export function loadExpenses() {
  const savedExpenses = localStorage.getItem("expenses");

  if (!savedExpenses) return;

  state.expenses = JSON.parse(savedExpenses);
}

export function clearExpenseStorage() {
  localStorage.removeItem("expenses");
}