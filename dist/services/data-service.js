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
        const data = yield fetchJson(ALBUMS_URL);
        return data.map(Album.fromData);
    });
}
export function loadUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield fetchJson(USERS_URL);
        return data.map(User.fromData);
    });
}
