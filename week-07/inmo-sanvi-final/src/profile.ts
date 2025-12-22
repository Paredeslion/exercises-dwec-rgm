import { AuthService } from "./classes/auth.service";
import { UserService } from "./classes/user.service";
import type { User } from "./interfaces/user.interfaces";
import Swal from "sweetalert2";

const authService = new AuthService();
const userService = new UserService();

// DOM ELEMENTS
const profileView = document.getElementById("profile-view") as HTMLDivElement;
const userNameElement = document.getElementById(
  "user-name"
) as HTMLHeadingElement;
const userEmailElement = document.getElementById(
  "user-email"
) as HTMLParagraphElement;
const avatarImage = document.getElementById("avatar-image") as HTMLImageElement;
const avatarInput = document.getElementById(
  "avatar-upload"
) as HTMLInputElement;
const avatarOverlay = document.getElementById(
  "avatar-image-overlay"
) as HTMLDivElement;

// Buttons
const editProfileBtn = document.getElementById(
  "edit-profile-btn"
) as HTMLButtonElement;
const changePassBtn = document.getElementById(
  "change-password-btn"
) as HTMLButtonElement;
const myPropertiesLink = document.getElementById(
  "my-properties-link"
) as HTMLAnchorElement;

// Forms
const editProfileForm = document.getElementById(
  "edit-profile-form"
) as HTMLFormElement;
const changePassForm = document.getElementById(
  "change-password-form"
) as HTMLFormElement;
const cancelEditBtn = document.getElementById(
  "cancel-edit-profile"
) as HTMLButtonElement;
const cancelPassBtn = document.getElementById(
  "cancel-change-password"
) as HTMLButtonElement;

// CHECK AUTHENTICATION
// This page is protected. If checkToken fails, redirect to login.
const checkAuth = async () => {
  try {
    await authService.checkToken();
    // Update navigation menu
    document.getElementById("login-link")?.classList.add("hidden");
    document.getElementById("profile-link")?.classList.remove("hidden");
    document.getElementById("logout-link")?.classList.remove("hidden");
    document.getElementById("new-property-link")?.classList.remove("hidden");
  } catch {
    // If login fails, redirects to login page
    location.assign("login.html");
  }
};

// Logout code
document.getElementById("logout-link")?.addEventListener("click", () => {
  authService.logout();
});

// LOAD PROFILE DATA
const loadProfile = async () => {
  try {
    // Check if there is an ID in the URL
    const params = new URLSearchParams(location.search);
    const id = params.get("id") ? Number(params.get("id")) : undefined;

    // Getting user data (me or another user)
    const user: User = await userService.getProfile(id);

    // Filling DOM
    userNameElement.textContent = user.name;
    userEmailElement.textContent = user.email;
    avatarImage.src = user.avatar;

    //Link to user properties
    myPropertiesLink.href = `index.html?seller=${user.id}`;

    // PERMISSIONS (me or another user)
    if (user.me) {
      // Is my profile, I can edit
      // Pre-fill edit form
      (document.getElementById("name") as HTMLInputElement).value = user.name;
      (document.getElementById("email") as HTMLInputElement).value = user.email;
    } else {
      // It's another user, important to hide edit controls
      editProfileBtn.classList.add("hidden");
      changePassBtn.classList.add("hidden");
      avatarOverlay.classList.add("hidden"); // Hide "Change" text on avatar
      avatarInput.disabled = true; // Disable file input

      // Hide edit container to remove extra spacing
      document.getElementById("edit-buttons")?.classList.add("hidden");
    }
  } catch (error) {
    console.error(error);
    alert("Error loading profile");
    location.assign("index.html");
  }
};

// AVATAR UPDATE
avatarInput.addEventListener("change", () => {
  const file = avatarInput.files?.[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = async e => {
    const base64 = e.target?.result as string;
    if (base64) {
      try {
        //Update on server immediately with base64 code only
        const newAvatarUrl = await userService.saveAvatar(base64.split(",")[1]);
        // Update DOM
        avatarImage.src = newAvatarUrl;
        // Success (Toast in the corner)
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        void Toast.fire({
          icon: "success",
          title: "Avatar updated successfully",
        });
        // We can also update the nav avatar if we had one, or just alert
      } catch (error) {
        console.error(error);
        await Swal.fire("Error", "Error updating avatar", "error");
      }
    }
  };
  reader.readAsDataURL(file);
});

// SHOW/HIDE FORMS
editProfileBtn.addEventListener("click", () => {
  profileView.classList.add("hidden");
  editProfileForm.classList.remove("hidden");
});

cancelEditBtn.addEventListener("click", () => {
  editProfileForm.classList.add("hidden");
  profileView.classList.remove("hidden");
});

changePassBtn.addEventListener("click", () => {
  profileView.classList.add("hidden");
  changePassForm.classList.remove("hidden");
});

cancelPassBtn.addEventListener("click", () => {
  changePassForm.classList.add("hidden");
  profileView.classList.remove("hidden");
});

// SAVE PROFILE CHANGES
editProfileForm.addEventListener("submit", async e => {
  e.preventDefault();

  const name = (document.getElementById("name") as HTMLInputElement).value;
  const email = (document.getElementById("email") as HTMLInputElement).value;

  try {
    await userService.saveProfile(name, email);
    // Update DOM immediately
    userNameElement.textContent = name;
    userEmailElement.textContent = email;

    // Return to view mode
    editProfileForm.classList.add("hidden");
    profileView.classList.remove("hidden");
    // Sweet alert
    void Swal.fire({
      title: "Profile Updated",
      text: "Your profile information has been saved.",
      icon: "success",
      confirmButtonText: "Great!",
    });
  } catch (error) {
    console.error(error);
    await Swal.fire("Error", "Error saving profile", "error");
  }
});

// CHANGE PASSWORD
changePassForm.addEventListener("submit", async e => {
  e.preventDefault();

  const password = (document.getElementById("new-password") as HTMLInputElement)
    .value;
  const passwordConfirm = (
    document.getElementById("confirm-new-password") as HTMLInputElement
  ).value;

  if (password !== passwordConfirm) {
    await Swal.fire("Error", "Passwords do not match", "warning"); // Aviso de advertencia
    return;
  }

  try {
    await userService.savePassword(password);
    // Return to view mode
    changePassForm.classList.add("hidden");
    profileView.classList.remove("hidden");
    changePassForm.reset();
    // New Sweet alert
    void Swal.fire({
      title: "Password Changed",
      text: "Your password has been updated successfully.",
      icon: "success",
      confirmButtonText: "OK",
    });
  } catch (error) {
    console.error(error);
    await Swal.fire("Error", "Error changing password", "error");
  }
});

// INIT
void checkAuth();
void loadProfile();
