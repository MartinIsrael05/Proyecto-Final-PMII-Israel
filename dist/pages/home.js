"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
console.log("Home real cargado");
// Función asincrónica para cargar los álbumes
function loadAlbums() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // 1. Fetch al JSON (asincronismo)
            const response = yield fetch("public/data/albums.json");
            // 2. Convertimos la respuesta a JSON tipado
            const albums = yield response.json();
            // 3. Obtenemos el contenedor del DOM
            const container = document.getElementById("album-container");
            if (!container)
                return;
            // Limpiamos el contenedor por las dudas
            container.innerHTML = "";
            // 4. Recorremos los álbumes y creamos las cards
            albums.forEach(album => {
                const card = document.createElement("div");
                card.className = "album-card";
                card.innerHTML = `
        <img src="${album.cover}" alt="${album.title}" />
        <h3>${album.title}</h3>
        <p>${album.artist} (${album.year})</p>
        <small>${album.genre}</small>
        <button class="like-btn">
          ${album.liked ? "❤️" : "🤍"}
        </button>
      `;
                container.appendChild(card);
            });
        }
        catch (error) {
            console.error("Error cargando álbumes:", error);
        }
    });
}
// Ejecutamos la carga al entrar a la página
loadAlbums();
