// Storage Controller
const StorageController = (function () {
  //
})();

// Expense Controller
const ExpenseController = (function () {
  // private
  const Expense = function (id, date, name, tag, price) {
    this.id = id;
    this.date = date;
    this.name = name;
    this.tag = tag;
    this.price = price;
  };

  const data = {
    expenses: [],
    selectedExpense: null,
    totalPrice: 0,
  };

  // public
  return {
    getExpenses: function () {
      return data.expenses;
    },
    getData: function () {
      return data;
    },
    getExpenseById: function (id) {
      let expense = null;

      data.expenses.forEach(function (exp) {
        if (exp.id == id) {
          expense = exp;
        }
      });
      return expense;
    },
    getCurrentExpense: function () {
      return data.selectedExpense;
    },
    setCurrentExpense: function (exp) {
      data.selectedExpense = exp;
    },
    getTotal: function () {
      let total = 0;
      data.expenses.forEach(function (exp) {
        total += exp.price;
      });
      data.totalPrice = total;
      return data.totalPrice;
    },
    addExpense: function (name, price, tag) {
      let id;
      const today = new Date();
      let date = today.toISOString().split("T")[0];
      if (data.expenses.length > 0) {
        id = data.expenses[data.expenses.length - 1].id + 1;
      } else {
        id = 0;
      }
      const newExpense = new Expense(id, date, name, tag, parseFloat(price));
      data.expenses.push(newExpense);
      return newExpense;
    },
    updateExpense: function (name, price, tag) {
      let expense = null;

      data.expenses.forEach(function (exp) {
        if (exp.id == data.selectedExpense.id) {
          exp.name = name;
          exp.price = parseFloat(price);
          exp.tag = tag;
          expense = exp;
        }
      });

      return expense;
    },
    deleteExpense: function (expense) {
      data.expenses.forEach((exp, index) => {
        if (exp.id == expense.id) {
          data.expenses.splice(index, 1);
        }
      });
    },
    filterExpense: function (tag) {
      var filteredExpense = {};
      data.expenses.forEach((exp) => {
        if (exp.tag == tag) {
          console.log(data.expenses, filteredExpense, exp, tag);
          filteredExpense += exp;
        }
        //console.log(filteredExpense, tag);
      });
    },
  };
})();

