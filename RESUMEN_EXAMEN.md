# 📘 Guía de Referencia: Proyecto Inmobiliaria (TypeScript + Vite)

## 1. Configuración y Entorno

### Comandos Clave
* **Crear proyecto:** `npm create vite@latest nombre-proyecto -- --template vanilla-ts`
* **Instalar todo:** `npm install`
* **Instalar dependencias (Prod):** `npm i ol tailwindcss @tailwindcss/vite sweetalert2`
* **Instalar dependencias (Dev):** `npm i -D prettier eslint @eslint/config@latest`
* **Arrancar (Dev):** `npm start` (o `npm run dev`).
* **Construir (Build):** `npm run build`.

### Archivos de Configuración Críticos
* **`vite.config.ts`:** Esencial para que funcionen múltiples HTML.
    ```typescript
    import { defineConfig } from 'vite';
    import tailwindcss from '@tailwindcss/vite';
    import { resolve } from 'path';

    export default defineConfig({
      plugins: [
        tailwindcss(),
      ],
      build: {
        rollupOptions: {
          input: {
            main: resolve(__dirname, 'index.html'),
            login: resolve(__dirname, 'login.html'),
            register: resolve(__dirname, 'register.html'),
            new_property: resolve(__dirname, 'new-property.html'),
            property_detail: resolve(__dirname, 'property-detail.html'),
            profile: resolve(__dirname, 'profile.html'),
          },
        },
      },
    });
    ```
* **`tsconfig.json`:** Usar `"target": "ESNext"` para evitar problemas con sintaxis moderna.

---

## 2. TypeScript: Tipado y DOM

### Casting del DOM (Evitar errores de 'null' o propiedades inexistentes)
Siempre que captures un elemento con `getElementById`, dile a TS qué es:

```typescript
// Inputs de texto
const titleInput = document.getElementById("title") as HTMLInputElement;
console.log(titleInput.value);

// Inputs numéricos
const priceInput = document.getElementById("price") as HTMLInputElement;
console.log(priceInput.valueAsNumber); // Devuelve number directamente

// Selects
const townSelect = document.getElementById("town") as HTMLSelectElement;
const townId = Number(townSelect.value); // Select siempre devuelve string, convertir a Number

// Formularios e Imágenes
const form = document.getElementById("my-form") as HTMLFormElement;
const img = document.getElementById("preview") as HTMLImageElement;
```

### Interfaces (El Contrato)
Definir siempre qué entra y qué sale.
* **DTOs (Data Transfer Objects):** `PropertyInsert` (lo que envío al crear, sin ID).
* **Entidades:** `Property` (lo que recibo, con ID y objetos anidados como `Town`).
* **Union Types:** Para campos que pueden variar (`province: number | Province`).

---

## 3. Comunicación HTTP (`Http` y Servicios)

### Clase `Http` (Genéricos)
El método `ajax` o `get/post` usa genéricos `<T>` para indicar qué devuelve la promesa.
* **Token Automático:** Recuerda que en `http.class.ts` leemos el token de localStorage y lo inyectamos:
    ```typescript
    const token = localStorage.getItem("token");
    if (token) headers = { ...headers, Authorization: "Bearer " + token };
    ```

### Estructura de un Servicio (`PropertiesService`)
```typescript
// GET con parámetros (Filtros/Paginación)
async getProperties(params?: URLSearchParams): Promise<PropertiesResponse> {
    const query = params ? "?" + params.toString() : "";
    return await this.#http.get<PropertiesResponse>(`${SERVER}/properties${query}`);
}

// GET por ID
async getPropertyById(id: number): Promise<Property> {
    // Si el servidor devuelve { property: { ... } }, tipamos la respuesta envolvente
    const resp = await this.#http.get<SinglePropertyResponse>(`${SERVER}/properties/${id}`);
    return resp.property;
}

// DELETE (Void)
async deleteProperty(id: number): Promise<void> {
    await this.#http.delete<void>(`${SERVER}/properties/${id}`);
}
```

---

## 4. Autenticación y Seguridad

### `AuthService`
* **Login:** Postea credenciales -> Recibe token -> `localStorage.setItem("token", resp.accessToken)`.
* **Logout:** `localStorage.removeItem("token")` -> `location.assign("login.html")`.
* **CheckToken:** Llama a `/auth/validate`. Si falla (catch), redirige al login.

### Protección de Rutas (Al inicio de cada script)
```typescript
// Función autoejecutable o llamada directa con void
const checkAuth = async () => {
  try {
    await authService.checkToken();
    // Usuario logueado: Mostrar menú de usuario, ocultar login
  } catch {
    // Usuario no logueado: Redirigir a login (si la página es privada)
    location.assign("login.html");
  }
};
void checkAuth();
```

---

## 5. Funcionalidades Clave (Snippets)

### Leer parámetros de la URL (`?id=5` o `?seller=10`)
```typescript
const params = new URLSearchParams(location.search);
const id = Number(params.get("id")); // Devuelve 0 o NaN si no existe

if (!id) {
    location.assign("index.html"); // Redirigir si es obligatorio
}
```

### Previsualización de Imagen (Base64)
```typescript
fileInput.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const result = e.target?.result as string;
        imgPreview.src = result; // Mostrar en <img>
        // Para enviar al servidor, quitar la cabecera:
        const base64Clean = result.split(",")[1]; 
    };
    reader.readAsDataURL(file);
});
```

