const destinationForm = document.getElementById("destination-form");
const destinationInput = destinationForm.querySelector("input[type='text']");
const date = destinationForm.querySelectorAll("input[type='date']");
const destDiv = document.getElementById("dest-log");
//expenses
const expensesForm = document.getElementById("expenses-form");
const singleExpense = expensesForm.querySelector("#expense");
const expenseAmount = expensesForm.querySelector("#expense-amount");

destinationForm.addEventListener("submit", addDestination);
destinationInput.addEventListener("input", checkDestinationVal);
date[0].addEventListener("change", checkStartDate);
date[1].addEventListener("change", checkEndDate);

expensesForm.addEventListener("submit", handleAddingExpenese);

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
  handleDestinationInfo();
}

function checkDestinationVal() {
  console.log(destinationInput.value);
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

  destination.textContent = JSON.parse(
    localStorage.getItem("destination")
  ).destination;
  startD.textContent = JSON.parse(
    localStorage.getItem("destination")
  ).startDate;
  endD.textContent = JSON.parse(localStorage.getItem("destination")).endDate;

  return clone;
}

//APPEND THE INFO ABOUT DESTINATION
function handleDestinationInfo() {
  if (localStorage.getItem("destination") !== null) {
    while (destDiv.firstChild) {
      destDiv.removeChild(destDiv.firstChild);
    }
    destDiv.appendChild(createDestinationDiv());
  }
}

//HANDLE ADDING EXPENSE TO THE LIST
function handleAddingExpenese(e) {
  e.preventDefault();
  const success = addExpenseToLocalStorage();
  const listDiv = document.getElementById("logger");
  if (success) {
    listDiv.appendChild(
      createOneSublistDiv(singleExpense.value, expenseAmount.value)
    );
  } else {
    return;
  }
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
      if (e.expense === singleExpense.value) {
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
    <p class="sub-amount">${amount}</p>
    <div>
    <img src="../images/pencil-square.svg" alt="edit" id="edit">
    <img src="../images/trash.svg" alt="trash" id="delete">
    </div>
    `;
  const title = subDiv.firstElementChild; //it's first child
  title.style.fontWeight = "600";
  title.textContent =
    title.textContent.charAt(0).toUpperCase() +
    title.textContent.slice(1).toLowerCase();
  return subDiv;
}
//TO DO
function validateInputsForExpense(expense, amount) {
  if (expense === "") {
  }
}

//HANDLE GETTING INFO FROM LOCAL STORAGE WHEN  PAGE REFRESHED
function onLoad() {
  handleDestinationInfo();
  const arrayOfexpenses = JSON.parse(localStorage.getItem("expenses")) || [];
  arrayOfexpenses.forEach((item) => {
    const listDiv = document.getElementById("logger");
    listDiv.appendChild(createOneSublistDiv(item.expense, item.amount));
  });
}

onLoad();
