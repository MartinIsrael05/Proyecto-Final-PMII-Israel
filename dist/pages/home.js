var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { loadAlbums } from "../services/data-service.js";
console.log("Home cargado");
const container = document.getElementById("album-container");
if (container) {
    const albumContainer = container;
    let albumsState = [];
    function renderAlbums(albums) {
        albumContainer.innerHTML = "";
        albums.forEach(album => {
            const card = document.createElement("article");
            card.className = "album-card";
            card.innerHTML = `
        <img src="${album.cover}" alt="${album.title}" />
        <div class="album-content">
          <h3>${album.title}</h3>
          <p>${album.artist} (${album.year})</p>
          <small>${album.genre}</small>
          <button class="like-btn" data-action="toggle-like" data-id="${album.id}">
            ${album.liked ? "Liked" : "Like"}
          </button>
        </div>
      `;
            albumContainer.appendChild(card);
        });
    }
    function toggleLike(albumId) {
        const targetAlbum = albumsState.find(album => album.id === albumId);
        if (!targetAlbum)
            return;
        targetAlbum.liked = !targetAlbum.liked;
        renderAlbums(albumsState);
    }
    albumContainer.addEventListener("click", event => {
        const target = event.target;
        const button = target === null || target === void 0 ? void 0 : target.closest("[data-action='toggle-like']");
        if (!button)
            return;
        const id = Number(button.dataset.id);
        if (Number.isNaN(id))
            return;
        toggleLike(id);
    });
    function initHome() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                albumsState = yield loadAlbums();
                renderAlbums(albumsState);
            }
            catch (error) {
                console.error("Error cargando albums:", error);
            }
        });
    }
    initHome();
}
