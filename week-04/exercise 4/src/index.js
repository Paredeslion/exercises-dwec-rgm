import { PropertiesService } from "./properties.service.js";

const propertiesService = new PropertiesService();

const propertyListings = document.getElementById("property-listings");
const templateCard = document.getElementById("property-card-template");

async function loadProperties() {
	try {
		// Call the service to get properties
		const properties = await propertiesService.getProperties();
		// Debugging: log the loaded properties
		console.log("Loaded properties:", properties);

		// Cleaning the container
		propertyListings.innerHTML = "";

		// Iterating over properties and creating cards
		properties.forEach(property => {
			createPropertyCard(property);
		});

	} catch (error) {
		console.error("Error loading properties:", error);
		alert("Failed to load properties."); 
	}
}

// Calling the function to load properties on page load
loadProperties();

function createPropertyCard(property) {
	// Cloning the template
	const card = templateCard.content.cloneNode(true);
	const cardElement = card.firstElementChild; // This is important for deletion

	cardElement.querySelector(".property-image").src = property.mainPhoto;
	cardElement.querySelector(".property-title").textContent = property.title;
	cardElement.querySelector(".property-description").textContent = property.description;
	// Accessing nested properties for town and province
	cardElement.querySelector(".property-location").textContent = `${property.town.name}, ${property.town.province.name}`;
	cardElement.querySelector(".property-sqmeters").textContent = `${property.sqmeters} m²`;
	cardElement.querySelector(".property-rooms").textContent = `Rooms: ${property.numRooms}`;
	cardElement.querySelector(".property-baths").textContent = `Baths: ${property.numBaths}`;
	
	// Format price as € and english locale
	const formattedPrice = new Intl.NumberFormat("en-GB", { style: "currency", currency: "EUR" });
	cardElement.querySelector(".property-price").textContent = formattedPrice.format(property.price);

	// Adding delete button functionality
	const deleteButton = cardElement.querySelector(".btn-delete");
	deleteButton.addEventListener("click", async () => {
		// confirm deletion
		if (!confirm("Are you sure you want to delete this property?")) {
			return; // Exit if not confirmed
		}
		try {
			// Using the id of the property to delete it
			await propertiesService.deleteProperty(property.id);
			cardElement.remove(); // Remove the card from the DOM
		} catch (error) {
			console.error("Error deleting property:", error);
			alert("Failed to delete property.");
		}
	});
	// Appending the card to the listings container
	propertyListings.appendChild(card);
}