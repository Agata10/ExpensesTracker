//destination
const destinationForm = document.getElementById("destination-form");
const destinationInput = destinationForm.querySelector("input[type='text']");
const date = destinationForm.querySelectorAll("input[type='date']");
const destDiv = document.getElementById("dest-log");
//expenses
const expensesForm = document.getElementById("expenses-form");
const singleExpense = expensesForm.querySelector("#expense");
const expenseAmount = expensesForm.querySelector("#expense-amount");
//budget
const budgetForm = document.getElementById("budget-form");
const budgetInput = budgetForm.querySelector("input");
const budgetHolder = document.querySelector(".budget-holder");
//delete
const listDiv = document.getElementById("logger");

listDiv.addEventListener("click", handleDeleting);

destinationForm.addEventListener("submit", addDestination);
destinationInput.addEventListener("input", checkDestinationVal);
date[0].addEventListener("change", checkStartDate);
date[1].addEventListener("change", checkEndDate);

expensesForm.addEventListener("submit", handleAddingExpenese);
singleExpense.addEventListener("input", validateExpense);
expenseAmount.addEventListener("input", validateExpenseAmount);

budgetForm.addEventListener("submit", handleAddingBudget);

// DESTINATION FORM VALIDITY
function addDestination(e) {
  e.preventDefault(); // Prevent form submission
  const destination = checkDestinationVal();
  const startDate = date[0].value;
  const endDate = date[1].value;
  console.log(startDate);
  const obj = {
    destination: destination.toLowerCase(),
    startDate: startDate,
    endDate: endDate,
  };
  localStorage.setItem("destination", JSON.stringify(obj));
  appendDestinationInfo();
}

function checkDestinationVal() {
  if (destinationInput.value === "") {
    destinationInput.setCustomValidity("Please provide destination name");
  } else if (destinationInput.validity.patternMismatch) {
    destinationInput.setCustomValidity("Use only letters");
  } else {
    destinationInput.setCustomValidity("");
    return destinationInput.value;
  }
}

function checkStartDate() {
  if (new Date(date[0].value) < new Date()) {
    date[0].setCustomValidity("Make sure the start date is correct");
  } else {
    date[0].setCustomValidity("");
  }
}

function checkEndDate() {
  if (new Date(date[1].value) < new Date(date[0].value)) {
    date[1].setCustomValidity("Make sure the end date is correct");
  } else {
    date[1].setCustomValidity("");
  }
}

//SET UP THE TEMPLATE FOR DESTINATION
function createDestinationDiv() {
  const postTemplate = document.getElementById("temp-dest");
  const clone = postTemplate.content.cloneNode(true);
  const destination = clone.querySelector("h3");
  const startD = clone.querySelector("#start-date-holder");
  const endD = clone.querySelector("#end-date-holder");
  const destInfo = JSON.parse(localStorage.getItem("destination"));
  if (destInfo !== null) {
    destination.textContent =
      destInfo.destination.charAt(0).toUpperCase() +
      destInfo.destination.slice(1).toLowerCase();
    startD.textContent = destInfo.startDate;
    endD.textContent = destInfo.endDate;
  } else {
    destination.textContent = "";
    startD.textContent = "";
    endD.textContent = "";
  }
  return clone;
}

//APPEND THE INFO ABOUT DESTINATION
function appendDestinationInfo() {
  if (localStorage.getItem("destination") !== null) {
    //remove the clone of template when user enter new destination
    while (destDiv.firstChild) {
      destDiv.removeChild(destDiv.firstChild);
    }
    destDiv.appendChild(createDestinationDiv());
  }
}

