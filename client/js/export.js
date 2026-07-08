// ======================================================
// PesaTrack Export Module
// Converts expenses into CSV format
// ======================================================

import { state } from "./state.js";

export function generateCSV() {
  const headers = [
    "Expense",
    "Amount (KES)",
    "Category",
    "Date",
  ];

  const rows = state.expenses.map((expense) => [
    expense.name,
    expense.amount,
    expense.category,
    expense.date,
  ]);

  return [
    headers,
    ...rows,
  ]
    .map((row) => row.join(","))
    .join("\n");
}