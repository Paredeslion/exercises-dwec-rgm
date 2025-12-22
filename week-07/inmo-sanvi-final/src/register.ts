import { AuthService } from "./classes/auth.service";
import type { RegisterData } from "./interfaces/auth.interfaces";
import type { HttpError } from "./interfaces/http.interfaces";
import Swal from "sweetalert2";

const authService = new AuthService();

// DOM Elements by strict typing
const form = document.getElementById("register-form") as HTMLFormElement;
const imagePreview = document.getElementById(
  "avatar-preview"
) as HTMLImageElement;
const avatarInput = document.getElementById("avatar") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;
const confirmPasswordInput = document.getElementById(
  "password-confirm"
) as HTMLInputElement;

// Image preview logic
avatarInput.addEventListener("change", () => {
  const file = avatarInput.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      //The resutl MUST be a string before assigning
      const result = e.target?.result;
      if (typeof result === "string") {
        imagePreview.src = result;
        imagePreview.classList.remove("hidden");
      }
    };
    reader.readAsDataURL(file);
  }
});

// Password validation logic
const validatePasswords = () => {
  if (passwordInput.value !== confirmPasswordInput.value) {
    confirmPasswordInput.setCustomValidity("Passwords do not match");
  } else {
    confirmPasswordInput.setCustomValidity("");
  }
};

passwordInput.addEventListener("input", validatePasswords);
confirmPasswordInput.addEventListener("input", validatePasswords);

// Form submission
form.addEventListener("submit", async event => {
  event.preventDefault();

  // 1. Validate HTML5 constraints and custom validity
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // 2. Prepare data for the server
  // We need to extract the Base64 string from the preview src
  // The format is "data:image/jpeg;base64,....." -> we need the second part
  const avatarBase64 = imagePreview.src.split(",")[1];

  // Safe access to form elements using namedItem
  const nameInput = form.elements.namedItem("nameUser") as HTMLInputElement; // HTML name is 'nameUser'
  const emailInput = form.elements.namedItem("email") as HTMLInputElement;

  const newUser: RegisterData = {
    name: nameInput.value,
    email: emailInput.value,
    password: passwordInput.value,
    avatar: avatarBase64,
  };

  try {
    // 3. Call service
    await authService.register(newUser);

    // 4. Redirect to login on success
    location.assign("login.html");
  } catch (e: unknown) {
    // 5. Show errors strictly typed
    const error = e as HttpError;
    // The server might return an array of messages or a single string
    const errorMessage = Array.isArray(error.message)
      ? error.message.join(", ")
      : error.message || error.error || "Unknown error";
    // Before using sweet alert
    // alert("Error registering: " + message);
    await Swal.fire({
      title: "Error",
      text: "Error logging in: " + errorMessage,
      icon: "error",
      confirmButtonText: "Close",
    });
  }
});

// Checking when the page is loading
// If checkToken works, means that we are logued -> to index
authService
  .checkToken()
  .then(() => {
    location.assign("index.html");
  })
  .catch(() => {
    // If fails (no token or invalid) we stay here to login
    // There's nothing to do
  });
