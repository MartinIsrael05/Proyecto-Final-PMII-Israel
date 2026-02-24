import { loadAlbums, saveAlbums } from "../services/data-service.js";
console.log("Home cargado");
const container = document.getElementById("album-container");
if (container) {
    const albumContainer = container;
    const searchInput = document.getElementById("home-search");
    const genreSelect = document.getElementById("home-genre");
    const sortSelect = document.getElementById("home-sort");
    const clearFiltersButton = document.getElementById("home-clear-filters");
    const statusLine = document.getElementById("home-status");
    let albumsState = [];
    const filters = {
        searchTerm: "",
        genre: "",
        sort: "default"
    };
    const normalizeText = (value) => value.trim().toLowerCase();
    const setStatus = (text, tone = "info") => {
        if (!statusLine)
            return;
        statusLine.textContent = text;
        statusLine.className = `status-line ${tone}`;
    };
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
    const getFilteredAlbums = () => {
        const term = normalizeText(filters.searchTerm);
        let filtered = [...albumsState];
        if (term) {
            filtered = filtered.filter(album => {
                return (normalizeText(album.title).includes(term) ||
                    normalizeText(album.artist).includes(term));
            });
        }
        if (filters.genre) {
            filtered = filtered.filter(album => album.genre === filters.genre);
        }
        if (filters.sort === "title-asc") {
            filtered.sort((a, b) => a.title.localeCompare(b.title));
        }
        else if (filters.sort === "year-desc") {
            filtered.sort((a, b) => b.year - a.year);
        }
        else if (filters.sort === "year-asc") {
            filtered.sort((a, b) => a.year - b.year);
        }
        return filtered;
    };
    const renderGenres = () => {
        if (!genreSelect)
            return;
        const selectedValue = filters.genre;
        const genres = Array.from(new Set(albumsState.map(album => album.genre))).sort((a, b) => a.localeCompare(b));
        genreSelect.innerHTML = `
      <option value="">Todos los generos</option>
      ${genres.map(genre => `<option value="${genre}">${genre}</option>`).join("")}
    `;
        genreSelect.value = selectedValue;
    };
    const renderHome = () => {
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
    function toggleLike(albumId) {
        const targetAlbum = albumsState.find(album => album.id === albumId);
        if (!targetAlbum)
            return;
        targetAlbum.liked = !targetAlbum.liked;
        saveAlbums(albumsState);
        renderHome();
    }
    albumContainer.addEventListener("click", event => {
        const target = event.target;
        const button = target?.closest("[data-action='toggle-like']");
        if (!button)
            return;
        const id = Number(button.dataset.id);
        if (Number.isNaN(id))
            return;
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
        const sortValue = sortSelect.value;
        filters.sort = sortValue;
        renderHome();
    });
    clearFiltersButton?.addEventListener("click", () => {
        filters.searchTerm = "";
        filters.genre = "";
        filters.sort = "default";
        if (searchInput)
            searchInput.value = "";
        if (genreSelect)
            genreSelect.value = "";
        if (sortSelect)
            sortSelect.value = "default";
        renderHome();
    });
    async function initHome() {
        try {
            setStatus("Cargando albums...", "info");
            albumsState = await loadAlbums();
            renderGenres();
            renderHome();
        }
        catch (error) {
            albumContainer.innerHTML = "";
            setStatus("Error cargando albums.", "error");
            console.error("Error cargando albums:", error);
        }
    }
    initHome();
}
