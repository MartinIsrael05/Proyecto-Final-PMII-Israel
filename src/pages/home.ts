import { loadAlbums } from "../services/data-service.js";
import type { Album } from "../models/album.js";

console.log("Home cargado");

const container = document.getElementById("album-container");

if (container) {
  const albumContainer = container; // garantiza que container no sea null.
  let albumsState: Album[] = [];

  function renderAlbums(albums: Album[]): void { // la funcion no devuelve ningun valor, en este caso, actualiza el dom, por eso se usa void.
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


// busca el album por id, si lo encuentra, pasa a likeado, sino no hace nada.
  function toggleLike(albumId: number): void {
    const targetAlbum = albumsState.find(album => album.id === albumId);
    if (!targetAlbum) return;
    targetAlbum.liked = !targetAlbum.liked;
    renderAlbums(albumsState);
  }

  // busca el boton mas cercano y si tiene el toggle-like, lo devuelve con el id del album, sino null.
  albumContainer.addEventListener("click", event => {
    const target = event.target as HTMLElement | null; 
    const button = target?.closest<HTMLButtonElement>("[data-action='toggle-like']"); 
    if (!button) return;
    const id = Number(button.dataset.id); 
    if (Number.isNaN(id)) return;

    toggleLike(id);
  });

  async function initHome(): Promise<void> {
    try {
      albumsState = await loadAlbums();
      renderAlbums(albumsState);
    } catch (error) {
      console.error("Error cargando albums:", error);
    }
  }

  initHome();
}
