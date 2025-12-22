import { AuthService } from "./classes/auth.service";
import { ProvincesService } from "./classes/provinces.service";
import { PropertiesService } from "./classes/properties.service";
import type { PropertyInsert } from "./interfaces/property.interfaces";
import type { Town } from "./interfaces/location.interfaces";
import { MapService } from "./classes/map.service";
import { MyGeolocation } from "./classes/my-geolocation";
import type { HttpError } from "./interfaces/http.interfaces";
import Swal from "sweetalert2";

// Creating instances of the services
const authService = new AuthService();
const provincesService = new ProvincesService();
const propertiesService = new PropertiesService();

// Variables to use the map and current towns
let mapService: MapService;
let currentTowns: Town[] = [];

// Referencing DOM elements
const form = document.getElementById("property-form") as HTMLFormElement;
const provinceSelect = document.getElementById("province") as HTMLSelectElement;
const townSelect = document.getElementById("town") as HTMLSelectElement;
const mainPhoto = document.getElementById("mainPhoto") as HTMLInputElement;
const imgPreview = document.getElementById("image-preview") as HTMLImageElement;

// CHECKING IF THE USER IS LOGGGED IN
const checkAuth = async () => {
  try {
    await authService.checkToken();
    // If the user is logged in is safe to continue
  } catch {
    location.assign("login.html");
  }
};

// Logout
// ? means if "logout-link" doesn't exist returns undefined and goes to the next line
document.getElementById("logout-link")?.addEventListener("click", () => {
  authService.logout();
});

// LOADING DATA

// Function to fulfill a select element with options
const fillSelect = (
  select: HTMLSelectElement,
  items: { id: number; name: string }[]
) => {
  // Keep first option
  const first = select.options[0];
  select.innerHTML = ""; // Clear existing options
  select.add(first); // Append the first option

  items.forEach(item => {
    const option = document.createElement("option");
    option.value = item.id.toString();
    option.textContent = item.name;
    select.appendChild(option);
  });
};

const loadProvinces = async () => {
  try {
    const provinces = await provincesService.getProvinces();
    fillSelect(provinceSelect, provinces);
  } catch (error) {
    console.error(error);
    alert("Failed to load provinces.");
  }
};

// Province change event
provinceSelect.addEventListener("change", async () => {
  const provinceId = provinceSelect.value;
  if (!provinceId) {
    fillSelect(townSelect, []);
    return;
  }

  try {
    currentTowns = await provincesService.getTowns(Number(provinceId));
    fillSelect(townSelect, currentTowns);
  } catch (error) {
    console.log(error);
    alert("Failed to load towns.");
  }
});

// MAP FUNCTIONALITY
const initMap = async () => {
  try {
    const coords = await MyGeolocation.getLocation();
    mapService = new MapService(coords, "map");
    mapService.createMarker(coords);
  } catch (error) {
    console.error("Error loading map", error);
  }
};

// Moving map to selected town
townSelect.addEventListener("change", () => {
  const townId = Number(townSelect.value);
  const selectedTown = currentTowns.find(t => t.id === townId);

  if (selectedTown && mapService) {
    const coords = {
      latitude: selectedTown.latitude,
      longitude: selectedTown.longitude,
    };
    mapService.view.setCenter([coords.longitude, coords.latitude]);
    mapService.view.setZoom(14);
    mapService.clearMarkers(); // Ensure you added this method to MapService yesterday!
    mapService.createMarker(coords);
  }
});

// HANDLE IMAGE PREVIEW

mainPhoto.addEventListener("change", () => {
  const file = mainPhoto.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    mainPhoto.setCustomValidity("Please select an image");
    return;
  }
  mainPhoto.setCustomValidity(""); // Cleaning the error

  const reader = new FileReader();
  reader.onload = e => {
    imgPreview.src = e.target?.result as string;
    imgPreview.classList.remove("hidden");
  };
  reader.readAsDataURL(file);
});

// SUBMITTING FORM

form.addEventListener("submit", async e => {
  e.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Base64 string without prefix
  const base64 = imgPreview.src.split(",")[1];

  // Creating the object with strict typing
  const newProperty: PropertyInsert = {
    title: (document.getElementById("title") as HTMLInputElement).value,
    description: (document.getElementById("description") as HTMLTextAreaElement)
      .value,
    address: (document.getElementById("address") as HTMLInputElement).value,
    price: (document.getElementById("price") as HTMLInputElement).valueAsNumber,
    sqmeters: (document.getElementById("sqmeters") as HTMLInputElement)
      .valueAsNumber,
    numRooms: (document.getElementById("numRooms") as HTMLInputElement)
      .valueAsNumber,
    numBaths: (document.getElementById("numBaths") as HTMLInputElement)
      .valueAsNumber,
    townId: Number(townSelect.value),
    mainPhoto: base64,
  };

  try {
    await propertiesService.insertProperty(newProperty);

    // New message with Swal
    await Swal.fire({
      title: "Property Created!",
      text: "Your new property has been successfully published.",
      icon: "success",
      confirmButtonText: "Go to Listings",
      timer: 2000, // Se cierra sola en 2 segundos
      timerProgressBar: true,
    });

    location.assign("index.html");
  } catch (e: unknown) {
    const error = e as HttpError;
    const message = Array.isArray(error.message)
      ? error.message.join(", ")
      : error.message || error.error || "Unknown error";

    // New error message with Swal
    await Swal.fire({
      title: "Error",
      text: "Error creating property: " + message,
      icon: "error",
      confirmButtonText: "Close",
    });
  }
});

// INITIALIZATION
void checkAuth();
void loadProvinces();
void initMap();
