import { loadAlbums, saveAlbums } from "../services/data-service.js";
import type { Album } from "../models/album.js";

type HomeSort = "default" | "title-asc" | "year-desc" | "year-asc";

interface HomeFilters {
  searchTerm: string;
  genre: string;
  sort: HomeSort;
}

console.log("Home cargado");

const container = document.getElementById("album-container");

if (container) {
  const albumContainer = container;
  const searchInput = document.getElementById("home-search") as HTMLInputElement | null;
  const genreSelect = document.getElementById("home-genre") as HTMLSelectElement | null;
  const sortSelect = document.getElementById("home-sort") as HTMLSelectElement | null;
  const clearFiltersButton = document.getElementById("home-clear-filters") as HTMLButtonElement | null;
  const statusLine = document.getElementById("home-status");

  let albumsState: Album[] = [];
  const filters: HomeFilters = {
    searchTerm: "",
    genre: "",
    sort: "default"
  };

  const normalizeText = (value: string): string => value.trim().toLowerCase();

  const setStatus = (text: string, tone: "info" | "error" | "success" = "info"): void => {
    if (!statusLine) return;
    statusLine.textContent = text;
    statusLine.className = `status-line ${tone}`;
  };

  function renderAlbums(albums: Album[]): void {
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

  const getFilteredAlbums = (): Album[] => {
    const term = normalizeText(filters.searchTerm);
    let filtered = [...albumsState];

    if (term) {
      filtered = filtered.filter(album => {
        return (
          normalizeText(album.title).includes(term) ||
          normalizeText(album.artist).includes(term)
        );
      });
    }

    if (filters.genre) {
      filtered = filtered.filter(album => album.genre === filters.genre);
    }

    if (filters.sort === "title-asc") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (filters.sort === "year-desc") {
      filtered.sort((a, b) => b.year - a.year);
    } else if (filters.sort === "year-asc") {
      filtered.sort((a, b) => a.year - b.year);
    }

    return filtered;
  };

  const renderGenres = (): void => {
    if (!genreSelect) return;
    const selectedValue = filters.genre;
    const genres = Array.from(new Set(albumsState.map(album => album.genre))).sort((a, b) =>
      a.localeCompare(b)
    );

    genreSelect.innerHTML = `
      <option value="">Todos los generos</option>
      ${genres.map(genre => `<option value="${genre}">${genre}</option>`).join("")}
    `;

    genreSelect.value = selectedValue;
  };

  const renderHome = (): void => {
    const visibleAlbums = getFilteredAlbums();
    renderAlbums(visibleAlbums);

    if (albumsState.length === 0) {
      setStatus("No hay albums cargados.", "info");
      return;
    }

    if (visibleAlbums.length === 0) {
      setStatus("No hay resultados para los filtros actuales.", "info");
      return;
    }

    setStatus(`Mostrando ${visibleAlbums.length} de ${albumsState.length} albums.`, "success");
  };

  function toggleLike(albumId: number): void {
    const targetAlbum = albumsState.find(album => album.id === albumId);
    if (!targetAlbum) return;
    targetAlbum.liked = !targetAlbum.liked;
    saveAlbums(albumsState);
    renderHome();
  }

  albumContainer.addEventListener("click", event => {
    const target = event.target as HTMLElement | null;
    const button = target?.closest<HTMLButtonElement>("[data-action='toggle-like']");
    if (!button) return;
    const id = Number(button.dataset.id);
    if (Number.isNaN(id)) return;

    toggleLike(id);
  });

  searchInput?.addEventListener("input", () => {
    filters.searchTerm = searchInput.value;
    renderHome();
  });

  genreSelect?.addEventListener("change", () => {
    filters.genre = genreSelect.value;
    renderHome();
  });

  sortSelect?.addEventListener("change", () => {
    const sortValue = sortSelect.value as HomeSort;
    filters.sort = sortValue;
    renderHome();
  });

  clearFiltersButton?.addEventListener("click", () => {
    filters.searchTerm = "";
    filters.genre = "";
    filters.sort = "default";
    if (searchInput) searchInput.value = "";
    if (genreSelect) genreSelect.value = "";
    if (sortSelect) sortSelect.value = "default";
    renderHome();
  });

  async function initHome(): Promise<void> {
    try {
      setStatus("Cargando albums...", "info");
      albumsState = await loadAlbums();
      renderGenres();
      renderHome();
    } catch (error) {
      albumContainer.innerHTML = "";
      setStatus("Error cargando albums.", "error");
      console.error("Error cargando albums:", error);
    }
  }

  initHome();
}
