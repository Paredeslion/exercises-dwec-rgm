// Implement this file

"use strict";

// Defining constants for form and elements
const form = document.getElementById("property-form");
const imgPreview = document.getElementById("image-preview");
const listings = document.getElementById("property-listings");
const template = document.getElementById("property-card-template");
const mainPhoto = document.getElementById("mainPhoto");

// Defining functions to handle image preview and errors
function showImageError(message) {
  mainPhoto.setCustomValidity(message);
  mainPhoto.reportValidity();
}

function clearImageError() {
  mainPhoto.setCustomValidity("");
}

function resetImagePreview() {
  imgPreview.src = "";
  imgPreview.classList.add("hidden");
  mainPhoto.value = "";
}

function showImagePreview(file) {
  const reader = new FileReader();

  reader.onload = function (event) {
    imgPreview.classList.remove("hidden");
    imgPreview.src = event.target.result;
    clearImageError();
  };

  reader.onerror = function () {
    showImageError("Error loading image. Please try again.");
    resetImagePreview();
  };

  reader.readAsDataURL(file);
}

// Previsualizing the selected image
mainPhoto.addEventListener("change", function (event) {
  const file = event.target.files[0];

  // Validating that a file is selected
  if (!file) {
    resetImagePreview();
    return;
  }

  // Validating file type
  if (!file.type.startsWith("image/")) {
    showImageError("Please select a valid image file");
    resetImagePreview();
    return;
  }

  // Validating file size (200KB = 200 * 1024 bytes)
  if (file.size > 200 * 1024) {
    showImageError("Image must be less than 200KB");
    resetImagePreview();
    return;
  }

  // If it passes validation, show preview
  showImagePreview(file);
});

// Event listener for form submission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Validate all fields here
  if (!validateForm()) {
    return;
  }

	// Create property object from form data
	const propertyData = {
		province: form.province.value,
		town: form.town.value,
		address: form.address.value,
		title: form.title.value,
		sqmeters: form.sqmeters.value,
		numRooms: form.numRooms.value,
		numBaths: form.numBaths.value,
		price: form.price.value,
		imageSrc: imgPreview.src
	}

  // Create the property and add to the DOM
  createPropertyCard(propertyData);

  // Reset form
  form.reset();
  resetImagePreview();
});

function validateForm() {
  let isValid = true;
  // Always clear previous validation errors before validating again
  clearAllValidationErrors();

  const province = document.getElementById("province");
  // Validating province
  if (province.value === "") {
    province.setCustomValidity("Please select a province");
    province.reportValidity();
    isValid = false;
  }
  // Validating town
  const town = document.getElementById("town");
  if (town.value === "") {
    town.setCustomValidity("Please select a town");
    town.reportValidity();
    isValid = false;
  }
  // Validating address
  const address = document.getElementById("address");
  if (address.value === "") {
    address.setCustomValidity("Address cannot be empty");
    address.reportValidity();
    isValid = false;
  }
  // Validating title
  const title = document.getElementById("title");
  // only letters, numbers or spaces and begin with a capital letter
  const validTitle = /^[A-Z][a-zA-Z0-9 ]*$/;
  if (title.value === "") {
    title.setCustomValidity("Title cannot be empty");
    title.reportValidity();
    isValid = false;
  } else if (!validTitle.test(title.value)) {
    title.setCustomValidity(
      "Title must start with a capital letter and contain only letters, numbers, or spaces"
    );
    title.reportValidity();
    isValid = false;
  }
  // Validating square meters
  const squareMeters = document.getElementById("sqmeters");
  if (
    squareMeters.value === "" ||
    isNaN(squareMeters.value) ||
    Number(squareMeters.value) < 1
  ) {
    squareMeters.setCustomValidity("Square meters must be at least 1");
    squareMeters.reportValidity();
    isValid = false;
  }
  // Validating rooms (between 1 and 20)
  const numberRooms = document.getElementById("numRooms");
  if (
    numberRooms.value === "" ||
    isNaN(numberRooms.value) ||
    Number(numberRooms.value) < 1 ||
    Number(numberRooms.value) > 20
  ) {
    numberRooms.setCustomValidity("Number of rooms must be between 1 and 20");
    numberRooms.reportValidity();
    isValid = false;
  }
  // Validating bathrooms (between 1 and 20)
  const numberBathrooms = document.getElementById("numBaths");
  if (
    numberBathrooms.value === "" ||
    isNaN(numberBathrooms.value) ||
    Number(numberBathrooms.value) < 1 ||
    Number(numberBathrooms.value) > 20
  ) {
    numberBathrooms.setCustomValidity(
      "Number of bathrooms must be between 1 and 20"
    );
    numberBathrooms.reportValidity();
    isValid = false;
  }
  // Validating price at least 1
  const price = document.getElementById("price");
  if (price.value === "" || isNaN(price.value) || Number(price.value) < 1) {
    price.setCustomValidity("Price must be at least 1");
    price.reportValidity();
    isValid = false;
  }

	// Validating main photo
	if (!mainPhoto.files[0]) {
		showImageError("Please selec an image for the property");
		isValid = false;
	} else {
		if (!mainPhoto.files[0].type.startsWith("image/") || mainPhoto.files[0].size > 200 * 1024) {
			showImageError("Please select a valid image file less than 200KB");
			isValid = false;
		}
	}

  return isValid;
}

function clearAllValidationErrors() {
  const elements = [
    document.getElementById("province"),
    document.getElementById("town"),
    document.getElementById("address"),
    document.getElementById("title"),
    document.getElementById("sqmeters"),
    document.getElementById("numRooms"),
    document.getElementById("numBaths"),
    document.getElementById("price"),
  ];

  elements.forEach((element) => {
    if (element) {
      element.setCustomValidity("");
    }
  });
}

function createPropertyCard(data) {
	// Cloning the template content using true for deep clone
	const card = template.content.cloneNode(true);
	card.querySelector(".property-image").src = data.imageSrc;
	card.querySelector(".property-title").textContent = data.title;
	card.querySelector(".property-location").textContent = `${data.address}, ${data.town}, ${data.province}`;
	card.querySelector(".property-sqmeters").textContent = `${data.sqmeters} sqm`;
	card.querySelector(".property-rooms").textContent = `${data.numRooms} beds`;
	card.querySelector(".property-baths").textContent = `${data.numBaths} baths`;

	// Format price as € and english locale
	const formattedPrice = new Intl.NumberFormat("en-GB", { style: "currency", currency: "EUR" });
	card.querySelector(".property-price").textContent = formattedPrice.format(data.price);

	//Adding the button functionality to remove the card
	const deleteButton = card.querySelector(".btn-delete");
	deleteButton.addEventListener("click", function () {
		// .closest() finds the nearest ancestor that matches the selector
		deleteButton.closest(".bg-white").remove();
	});
	listings.append(card);
}