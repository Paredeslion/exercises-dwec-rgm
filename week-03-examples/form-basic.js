const form = document.getElementById("formPersona");
const imgPreview = document.getElementById("imgPreview");
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

  const tr = document.createElement("tr");
  const tdAvatar = document.createElement("td");
  const avatar = document.createElement("img");
  avatar.src = imgPreview.src;
  tdAvatar.append(avatar);
  const tdNombre = document.createElement("td");
  tdNombre.append(form.nombre.value);
  const tdHobbies = document.createElement("td");
  tdHobbies.append(hobbies.toString());

  tr.append(tdAvatar, tdNombre, tdHobbies);
  usersTable.querySelector("tbody").append(tr);

  form.reset(); // Limpia los campos del formulario
  imgPreview.src = "";
});
