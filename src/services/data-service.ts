import { Album, type AlbumData } from "../models/album.js";
import { User, type UserData } from "../models/user.js";

const ALBUMS_URL = "public/data/albums.json";
const USERS_URL = "public/data/users.json";
const ALBUMS_STORAGE_KEY = "soundlab_albums";
const USERS_STORAGE_KEY = "soundlab_users";

function readStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn("Storage corrupto o inaccesible:", key, error);
    return null;
  }
}

function writeStorage<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}


// Función genérica para cargar y parsear JSON desde una URL, con manejo de errores
async function fetchJson<T>(url: string): Promise<T> { // T es un tipo genérico que representa el tipo de datos que esperamos recibir (despues puede servir tanto para albumes como para usuarios)
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`No se pudo cargar ${url} (${response.status})`);
  }
  return (await response.json()) as T;
}

export async function loadAlbums(): Promise<Album[]> {
  const stored = readStorage<AlbumData[]>(ALBUMS_STORAGE_KEY);
  if (stored !== null) {
    return stored.map(Album.fromData);
  }

  const data = await fetchJson<AlbumData[]>(ALBUMS_URL);
  writeStorage(ALBUMS_STORAGE_KEY, data);
  return data.map(Album.fromData);
}

export async function loadUsers(): Promise<User[]> {
  const stored = readStorage<UserData[]>(USERS_STORAGE_KEY);
  if (stored !== null) {
    return stored.map(User.fromData);
  }

  const data = await fetchJson<UserData[]>(USERS_URL);
  writeStorage(USERS_STORAGE_KEY, data);
  return data.map(User.fromData);
}

// convierten objetos Album y User a JSON y los guardan en LocalStorage
export function saveAlbums(albums: Album[]): void {
  writeStorage(
    ALBUMS_STORAGE_KEY,
    albums.map(album => album.toData())
  );
}

export function saveUsers(users: User[]): void {
  writeStorage(
    USERS_STORAGE_KEY,
    users.map(user => user.toData())
  );
}
