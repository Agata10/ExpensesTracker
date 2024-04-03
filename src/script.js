const destinationForm = document.getElementById("destination-form");
const destinationInput = destinationForm.querySelector("input[type='text']");
const date = destinationForm.querySelectorAll("input[type='date']");
const destDiv = document.getElementById("dest-log");
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
  handleDestinationDiv();
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

function handleDestinationDiv() {
  if (localStorage.getItem("destination") !== null) {
    while (destDiv.firstChild) {
      destDiv.removeChild(destDiv.firstChild);
    }
    destDiv.appendChild(createDestinationDiv());
  }
}

handleDestinationDiv();
