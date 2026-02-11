import { Album, type AlbumData } from "../models/album.js";
import { User, type UserData } from "../models/user.js";

const ALBUMS_URL = "public/data/albums.json";
const USERS_URL = "public/data/users.json";


// Función genérica para cargar y parsear JSON desde una URL, con manejo de errores
async function fetchJson<T>(url: string): Promise<T> { // T es un tipo genérico que representa el tipo de datos que esperamos recibir (despues puede servir tanto para albumes como para usuarios)
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`No se pudo cargar ${url} (${response.status})`);
  }
  return (await response.json()) as T;
}

export async function loadAlbums(): Promise<Album[]> {
  const data = await fetchJson<AlbumData[]>(ALBUMS_URL);
  return data.map(Album.fromData);
}

export async function loadUsers(): Promise<User[]> {
  const data = await fetchJson<UserData[]>(USERS_URL);
  return data.map(User.fromData);
}