### Rellenar un `<select>` dinámicamente
```typescript
const fillSelect = (select: HTMLSelectElement, data: any[]) => {
    // Limpiar manteniendo el placeholder
    select.innerHTML = '<option value="">Select one...</option>'; 
    
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.id.toString();
        option.textContent = item.name;
        select.appendChild(option);
    });
};
```

### Mapa (OpenLayers + MapService)
```typescript
// 1. Obtener ubicación actual
const coords = await MyGeolocation.getLocation();

// 2. Iniciar mapa (div id="map")
const mapService = new MapService(coords, "map");
mapService.createMarker(coords);

// 3. Mover mapa dinámicamente
mapService.view.setCenter([longitude, latitude]);
mapService.view.setZoom(14); // Opcional: restaurar zoom
mapService.clearMarkers();
mapService.createMarker({ latitude, longitude });
```

### SweetAlert2 (Alertas bonitas)
```typescript
import Swal from "sweetalert2";

// Éxito / Error simple
Swal.fire("Título", "Mensaje", "success"); // o 'error', 'warning'

// Confirmación (Borrar)
Swal.fire({
    title: "Are you sure?",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!"
}).then((result) => {
    if (result.isConfirmed) {
        // ... borrar ...
    }
});
```

---

## 6. Solución de Errores Comunes (Troubleshooting)

1.  **ESLint: `Promises must be awaited`**:
    * Solución: Pon `void` delante de la llamada. `void loadProperties();`.
2.  **ESLint: `Unsafe member access` / `any`**:
    * Solución: Haz casting del elemento HTML (`as HTMLInputElement`) o define la interfaz de la respuesta HTTP. Evita `any`.
3.  **TypeScript: `Property 'value' does not exist on type 'HTMLElement'`**:
    * Solución: Estás usando `getElementById` sin hacer casting. Añade `as HTMLInputElement`.
4.  **Vite: `404 Not Found` al cargar scripts**:
    * Solución: Comprueba `vite.config.ts` y asegúrate de que el HTML está en `rollupOptions.input`.
5.  **El Mapa no carga**:
    * Solución: Revisa si importaste el CSS de OpenLayers (`@import "ol/ol.css"`) en tu `src/styles.css`.

---

## 7. Manipulación del DOM (Plan B: Sin Plantillas)

Si en el examen no te dan un `<template>` y tienes que crear HTML desde cero con código:

### Crear elementos manualmente (`document.createElement`)
Más seguro y limpio que usar `innerHTML`.

```typescript
// 1. Crear el contenedor
const div = document.createElement("div");
div.classList.add("card", "p-4", "bg-white"); // Añadir clases CSS

// 2. Crear contenido
const titulo = document.createElement("h3");
titulo.textContent = property.title;
titulo.style.color = "blue"; // Estilos directos

// 3. Crear imagen
const img = document.createElement("img");
img.src = property.mainPhoto;
img.alt = "Foto de la casa";

// 4. Montar el puzle (meter hijos en el padre)
div.appendChild(img);
div.appendChild(titulo);

// 5. Añadir al DOM real
const container = document.getElementById("container") as HTMLDivElement;
container.appendChild(div);

// 6. Limpiar un contenedor
// Antes de pintar resultados nuevos (filtros), siempre hay que limpiar.
container.innerHTML = ""; // La forma más rápida
// O
while (container.firstChild) {
    container.removeChild(container.firstChild);
}
```

## 8. Trabajo con Arrays (Filtros y Búsquedas en Memoria)
Si te piden filtrar cosas sin llamar al servidor (filtrado en cliente):
.map() - Transformar datos
Para sacar solo los IDs o nombres de una lista de objetos.
```typescript
const nombresProvincias: string[] = provinces.map(p => p.name);

// .filter() - Filtrar listas
// Para quedarte con elementos que cumplan una condición.
const baratas = properties.filter(p => p.price < 100000);

// .find() - Buscar un solo elemento
// Útil para encontrar el objeto completo cuando solo tienes el ID (como hicimos con los pueblos).
const puebloSeleccionado = towns.find(t => t.id === selectedId);
if (puebloSeleccionado) {
    console.log(puebloSeleccionado.name);
}
```

## 9. Trucos Varios "Salva-vidas"
Fechas (Intl.DateTimeFormat)
Si el servidor te manda una fecha fea (2023-10-25T12:00:00Z) y tienes que mostrarla bonita (25/10/2023).

```typescript
const fecha = new Date(property.createdAt);
const fechaBonita = new Intl.DateTimeFormat("es-ES").format(fecha);
// Resultado: "25/10/2023"

// FormData (Alternativa para formularios)
// Si el formulario es muy grande y no quieres coger los inputs uno a uno (title.value, price.value...), usa FormData.
const form = document.getElementById("mi-form") as HTMLFormElement;
const formData = new FormData(form);

// Convertir a objeto simple
const data = Object.fromEntries(formData.entries());
console.log(data); // { title: "...", price: "..." }
// Ojo: Todo serán strings, tendrás que convertir los números manualmente después.

// Redirección con historial vs sin historial
/* location.assign("url"): El usuario puede dar al botón "Atrás" para volver. (Normalmente lo que quieres).

	location.replace("url"): Borra la historia. El usuario NO puede volver atrás. (Útil para Logout o errores fatales).*/

// Depuración rápida (Console)
// Si algo falla y no sabes qué es, imprime el objeto entero, no solo una propiedad.

// Mal
console.log("Error: " + error); // Te saldría [object Object]

// Bien
console.log("Objeto recibido:", response); // Puedes desplegarlo en la consola
console.error(error); // Sale en rojo y con traza