//HANDLE ADDING EXPENSE TO THE LIST
function handleAddingExpenese(e) {
  e.preventDefault();

  const isValid = validateExpense() && validateExpenseAmount();
  if (isValid) {
    const success = addExpenseToLocalStorage();
    const listDiv = document.getElementById("logger");
    if (success) {
      listDiv.appendChild(
        createOneSublistDiv(singleExpense.value, expenseAmount.value)
      );
      calcSpending();
      singleExpense.value = "";
      expenseAmount.value = "";
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function calcSpending() {
  let sumOfExpenses = 0;
  const spendingHolder = document.querySelector(".spending-holder");
  const arrayOfexpenses = JSON.parse(localStorage.getItem("expenses"));
  if (arrayOfexpenses.length !== null) {
    arrayOfexpenses.forEach((item) => {
      sumOfExpenses += Number(item.amount);
      console.log(sumOfExpenses);
    });
  }
  spendingHolder.textContent = `Spending: ${sumOfExpenses}$`;
  return sumOfExpenses;
}

//HANDLE ADDING EXPENSE TO THE STORAGE
function addExpenseToLocalStorage() {
  const obj = {
    expense: singleExpense.value.toLowerCase(),
    amount: expenseAmount.value,
  };
  let arr = [];
  if (localStorage.getItem("expenses") === null) {
    arr.push(obj);
    localStorage.setItem("expenses", JSON.stringify(arr));
    return true;
  } else {
    arr = JSON.parse(localStorage.getItem("expenses"));
    let found = arr.find((e) => {
      if (e.expense === singleExpense.value.toLowerCase()) {
        alert("Ups. This expense already exists");
        return true;
      }
    });
    if (!found) {
      arr.push(obj);
      localStorage.setItem("expenses", JSON.stringify(arr));
      return true;
    } else {
      return false;
    }
  }
}

//CREATE ONE DIV FOR ONE EXPENSE
function createOneSublistDiv(expense, amount) {
  const subDiv = document.createElement("div");
  subDiv.classList.add("sublist");
  subDiv.innerHTML = `
    <p class="sub-title">${expense}</p>
    <p class="sub-amount">${amount}$</p>
    <div>
    <button ><img src="../images/pencil-square.svg" alt="edit" id="edit"></button>
    <button ><img src="../images/trash.svg" alt="trash" id="delete"></button>
    </div>
    `;
  const title = subDiv.firstElementChild; //it's first child
  title.style.fontWeight = "600";
  title.textContent =
    title.textContent.charAt(0).toUpperCase() +
    title.textContent.slice(1).toLowerCase();

  const lastChild = subDiv.lastElementChild;
  ///HTML COLLECTION
  for (let child of lastChild.children) {
    child.firstElementChild.style.width = "2rem";
    child.firstElementChild.style.marginLeft = "20px";
    child.firstElementChild.style.marginRight = "20px";
    child.firstElementChild.style.cursor = "pointer";
    child.firstElementChild.style.backgroundColor = "inherit";
  }
  return subDiv;
}

//VALIDATE THE EXPENSES
function validateExpense() {
  const errorDivs = document.querySelectorAll(".error");
  const budget = localStorage.getItem("budget");
  errorDivs.forEach((err) => {
    err.style.display = "none";
  });
  if (budget === null || budget == 0) {
    createError(expenseAmount, "Please enter budget firstly.");
    return false;
  }
  if (singleExpense.value === "") {
    createError(singleExpense, "Please enter the expense");
    return false;
  }
  if (!/^[a-zA-Z]+$/.test(singleExpense.value)) {
    createError(singleExpense, "Please enter only letters");
    return false;
  }
  return true;
}

function validateExpenseAmount() {
  const errorDivs = document.querySelectorAll(".error");
  const sumOfExpenses = calcSpending() + Number(expenseAmount.value);
  console.log(sumOfExpenses);
  errorDivs.forEach((err) => {
    err.style.display = "none";
  });
  if (expenseAmount.value === "") {
    createError(expenseAmount, "Please enter the amount");
    return false;
  }
  if (
    sumOfExpenses > Number(localStorage.getItem("budget")) ||
    expenseAmount.value > Number(localStorage.getItem("budget"))
  ) {
    createError(expenseAmount, "Ups. Exceeded budget. Change the budget.");
    return false;
  }
  return true;
}

//HANDLE ADDING BUDGET
function handleAddingBudget(e) {
  e.preventDefault();
  const isValid = validateBudget();
  if (!isValid) {
    return false;
  }
  localStorage.setItem("budget", budgetInput.value);
  budgetHolder.textContent = `Budget ${budgetInput.value}$`;
  budgetInput.value = "";
}

//VALIDATE THE VALUE OF BUDGET
function validateBudget() {
  const errorDivs = document.querySelectorAll(".error");
  const sumOfExpenses = calcSpending();
  errorDivs.forEach((err) => {
    err.style.display = "none";
  });
  if (budgetInput.value === "") {
    createError(budgetInput, "Please enter the budget");
    return false;
  }
  if (sumOfExpenses > budgetInput.value) {
    createError(budgetInput, "Budget can't be lower than spending");
    return false;
  }
  return true;
}

//CREATE ERROR DIV AND MESSAGE
function createError(elem, message) {
  const errorDiv = elem.nextElementSibling;
  errorDiv.style.fontSize = "10px";
  errorDiv.style.color = "red";
  errorDiv.textContent = message;
  errorDiv.style.display = "block";
}

//DELETE ELEM FROM LIST
function handleDeleting(e) {
  if (e.target.id === "delete") {
    const subListParent = e.target.parentNode.parentNode.parentNode;
    const expense =
      e.target.parentNode.parentNode.parentNode.firstElementChild.textContent;
    listDiv.removeChild(subListParent);
    const arr = JSON.parse(localStorage.getItem("expenses"));
    const newArr = arr.filter((exp) => {
      return expense.toLowerCase() !== exp.expense;
    });

    localStorage.setItem("expenses", JSON.stringify(newArr));
    if (JSON.parse(localStorage.getItem("expenses")).length === 0) {
      localStorage.setItem("budget", 0);
      budgetHolder.textContent = `Budget 0$`;
    }
    calcSpending();
  }
}
//HANDLE GETTING INFO FROM LOCAL STORAGE WHEN  PAGE REFRESHED
function onLoad() {
  //set up location info
  appendDestinationInfo();

  //set up the expenses list
  const arrayOfexpenses = JSON.parse(localStorage.getItem("expenses")) || [];
  arrayOfexpenses.forEach((item) => {
    const listDiv = document.getElementById("logger");
    listDiv.appendChild(createOneSublistDiv(item.expense, item.amount));
  });

  //set up budget from localStorage
  if (localStorage.getItem("budget") !== null) {
    budgetHolder.textContent = `Budget: ${localStorage.getItem("budget")}$`;
  }
  //set up the balance
  calcSpending();
}

onLoad();
