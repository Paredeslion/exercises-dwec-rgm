import { PropertiesService } from "./classes/properties.service";
import { MapService } from "./classes/map.service";
import { AuthService } from "./classes/auth.service";
// We import the types to tell TS what structure the data has
import type { Property } from "./interfaces/property.interfaces";
import type { Province } from "./interfaces/location.interfaces";

const propertiesService = new PropertiesService();
const authService = new AuthService();
let currentProperty: Property;

// GETTING ID FROM URL

// URLSearchParams helps us read parameters like "?id=5" easily
const params = new URLSearchParams(location.search);
const propertyId = Number(params.get("id"));

// If the ID is not in the URL go back to index
if (!propertyId) {
  location.assign("index.html");
}

// DOM ELEMENTS WITH STRICT TYPING
// We use 'as HTMLElement' (or specific types) to tell TS: "Trust me, this ID exists and is this type"
const titleElement = document.getElementById("property-title") as HTMLElement;
const addressElement = document.getElementById(
  "property-address"
) as HTMLElement;
const imageElement = document.getElementById(
  "property-image"
) as HTMLImageElement;
const descriptionElement = document.getElementById(
  "property-description"
) as HTMLElement;
const priceElement = document.getElementById("property-price") as HTMLElement;
const sqmetersElement = document.getElementById(
  "property-sqmeters"
) as HTMLElement;
const roomsElement = document.getElementById("property-rooms") as HTMLElement;
const bathsElement = document.getElementById("property-baths") as HTMLElement;
const sellerPhoto = document.getElementById("seller-photo") as HTMLImageElement;
const sellerName = document.getElementById("seller-name") as HTMLAnchorElement;

//Mortgage Calculator Elements
const mortgageForm = document.getElementById(
  "mortgage-calculator"
) as HTMLFormElement;
// Id fixed from Html "property-price" is now "property-price-input"
const priceInput = document.getElementById(
  "property-price-input"
) as HTMLInputElement;
const monthlyPaymentResult = document.getElementById(
  "monthly-payment"
) as HTMLElement;
const mortgageResultContainer = document.getElementById(
  "mortgage-result"
) as HTMLDivElement;

// CHECKING AUTHENTICATION
// This function updates the menu based on whether the user is logged in or not
const checkAuth = async () => {
  try {
    await authService.checkToken();
    // Using optional chaining (?.) just in case an element is missing in the HTML
    document.getElementById("login-link")?.classList.add("hidden");
    document.getElementById("profile-link")?.classList.remove("hidden");
    document.getElementById("logout-link")?.classList.remove("hidden");
    document.getElementById("new-property-link")?.classList.remove("hidden");
  } catch {
    // If checkToken fails, user is not logged in. We do nothing (default state).
  }
};

// Logout button
// ?. prevents crash if "logout-link" doesn't exist in this page for some reason
document.getElementById("logout-link")?.addEventListener("click", () => {
  authService.logout();
});

// LOADING THE DATA OF PROPERTY
const loadProperty = async () => {
  try {
    // Saving in the global variable
    currentProperty = await propertiesService.getPropertyById(propertyId);
    const property = currentProperty;

    // Filling the DOM elements with data
    titleElement.textContent = property.title;

    // Casting to Province because we receive the full object, not only the ID
    const provinceName = (property.town.province as Province).name;
    addressElement.textContent = `${property.address}, ${property.town.name}, ${provinceName}`;

    imageElement.src = property.mainPhoto;
    descriptionElement.textContent = property.description;

    // Formating price
    const priceFormatted = new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "EUR",
    }).format(property.price);
    priceElement.textContent = priceFormatted;

    sqmetersElement.textContent = String(property.sqmeters);
    roomsElement.textContent = String(property.numRooms);
    bathsElement.textContent = String(property.numBaths);

    // Seller Info Links
    if (property.userId) {
      sellerName.href = `profile.html?id=${property.userId}`;
      // We go up to the parent (<a> tag) of the image to set the href
      (sellerPhoto.parentElement as HTMLAnchorElement).href =
        `profile.html?id=${property.userId}`;
    }

    // MAP INTEGRATION
    // Initializing the map on property location
    const coords = {
      latitude: property.town.latitude,
      longitude: property.town.longitude,
    };
    const mapService = new MapService(coords, "map");
    mapService.createMarker(coords);

    // The first input field (read-only) should be pre-filled with the property's price.
    if (priceInput) {
      priceInput.value = String(property.price);
    }
    // AFTER loading the property data (not before), check if the user is logged in
    await checkAuth();
  } catch (error) {
    console.error("Error loading property", error);
    alert("Error loading property details");
    location.assign("index.html");
  }
};

// MORTGAGE CALCULATOR
if (mortgageForm) {
  mortgageForm.addEventListener("submit", e => {
    e.preventDefault();

    // Read values as numbers
    const P = priceInput.valueAsNumber; // Principal
    const downPayment = (
      document.getElementById("down-payment") as HTMLInputElement
    ).valueAsNumber;
    // Interest is annual %, so we divide by 100 (percent) and 12 (months)
    const r =
      (document.getElementById("interest-rate") as HTMLInputElement)
        .valueAsNumber /
      100 /
      12;
    // Term is in years, so we multiply by 12 (months)
    const n =
      (document.getElementById("loan-term") as HTMLInputElement).valueAsNumber *
      12;

    const principal = P - downPayment;

    // Mortgage Formula: M = P * (r * (1+r)^n) / ((1+r)^n - 1)
    let monthlyPayment = 0;
    if (r === 0) {
      monthlyPayment = principal / n; // Handle 0% interest edge case
    } else {
      monthlyPayment =
        principal * ((r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    }

    // Display result
    monthlyPaymentResult.textContent = new Intl.NumberFormat("en-EN", {
      style: "currency",
      currency: "EUR",
    }).format(monthlyPayment);
    mortgageResultContainer.classList.remove("hidden");
  });
}

// INITIALIZATION
// Use void to tell ESLint we are ignoring the promise returned by async functions
void loadProperty();
