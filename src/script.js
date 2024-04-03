const destinationForm = document.getElementById("destination-form");
const destinationInput = destinationForm.querySelector("input[type='text']");
const date = destinationForm.querySelectorAll("input[type='date']");

// DESTINATION FORM VALIDITY
destinationForm.addEventListener("submit", addDestination);
destinationInput.addEventListener("input", checkDestinationVal);
date[0].addEventListener("change", checkStartDate);
date[1].addEventListener("change", checkEndDate);

function addDestination(e) {
  e.preventDefault(); // Prevent form submission
  const destination = checkDestinationVal();
  const startDate = date[0].value;
  const endDate = date[1].value;
  console.log(startDate);
  const obj = {
    destination: destination,
    startDate: startDate,
    endDate: endDate,
  };
  localStorage.setItem("destination", JSON.stringify(obj));
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

//SET UP THE TEMPLATE
function createDestinationDiv(destination, start, end) {}
