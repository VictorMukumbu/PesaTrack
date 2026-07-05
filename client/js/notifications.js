import { toastContainer } from "./dom.js";

function showToast(message, type = "success") {
  const toast = document.createElement("div");

  toast.classList.add("toast", type);

  toast.textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  setTimeout(() => {
    toast.classList.remove("show");

    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

export { showToast };