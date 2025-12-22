import { AuthService } from "./classes/auth.service";
import type { LoginData } from "./interfaces/auth.interfaces";
import type { HttpError } from "./interfaces/http.interfaces";
import Swal from "sweetalert2";

const authService = new AuthService();
// HTMLFormElement to avoid TS errors
const form = document.getElementById("login-form") as HTMLFormElement;

form.addEventListener("submit", async event => {
  event.preventDefault();

  // Collecting the data and type with our interface
  // To fix the "Unsafe assignment" and "Unsafe member access" errors
  const emailInput = form.elements.namedItem("email") as HTMLInputElement;
  const passwordInput = form.elements.namedItem("password") as HTMLInputElement;

  const loginData: LoginData = {
    email: emailInput.value,
    password: passwordInput.value,
  };

  try {
    // Calling to the service. If fails, goes to catch
    await authService.login(loginData);

    // If all works, login was successful
    location.assign("index.html");
    // Use "unknown" instead of "any" to avoid errors
  } catch (e: unknown) {
    // Cast "e" to our HttpError interface to access properties safely
    const error = e as HttpError;
    // If fails (401, etc.) shows error
    // The server can return the message in "error" or "message"
    // Handle the error message which can be a string or array of strings
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
