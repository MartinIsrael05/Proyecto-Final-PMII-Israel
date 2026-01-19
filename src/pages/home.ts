console.log("Home real cargado");

// Definimos el tipo de dato que esperamos del JSON
interface AlbumData {
  id: number;
  title: string;
  artist: string;
  year: number;
  genre: string;
  cover: string;
  liked: boolean;
}

// Función asincrónica para cargar los álbumes
async function loadAlbums(): Promise<void> {
  try {
    // 1. Fetch al JSON (asincronismo)
    const response = await fetch("public/data/albums.json");

    // 2. Convertimos la respuesta a JSON tipado
    const albums: AlbumData[] = await response.json();

    // 3. Obtenemos el contenedor del DOM
    const container = document.getElementById("album-container");
    if (!container) return;

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

  } catch (error) {
    console.error("Error cargando álbumes:", error);
  }
}

// Ejecutamos la carga al entrar a la página
loadAlbums();
