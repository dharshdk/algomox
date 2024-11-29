document.addEventListener("DOMContentLoaded", () => {
    console.log("Script loaded successfully!");

    // Walkthrough Tutorial
    let tutorialIndex = 0;
    const tutorialSteps = [
        "Welcome to Smart Grocery Shopping Assistant!",
        "Create and manage shopping lists easily.",
        "Set and track your budget while adding items.",
        "Customize your settings to enhance your experience!"
    ];
    const tutorialText = document.getElementById("tutorial-text");
    const tutorialOverlay = document.getElementById("tutorial-overlay");

    document.getElementById("next-tutorial").addEventListener("click", () => {
        tutorialIndex++;
        if (tutorialIndex < tutorialSteps.length) {
            tutorialText.textContent = tutorialSteps[tutorialIndex];
        } else {
            tutorialOverlay.style.display = "none"; // Hide the tutorial
        }
    });

    // Tab Navigation
    function showTab(tabId) {
        console.log(`Switching to tab: ${tabId}`);
        const tabs = document.querySelectorAll(".tab-content");
        tabs.forEach(tab => tab.classList.remove("active"));
        document.getElementById(tabId).classList.add("active");
    }
    window.showTab = showTab; // Expose to global scope if needed for HTML onclick

    // Budget Management
    let totalBudget = 0;
    let remainingBudget = 0;

    function updateBudget() {
        const budgetInput = document.getElementById("budget-input").value;
        console.log(`Setting budget: ${budgetInput}`);
        if (budgetInput) {
            totalBudget = parseInt(budgetInput);
            remainingBudget = totalBudget;
            document.getElementById("budget-remaining-list").textContent = remainingBudget;
            saveData();
        }
    }
    window.updateBudget = updateBudget;

    // Item Management
    const allItems = ["Apple", "Banana", "Carrot", "Milk", "Rice", "Wheat", "Tomato"];
    const suggestions = document.getElementById("suggestions");

    function filterItems() {
        const searchTerm = document.getElementById("item-name").value.toLowerCase();
        const filteredItems = allItems.filter(item => item.toLowerCase().includes(searchTerm));
        
        suggestions.innerHTML = filteredItems.map(item => `<div class="suggestion-item" onclick="fillItemFields('${item}')">${item}</div>`).join("");
    }

    function fillItemFields(item) {
        document.getElementById("item-name").value = item;
        suggestions.innerHTML = ''; // Clear suggestions
    }

    document.getElementById("item-name").addEventListener("input", filterItems);

    function addItem() {
        const itemName = document.getElementById("item-name").value;
        const itemPrice = document.getElementById("item-price").value;
        const itemStock = document.getElementById("item-stock").value;

        console.log(`Adding item: ${itemName}, Price: ${itemPrice}, Stock: ${itemStock}`);

        if (itemName && itemPrice && itemStock) {
            const price = parseInt(itemPrice);
            const stock = parseInt(itemStock);

            if (price > remainingBudget) {
                alert("Item exceeds the remaining budget!");
                return;
            }

            remainingBudget -= price;
            document.getElementById("budget-remaining-list").textContent = remainingBudget;

            const listItem = document.createElement("li");
            listItem.innerHTML = `
                ${itemName} - ₹${price} | Stock: ${stock}
                <button onclick="decreaseStock(this, ${price})">Use</button>
                <button onclick="removeItem(this, ${price})">Remove</button>
            `;
            document.getElementById("shopping-list").appendChild(listItem);
            saveData();
        }
    }
    window.addItem = addItem;

    function removeItem(button, price) {
        console.log(`Removing item, Price refunded: ${price}`);
        remainingBudget += price;
        document.getElementById("budget-remaining-list").textContent = remainingBudget;
        button.parentElement.remove();
        saveData();
    }
    window.removeItem = removeItem;

    // Sort Items
    function sortList(criteria) {
        console.log(`Sorting list by: ${criteria}`);
        const list = document.getElementById("shopping-list");
        const items = Array.from(list.children);

        items.sort((a, b) => {
            const aText = a.textContent.toLowerCase();
            const bText = b.textContent.toLowerCase();
            if (criteria === "alphabetical") {
                return aText.localeCompare(bText);
            } else if (criteria === "price") {
                const aPrice = parseInt(a.textContent.match(/₹(\d+)/)[1]);
                const bPrice = parseInt(b.textContent.match(/₹(\d+)/)[1]);
                return aPrice - bPrice;
            }
            return 0;
        });

        list.innerHTML = "";
        items.forEach(item => list.appendChild(item));
        saveData();
    }
    window.sortList = sortList;

    // Theme Management
    function changeTheme(theme) {
        console.log(`Changing theme to: ${theme}`);
        document.body.style.backgroundColor = theme === "dark" ? "#333" : "#fff";
        document.body.style.color = theme === "dark" ? "#fff" : "#000";
    }
    window.changeTheme = changeTheme;

    // LocalStorage Persistence
    function saveData() {
        const shoppingList = document.getElementById("shopping-list").innerHTML;
        const budgetData = {
            totalBudget,
            remainingBudget,
        };
        localStorage.setItem("shoppingList", shoppingList);
        localStorage.setItem("budgetData", JSON.stringify(budgetData));
    }

    function loadSavedData() {
        const savedList = localStorage.getItem("shoppingList");
        const savedBudget = JSON.parse(localStorage.getItem("budgetData"));

        if (savedList) {
            document.getElementById("shopping-list").innerHTML = savedList;
        }

        if (savedBudget) {
            totalBudget = savedBudget.totalBudget;
            remainingBudget = savedBudget.remainingBudget;
            document.getElementById("budget-remaining-list").textContent = remainingBudget;
        }
    }
    loadSavedData();
});
