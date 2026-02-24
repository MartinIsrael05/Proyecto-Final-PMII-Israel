import { Album } from "../models/album.js";
import { User } from "../models/user.js";
const ALBUMS_URL = "public/data/albums.json";
const USERS_URL = "public/data/users.json";
const ALBUMS_STORAGE_KEY = "soundlab_albums";
const USERS_STORAGE_KEY = "soundlab_users";
const LEGACY_PLACEHOLDER_COVER = "https://via.placeholder.com/300";
const DEFAULT_COVER = "public/images/covers/after-hours.jpg";
const PRESET_COVERS = {
    1: "public/images/covers/after-hours.jpg",
    2: "public/images/covers/uvst.jpg"
};
function readStorage(key) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw)
            return null;
        return JSON.parse(raw);
    }
    catch (error) {
        console.warn("Storage corrupto o inaccesible:", key, error);
        return null;
    }
}
function writeStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}
function normalizeAlbumCover(album) {
    const cover = album.cover?.trim();
    if (!cover || cover === LEGACY_PLACEHOLDER_COVER) {
        return { ...album, cover: PRESET_COVERS[album.id] ?? DEFAULT_COVER };
    }
    return album;
}
function normalizeAlbums(albums) {
    return albums.map(normalizeAlbumCover);
}
// Función genérica para cargar y parsear JSON desde una URL, con manejo de errores
async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`No se pudo cargar ${url} (${response.status})`);
    }
    return (await response.json());
}
export async function loadAlbums() {
    const stored = readStorage(ALBUMS_STORAGE_KEY);
    if (stored !== null) {
        const normalizedStored = normalizeAlbums(stored);
        writeStorage(ALBUMS_STORAGE_KEY, normalizedStored);
        return normalizedStored.map(Album.fromData);
    }
    const data = normalizeAlbums(await fetchJson(ALBUMS_URL));
    writeStorage(ALBUMS_STORAGE_KEY, data);
    return data.map(Album.fromData);
}
export async function loadUsers() {
    const stored = readStorage(USERS_STORAGE_KEY);
    if (stored !== null) {
        return stored.map(User.fromData);
    }
    const data = await fetchJson(USERS_URL);
    writeStorage(USERS_STORAGE_KEY, data);
    return data.map(User.fromData);
}
// convierten objetos Album y User a JSON y los guardan en LocalStorage
export function saveAlbums(albums) {
    writeStorage(ALBUMS_STORAGE_KEY, albums.map(album => album.toData()));
}
export function saveUsers(users) {
    writeStorage(USERS_STORAGE_KEY, users.map(user => user.toData()));
}
export function clearStoredData() {
    localStorage.removeItem(ALBUMS_STORAGE_KEY);
    localStorage.removeItem(USERS_STORAGE_KEY);
}
