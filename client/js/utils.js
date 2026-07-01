// ======================================================
// Utility Functions
// ======================================================

export function getDefaultCategoryTotals() {
  return {
    Food: 0,
    Transport: 0,
    "Airtime/Data": 0,
    Bills: 0,
    Other: 0,
  };
}

export function formatDate(dateString) {
  if (!dateString) return "No date";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function clearInputs({
  expenseNameInput,
  expenseAmountInput,
  expenseCategoryInput,
  expenseDateInput,
}) {
  expenseNameInput.value = "";
  expenseAmountInput.value = "";
  expenseCategoryInput.value = "";
  expenseDateInput.value = "";
}