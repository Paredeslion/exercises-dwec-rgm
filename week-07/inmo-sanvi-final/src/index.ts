import { PropertiesService } from "./classes/properties.service";
import { ProvincesService } from "./classes/provinces.service";
import { AuthService } from "./classes/auth.service";
import type { Property } from "./interfaces/property.interfaces";
import type { Province } from "./interfaces/location.interfaces";
import Swal from "sweetalert2";

// Services instances
const propertiesService = new PropertiesService();
const provincesService = new ProvincesService();
const authService = new AuthService();

// State variables for pagination and filtering
let currentPage = 1;
let currentSearch = "";
let currentProvince = "";
let morePages = false; // Controls visibility of "Load More" button
let currentSeller: number | null = null;

// DETECTING SELLER PARAMETER ON LOAD
const paramsURL = new URLSearchParams(location.search);
if (paramsURL.has("seller")) {
  currentSeller = Number(paramsURL.get("seller"));
}

// DOM Elements (Casting to correct types)
const listingsContainer = document.getElementById(
  "property-listings"
) as HTMLDivElement;
const loadMoreBtn = document.getElementById(
  "load-more-btn"
) as HTMLButtonElement;
const template = document.getElementById(
  "property-card-template"
) as HTMLTemplateElement;
const searchForm = document.getElementById("search-form") as HTMLFormElement;
const provinceSelect = document.getElementById(
  "province-filter"
) as HTMLSelectElement;
const filterInfo = document.getElementById("filter-Info") as HTMLDivElement;

// AUTHENTICATION & NAVIGATION
// Update navigation bar based on login status
const updateNavAuth = async () => {
  try {
    await authService.checkToken();
    // User is logged in
    document.getElementById("login-link")?.classList.add("hidden");
    document.getElementById("profile-link")?.classList.remove("hidden");
    document.getElementById("logout-link")?.classList.remove("hidden");
    document.getElementById("new-property-link")?.classList.remove("hidden");
  } catch {
    // User is NOT logged in (default state)
  }
};

// Logout functionality
document.getElementById("logout-link")?.addEventListener("click", () => {
  authService.logout();
});

// FILTERING & PROVINCES
// Load provinces into the select filter
const loadProvinces = async () => {
  try {
    const provinces = await provincesService.getProvinces();
    provinces.forEach((prov: Province) => {
      const option = document.createElement("option");
      option.value = prov.id.toString();
      option.textContent = prov.name;
      provinceSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading provinces", error);
  }
};

// RENDERING
// Create a property card HTML element from data
const createPropertyCard = (property: Property): Node => {
  const clone = template.content.cloneNode(true) as DocumentFragment;
  const card = clone.firstElementChild as HTMLElement;

  // Image and Title link to details page
  const img = card.querySelector(".property-image") as HTMLImageElement;
  img.src = property.mainPhoto;
  (img.parentElement as HTMLAnchorElement).href =
    `property-detail.html?id=${property.id}`;

  const titleLink = card.querySelector(".property-title") as HTMLAnchorElement;
  titleLink.textContent = property.title;
  titleLink.href = `property-detail.html?id=${property.id}`;

  // Location
  const location = card.querySelector(".property-location") as HTMLElement;
  // Handle the Union Type (number or province to avoid errors)
  // We treat it as Province because the GET /properties endpoint fills it
  const provinceName = (property.town.province as Province).name;
  location.textContent = `${property.town.name}, ${provinceName}`;
  // Wrong way to do the previous code
  // location.textContent = `${property.town.name}, ${property.town.province.name}`;

  // Price formatting
  const price = card.querySelector(".property-price") as HTMLElement;
  price.textContent = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
  }).format(property.price);

  // Details
  card.querySelector(".property-sqmeters")!.textContent =
    `${property.sqmeters} sqm`;
  card.querySelector(".property-rooms")!.textContent =
    `${property.numRooms} rooms`;
  card.querySelector(".property-baths")!.textContent =
    `${property.numBaths} baths`;

  // Ownership: Delete button

  const deleteBtn = card.querySelector(".btn-delete") as HTMLButtonElement;
  if (property.mine) {
    deleteBtn.addEventListener("click", e => {
      e.preventDefault();

      // Using Swal instead confirm()
      void Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33", // Red for danger
        cancelButtonColor: "#3085d6", // Blue to cancel
        confirmButtonText: "Yes, delete it!",
      }).then(result => {
        if (result.isConfirmed) {
          // User confirms, we executed the erase
          void (async () => {
            try {
              await propertiesService.deleteProperty(property.id);
              // Cleaning the card from the DOM
              card.remove();

              // Nice successful message
              await Swal.fire(
                "Deleted!",
                "Your property has been deleted.",
                "success"
              );
            } catch (error) {
              console.error(error);
              await Swal.fire("Error", "Could not delete property", "error");
            }
          })();
        }
      });
    });
  } else {
    deleteBtn.remove(); // Hide if not mine
  }
  return card;
};

// DATA LOADING
// Main function to fetch properties
const loadProperties = async (append = false) => {
  // Build query params
  const params = new URLSearchParams();
  params.append("page", String(currentPage));
  if (currentSearch) params.append("search", currentSearch);
  if (currentProvince) params.append("province", currentProvince);

  // Adding seller to request for list the properties
  if (currentSeller) params.append("seller", String(currentSeller));

  try {
    const response = await propertiesService.getProperties(params);

    // Clear container if it is a new search (not appending)
    if (!append) {
      listingsContainer.innerHTML = "";
    }

    // Update pagination state
    morePages = response.more;

    // Render cards
    response.properties.forEach(p => {
      listingsContainer.appendChild(createPropertyCard(p));
    });

    // Toggle "Load More" button visibility
    if (morePages) {
      loadMoreBtn.classList.remove("hidden");
    } else {
      loadMoreBtn.classList.add("hidden");
    }

    // Update filter info text
    if (!append) {
      let infoText = "Showing all properties";
      // Adding currentSeller to show the properties from a specific seller
      if (currentSearch || currentProvince || currentSeller) {
        infoText = "Filters: ";
        if (currentSearch) infoText += `Search: "${currentSearch}" `;
        if (currentProvince) {
          const provName =
            provinceSelect.options[provinceSelect.selectedIndex].text;
          infoText += `Province: ${provName}`;
        }
        // Show seller filter info
        if (currentSeller) {
          infoText += `| Seller ID: ${currentSeller}`;
        }
      }
      filterInfo.textContent = infoText;
    }
  } catch (error) {
    console.error("Error loading properties", error);
    listingsContainer.innerHTML =
      "<p class='text-red-500'>Error loading properties</p>";
  }
};

// EVENT LISTENERS
// Search form submit
searchForm.addEventListener("submit", e => {
  e.preventDefault();
  // Update state with form values
  currentSearch = (document.getElementById("search-text") as HTMLInputElement)
    .value;
  currentProvince = provinceSelect.value === "0" ? "" : provinceSelect.value;
  currentPage = 1; // Reset to page 1

  // Void operator to avoid ESLint errors
  void loadProperties(false); // Load new results (don't append)
});

// Load more button click
loadMoreBtn.addEventListener("click", () => {
  currentPage++;
  // Void operator to avoid ESLint errors
  void loadProperties(true); // Append new results
});

// INITIALIZATION

void updateNavAuth();
void loadProvinces();
void loadProperties(); // Initial load (page 1, no filters)
