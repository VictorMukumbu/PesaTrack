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

export function downloadCSV(csvData) {
  const blob = new Blob([csvData], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  const today = new Date().toISOString().split("T")[0];

  link.href = url;
  link.download = `pesatrack-expenses-${today}.csv`;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}