var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    var _a, _b;
    const cover = (_a = album.cover) === null || _a === void 0 ? void 0 : _a.trim();
    if (!cover || cover === LEGACY_PLACEHOLDER_COVER) {
        return Object.assign(Object.assign({}, album), { cover: (_b = PRESET_COVERS[album.id]) !== null && _b !== void 0 ? _b : DEFAULT_COVER });
    }
    return album;
}
function normalizeAlbums(albums) {
    return albums.map(normalizeAlbumCover);
}
// Función genérica para cargar y parsear JSON desde una URL, con manejo de errores
function fetchJson(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url);
        if (!response.ok) {
            throw new Error(`No se pudo cargar ${url} (${response.status})`);
        }
        return (yield response.json());
    });
}
export function loadAlbums() {
    return __awaiter(this, void 0, void 0, function* () {
        const stored = readStorage(ALBUMS_STORAGE_KEY);
        if (stored !== null) {
            const normalizedStored = normalizeAlbums(stored);
            writeStorage(ALBUMS_STORAGE_KEY, normalizedStored);
            return normalizedStored.map(Album.fromData);
        }
        const data = normalizeAlbums(yield fetchJson(ALBUMS_URL));
        writeStorage(ALBUMS_STORAGE_KEY, data);
        return data.map(Album.fromData);
    });
}
export function loadUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const stored = readStorage(USERS_STORAGE_KEY);
        if (stored !== null) {
            return stored.map(User.fromData);
        }
        const data = yield fetchJson(USERS_URL);
        writeStorage(USERS_STORAGE_KEY, data);
        return data.map(User.fromData);
    });
}
// convierten objetos Album y User a JSON y los guardan en LocalStorage
export function saveAlbums(albums) {
    writeStorage(ALBUMS_STORAGE_KEY, albums.map(album => album.toData()));
}
export function saveUsers(users) {
    writeStorage(USERS_STORAGE_KEY, users.map(user => user.toData()));
}
