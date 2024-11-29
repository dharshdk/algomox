let currentTutorial = 0;
let budget = 0;
let total = 0;
let cart = [];

// Walkthrough
function nextTutorial() {
  const walkthroughTexts = [
    "Explore categories and add items to your cart.",
    "Set a budget to track your spending.",
    "View your total in the shopping page!"
  ];

  if (currentTutorial >= walkthroughTexts.length - 1) {
    document.getElementById("walkthrough").classList.add("hidden");
    document.getElementById("set-budget").classList.remove("hidden");
  } else {
    document.getElementById("walkthrough-text").innerText =
      walkthroughTexts[++currentTutorial];
  }
}

// Set Budget
function setBudget() {
  const budgetInput = document.getElementById("budget-input").value;
  if (!budgetInput || budgetInput <= 0) {
    alert("Please enter a valid budget!");
    return;
  }
  budget = parseFloat(budgetInput);
  document.getElementById("set-budget").classList.add("hidden");
  document.getElementById("home").classList.remove("hidden");
}

// Add to Cart
function addToCart(item, price) {
  if (budget === 0) {
    alert("Please set a budget first!");
    return;
  }

  cart.push({ item, price });
  total += price;

  updateCart();

  if (total > budget) {
    alert("Budget exceeded! Please review your cart.");
  }
}

// Update Cart
function updateCart() {
  const cartList = document.getElementById("cart-items");
  cartList.innerHTML = "";
  cart.forEach((c) => {
    const li = document.createElement("li");
    li.innerText = `${c.item} - $${c.price.toFixed(2)}`;
    cartList.appendChild(li);
  });

  document.getElementById("total").innerText = `Running Total: $${total.toFixed(
    2
  )}`;
}

// Navigation
function navigate(page) {
  document.querySelectorAll(".container").forEach((c) => c.classList.add("hidden"));
  document.getElementById(page).classList.remove("hidden");
}

// Theme Switching
function switchTheme(theme) {
  document.body.className = theme + "-theme";
}

// Toggle Category
function toggleCategory(category) {
  const list = document.getElementById(category);
  list.classList.toggle("hidden");
}
