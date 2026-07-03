import { categoryChart } from "./dom.js";
import { state } from "./state.js";

function renderCategoryChart() {
  const chartContainer = categoryChart;

  // clear previous chart
  chartContainer.innerHTML = "";

  const maxValue = Math.max(...Object.values(state.categoryTotals), 1);

  for (let category in state.categoryTotals) {
    const amount = state.categoryTotals[category];

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

export { renderCategoryChart };