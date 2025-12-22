import { PresentsService } from "./classes/presents.service";

import type { Present, PresentInsert } from "./interfaces/presents.interface";

//Service to talk with the server
const presentsService = new PresentsService();

//Loading presents
const presentsContainer = document.querySelector(".gift-list") as HTMLUListElement;
const template = document.getElementById("gift-item-template") as HTMLTemplateElement;
const form = document.querySelector(".add-gift-form") as HTMLFormElement;
const descriptionInput = document.getElementById("description") as HTMLInputElement;
const photoInput = document.getElementById("photo") as HTMLInputElement;
const previewImg = document.getElementById("preview") as HTMLImageElement;

// function to check the limit of the gifts, no more than 5
const checkGiftLimit = () => {
	const currentGifts = presentsContainer.children.length;

	if (currentGifts >= 5) {
		form.classList.add("hidden");
	} else {
		form.classList.remove("hidden");
	}
};

const createPresentCard = (present: Present): HTMLElement => {
	const clone = template.content.cloneNode(true) as DocumentFragment;
	const item = clone.firstElementChild as HTMLElement;

	//image
	const img = item.querySelector("img") as HTMLImageElement;
	img.src = present.photo; // URL from server

	const giftDescription = item.querySelector(".gift-description") as HTMLElement;
	giftDescription.textContent = present.description;

	const deleteButton = item.querySelector(".delete-button") as HTMLButtonElement;

	deleteButton.addEventListener("click", async () => {
		try {
			// Calling the server to delete from the screen
			await presentsService.deletePresent(present.id)

			// If the server says that is ok, delete it
			item.remove();

			// Ckeck the number of gifts
			checkGiftLimit();
		} catch (error) {
			alert("Error deleting present");
		}
	});
	// Returning the item card
	return item;
}

const loadPresents = async () => {
	try {
		const presents = await presentsService.getPresents();

		presents.forEach((p) => {
			presentsContainer.appendChild(createPresentCard(p));
		});

		checkGiftLimit();
	} catch (error) {
		console.error("Error loading presents", error);
	}
};

photoInput.addEventListener("change", () => {
  const file = photoInput.files?.[0];
  if (file) {
    const reader = new FileReader();
    // Cuando el lector termine de leer el archivo...
    reader.onload = (e) => {
      // ...ponemos el resultado (Base64) en la imagen fantasma
      previewImg.src = e.target?.result as string;
      previewImg.classList.remove("hidden"); // La hacemos visible
    };
    reader.readAsDataURL(file); // ¡Empieza a leer!
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // ¡Quieto navegador! No recargues.

  // 1. Validación rápida
  if (!photoInput.files || !photoInput.files[0]) return;

  // 2. Preparar la foto (Limpiar el Base64)
  // El src es "data:image/jpeg;base64,/9j/4AA..."
  // Queremos solo "/9j/4AA..." (la parte después de la coma)
  const base64 = previewImg.src.split(",")[1];

  // 3. Empaquetar el objeto para enviar (PresentInsert)
  const newPresent: PresentInsert = {
    description: descriptionInput.value,
    photo: base64
  };

  try {
    // 4. Enviar al servidor (POST) y esperar confirmación
    // 'createdPresent' es el regalo que vuelve con su ID nuevo
    const createdPresent = await presentsService.addPresent(newPresent);
    
    // 5. Pintarlo en la pantalla (Sin recargar)
    presentsContainer.appendChild(createPresentCard(createdPresent));
    
    // 6. Limpieza
    form.reset();
    previewImg.classList.add("hidden");
    
    // 7. ¡Portero! ¿Hemos llegado a 5?
    checkGiftLimit();

  } catch (error) {
    alert("Error adding present");
  }
});

loadPresents();