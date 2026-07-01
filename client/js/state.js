// ======================================================
// PesaTrack Application State
// ======================================================

import { getDefaultCategoryTotals } from "./utils.js";

export const state = {
  total: 0,

  expenses: [],

  editingExpenseIndex: null,

  categoryTotals: getDefaultCategoryTotals(),
};