// UI Controller
const UIController = (function () {
  const Selectors = {
    expenseList: "#item-list",
    expenseListItems: "#item-list tr",
    addButton: "#addBtn",
    updateButton: "#updateBtn",
    deleteButton: "#deleteBtn",
    cancelButton: "#cancelBtn",
    expenseName: "#expenseName",
    expensePrice: "#expensePrice",
    expenseTag: "#expenseTag",
    totalDollar: "#totalDollar",
    selectTag: "a.badge",
    tagTitle: "#tagTitle",
  };

  return {
    createExpenseList: function (expenses) {
      let html = "";

      expenses.forEach((exp) => {
        html += `
            <tr>
              <td>${exp.id}</td>
              <td>${exp.date}</td>
              <td>${exp.name}</td>
              <td>${exp.price}$</td>
              <td>
                <a href="#" class="badge bg-secondary text-decoration-none">${exp.tag}</a>
              </td>
              <td class="text-end">
                <i class="fas fa-edit edit-expense"></i>
              </td>
            </tr>
        `;
      });

      document.querySelector(Selectors.expenseList).innerHTML = html;
    },
    getSelectors: function () {
      return Selectors;
    },
    addExpense: function (exp) {
      var expense = `
        <tr>
              <td>${exp.id}</td>
              <td>${exp.date}</td>
              <td>${exp.name}</td>
              <td>${exp.price}$</td>
              <td>
                <a href="#" class="badge bg-secondary text-decoration-none">${exp.tag}</a>
              </td>
              <td class="text-end">
                <i class="fas fa-edit edit-expense"></i>
              </td>
            </tr>
      `;

      document.querySelector(Selectors.expenseList).innerHTML += expense;
    },
    updateExpense: function (exp) {
      let updatedItem = null;
      const selectedExpense = ExpenseController.getCurrentExpense();
      let items = document.querySelectorAll(Selectors.expenseListItems);
      items.forEach((item) => {
        if (item.classList.contains("bg-warning")) {
          item.children[2].textContent = exp.name;
          item.children[3].textContent = exp.price + "$";
          item.children[4].innerHTML = `<a href="#" class="badge bg-secondary text-decoration-none">${exp.tag}</a>`;
          updatedItem = item;
        }
      });

      return updatedItem;
    },
    deleteExpense: function () {
      let items = document.querySelectorAll(Selectors.expenseListItems);
      items.forEach((item) => {
        if (item.classList.contains("bg-warning")) {
          item.remove();
        }
      });
    },
    clearInputs: function () {
      document.querySelector(Selectors.expenseName).value = "";
      document.querySelector(Selectors.expensePrice).value = "";
      document.querySelector(Selectors.expenseTag).value = "untagged";
    },
    clearWarnings: function () {
      const items = document.querySelectorAll(Selectors.expenseListItems);
      items.forEach((item) => {
        if (item.classList.contains("bg-warning")) {
          item.classList.remove("bg-warning");
        }
      });
    },
    showTotal: function (total) {
      document.querySelector(Selectors.totalDollar).textContent = total;
    },
    addExpenseToForm: function () {
      const selectedExpense = ExpenseController.getCurrentExpense();
      document.querySelector(Selectors.expenseName).value = selectedExpense.name;
      document.querySelector(Selectors.expensePrice).value = selectedExpense.price;
      document.querySelector(Selectors.expenseTag).value = selectedExpense.tag;
    },
    addingState: function (item) {
      UIController.clearWarnings();
      UIController.clearInputs();
      document.querySelector(Selectors.addButton).style.display = "inline";
      document.querySelector(Selectors.updateButton).style.display = "none";
      document.querySelector(Selectors.deleteButton).style.display = "none";
      document.querySelector(Selectors.cancelButton).style.display = "none";
    },
    editingState: function (tr) {
      tr.classList.add("bg-warning");
      document.querySelector(Selectors.addButton).style.display = "none";
      document.querySelector(Selectors.updateButton).style.display = "inline";
      document.querySelector(Selectors.deleteButton).style.display = "inline";
      document.querySelector(Selectors.cancelButton).style.display = "inline";
    },
    addFilterTag: function (tag) {
      let html = ` <a href="#" class="text-info text-decoration-none" style="font-size: .75em">${tag} x</a>`;
      let tagTemp = document.querySelector(Selectors.tagTitle);
      console.log(tagTemp.innerHTML);
      if (!tagTemp.innerHTML.includes(tag)) {
        document.querySelector(Selectors.tagTitle).innerHTML += html;
      } else {
        //document.querySelector(Selectors.tagTitle).innerHTML += "";
      }
    },
    showFilteredExpense: function (filteredExpenses) {
      let html = "";

      filteredExpenses.forEach((filExp) => {
        html += `
            <tr>
              <td>${filExp.id}</td>
              <td>${filExp.date}</td>
              <td>${filExp.name}</td>
              <td>${filExp.price}$</td>
              <td>
                <a href="#" class="badge bg-secondary text-decoration-none">${filExp.tag}</a>
              </td>
              <td class="text-end">
                <i class="fas fa-edit edit-expense"></i>
              </td>
            </tr>
        `;
      });

      document.querySelector(Selectors.expenseList).innerHTML = html;
    },
  };
})();

