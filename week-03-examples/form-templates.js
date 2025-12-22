const form = document.getElementById("formPersona");
const imgPreview = document.getElementById("imgPreview");
const userTemplate = document.getElementById("userTemplate");
const usersTable = document.getElementById("users");

form.avatar.addEventListener("change", (event) => {
  let file = event.target.files[0];
  let reader = new FileReader();
  if (file) reader.readAsDataURL(file); // Serializar en base64
  reader.addEventListener("load", (e) => {
    // Serialización terminada
    imgPreview.src = reader.result; // Datos en Base64
  });
});

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // Impedimos que se recargue la página

  const hobbies = Array.from(form.hobbies)
    .filter((input) => input.checked)
    .map((input) => input.value);

  // Clonamos el contenido de la plantilla
  const userHTML = userTemplate.content.cloneNode(true);
  const tr = userHTML.firstElementChild;

  tr.querySelector("img").src = imgPreview.src;
  tr.children[1].textContent = form.nombre.value;
  tr.children[2].textContent = hobbies.toString();

  usersTable.querySelector("tbody").append(tr);

  form.reset(); // Limpia los campos del formulario
  imgPreview.src = "";
});
