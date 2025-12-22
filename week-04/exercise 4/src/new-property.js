import { ProvincesService } from "./provinces.service.js";
import { PropertiesService } from "./properties.service.js";

// Creating instances of the services
const provincesService = new ProvincesService();
const propertiesService = new PropertiesService();

// Referencing DOM elements
const form = document.getElementById("property-form");
const provinceSelect = document.getElementById("province");
const townSelect = document.getElementById("town");
const address = document.getElementById("address");
const title = document.getElementById("title");
const description = document.getElementById("description");
const squareMeters = document.getElementById("sqmeters");
const numberOfRooms = document.getElementById("numRooms");
const numberOfBaths = document.getElementById("numBaths");
const price = document.getElementById("price");
const mainPhoto = document.getElementById("mainPhoto");
const imgPreview = document.getElementById("image-preview");

// Function to fulfill a select element with options
function fulfillSelect(selectElement, items) {
	const firstOption = selectElement.options[0];
	selectElement.innerHTML = ""; // Clear existing options
	selectElement.appendChild(firstOption); // Keep the first option

	// Create and append new options for each item
	items.forEach(item => {
		const option = document.createElement("option");
		option.value = item.id; // The value is the item's id
		option.textContent = item.name;
		selectElement.appendChild(option);
	});
}

// Function to load provinces into the select element
async function loadProvinces() {
	try {
		const provinces = await provincesService.getProvinces();
		fulfillSelect(provinceSelect, provinces);
	} catch (error) {
		console.error("Error loading provinces:", error);
		alert("Failed to load provinces.");
	}
}

loadProvinces();

// Loading towns based on selected province
provinceSelect.addEventListener("change", async () => {
	const provinceId = provinceSelect.value;
	if (!provinceId) {
		fulfillSelect(townSelect, []); // Clear towns if no province selected
		return;
	}

	try {
		const towns = await provincesService.getTowns(provinceId);
		fulfillSelect(townSelect, towns);
	} catch (error) {
		console.error("Error loading towns:", error);
		alert("Failed to load towns.");
	}
});

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
form.addEventListener("submit", async (event) => {
	event.preventDefault(); // Prevent default form submission

	// Checks if required, pattern and setCustomValidity validations pass
	if (!form.checkValidity()) {
		form.reportValidity();
		return;
	}

	// imgPreview contains the base64 data URL of the image and "data:image/jpeg;base64,..."
	// This needs to be handled
	const base64Image = imgPreview.src.split(",")[1]; // Extract base64 part

	// Creating FormData to send form data including the file
	const propertyData = {
		title: title.value,
		description: description.value,
		address: address.value,
		// This values need to be converted to numbers to match the API expectations
		price: price.valueAsNumber,
		sqmeters: squareMeters.valueAsNumber,
		numRooms: numberOfRooms.valueAsNumber,
		numBaths: numberOfBaths.valueAsNumber,
		// valueAsNumber doesn't work for select elements, so we use Number()
		townId: Number(townSelect.value),
		mainPhoto: base64Image
	};

	// Debugging: log the property data to be sent to the server
  // console.log("Sending this to the server:", propertyData);

	try {
		await propertiesService.insertProperty(propertyData);

		location.assign("index.html"); // Redirect to index.html on success
		
	} catch (error) {
		console.error("Error inserting property:", error);
		alert("There was an error submitting the property: " + error.message);
	}
});