// App Controller
const App = (function (ExpenseCtrl, UICtrl) {
  //
  const UISelectors = UICtrl.getSelectors();
  // Load Event Listeners
  const loadEventListeners = function () {
    //add expense event
    document.querySelector(UISelectors.addButton).addEventListener("click", expenseAddSubmit);

    //edit expense click
    document.querySelector(UISelectors.expenseList).addEventListener("click", expenseEditClick);

    //edit expense submit
    document.querySelector(UISelectors.updateButton).addEventListener("click", expenseEditSubmit);

    //cancel expense click
    document.querySelector(UISelectors.cancelButton).addEventListener("click", cancelUpdate);

    //delete expense
    document.querySelector(UISelectors.deleteButton).addEventListener("click", expenseDeleteSubmit);

    //select tag
    document.querySelector(UISelectors.expenseList).addEventListener("click", tagSelect);
  };

  const expenseAddSubmit = function (e) {
    const expenseName = document.querySelector(UISelectors.expenseName).value.trim();
    const expensePrice = document.querySelector(UISelectors.expensePrice).value.trim();
    const expenseTag = document.querySelector(UISelectors.expenseTag).value;

    if (expenseName !== "" && expensePrice !== "") {
      // Add Expense
      const newExpense = ExpenseCtrl.addExpense(expenseName, expensePrice, expenseTag);

      // Add expense to list
      UICtrl.addExpense(newExpense);

      // Get total
      const total = ExpenseCtrl.getTotal();

      // Show total
      UICtrl.showTotal(total);

      // Clear Inputs
      UICtrl.clearInputs();
    }

    console.log(expenseName, expensePrice, expenseTag);
    e.preventDefault();
  };

  const expenseEditClick = function (e) {
    if (e.target.classList.contains("edit-expense")) {
      const id =
        e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent;

      // Get selected expense
      const expense = ExpenseCtrl.getExpenseById(id);

      // Set current expense
      ExpenseCtrl.setCurrentExpense(expense);

      UICtrl.clearWarnings();

      // Add expense to UI
      UICtrl.addExpenseToForm();
      UICtrl.editingState(e.target.parentNode.parentNode);
    }

    e.preventDefault();
  };

  const expenseEditSubmit = function (e) {
    const expenseName = document.querySelector(UISelectors.expenseName).value.trim();
    const expensePrice = document.querySelector(UISelectors.expensePrice).value.trim();
    const expenseTag = document.querySelector(UISelectors.expenseTag).value;

    if (expenseName !== "" && expensePrice !== "") {
      //update expense
      const updatedExpense = ExpenseCtrl.updateExpense(expenseName, expensePrice, expenseTag);

      //update UI
      let item = UICtrl.updateExpense(updatedExpense);

      // Get total
      const total = ExpenseCtrl.getTotal();

      // Show total
      UICtrl.showTotal(total);

      UICtrl.addingState();
    }

    e.preventDefault();
  };

  const cancelUpdate = function (e) {
    UICtrl.addingState();
    e.preventDefault();
  };

  const expenseDeleteSubmit = function (e) {
    //get selected expense
    const selectedExpense = ExpenseCtrl.getCurrentExpense();

    //delete selected expense
    ExpenseCtrl.deleteExpense(selectedExpense);

    //delete ui
    UICtrl.deleteExpense();

    // Get total
    const total = ExpenseCtrl.getTotal();

    // Show total
    UICtrl.showTotal(total);

    UICtrl.addingState();

    e.preventDefault();
  };

  const tagSelect = function (e) {
    if (e.target.classList.contains("badge")) {
      const tag = e.target.textContent;

      const taggedExpense = ExpenseCtrl.filterExpense(tag);

      //console.log(taggedExpense);

      ExpenseCtrl.filterExpense();
      UICtrl.addFilterTag(tag);
      UICtrl.showFilteredExpense(taggedExpense);
    }
    e.preventDefault();
  };

  return {
    init: function () {
      console.log("App starts...");

      UICtrl.addingState();
      const expenses = ExpenseCtrl.getExpenses();

      UICtrl.createExpenseList(expenses);

      loadEventListeners();
    },
  };
})(ExpenseController, UIController);

App.init();
