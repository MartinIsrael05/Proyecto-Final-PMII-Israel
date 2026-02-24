import { loadAlbums, loadUsers, saveAlbums, saveUsers, clearStoredData } from "../services/data-service.js";
import { Album } from "../models/album.js";
import { User } from "../models/user.js";
const root = document.getElementById("admin-root");
if (!root) {
    // Esta pagina no es Admin.
    console.log("Admin no activo");
}
else {
    const loginSection = document.getElementById("admin-login");
    const messageSection = document.getElementById("admin-message");
    const dashboardSection = document.getElementById("admin-dashboard");
    const formContainer = document.getElementById("admin-form");
    const listContainer = document.getElementById("admin-list");
    const feedbackContainer = document.getElementById("admin-feedback");
    const searchInput = document.getElementById("admin-search");
    const listStatus = document.getElementById("admin-list-status");
    const logList = document.getElementById("admin-log-list");
    const loginForm = document.getElementById("admin-login-form");
    if (!loginSection ||
        !messageSection ||
        !dashboardSection ||
        !formContainer ||
        !listContainer ||
        !feedbackContainer ||
        !searchInput ||
        !listStatus ||
        !logList ||
        !loginForm) {
        throw new Error("Estructura Admin incompleta.");
    }
    const state = {
        albums: [],
        users: [],
        activeTab: "albums",
        adminUser: null,
        editingAlbumId: null,
        editingUserId: null,
        searchTerm: "",
        actionLog: []
    };
    const today = () => new Date().toISOString().slice(0, 10);
    const currentYear = new Date().getFullYear();
    const yearMin = 1900;
    const yearMax = currentYear + 1;
    const coversBasePath = "public/images/covers/";
    const setMessage = (text) => {
        messageSection.textContent = text;
        messageSection.classList.toggle("hidden", text.length === 0);
    };
    const setFeedback = (text, tone = "info") => {
        feedbackContainer.textContent = text;
        feedbackContainer.className = `admin-feedback ${tone}`;
    };
    const setListStatus = (text, tone = "info") => {
        listStatus.textContent = text;
        listStatus.className = `status-line ${tone}`;
    };
    const renderActionLog = () => {
        if (state.actionLog.length === 0) {
            logList.innerHTML = `<li class="empty-state">Sin acciones todavia.</li>`;
            return;
        }
        logList.innerHTML = state.actionLog
            .map(line => `<li>${line}</li>`)
            .join("");
    };
    const normalizeText = (value) => value.trim().toLowerCase();
    const logAdminRequest = (action, entity, payload) => {
        const request = {
            actorEmail: state.adminUser?.email ?? "unknown",
            action,
            entity,
            timestamp: new Date().toISOString(),
            payload
        };
        console.log("Admin request:", request);
        const timestamp = new Date(request.timestamp).toLocaleTimeString();
        const line = `[${timestamp}] ${entity.toUpperCase()} ${action.toUpperCase()}`;
        state.actionLog = [line, ...state.actionLog].slice(0, 12);
        renderActionLog();
    };
    const getNextAlbumId = () => {
        const ids = state.albums.map(album => album.id);
        return ids.length ? Math.max(...ids) + 1 : 1;
    };
    const getNextUserId = () => {
        const ids = state.users.map(user => user.id);
        return ids.length ? Math.max(...ids) + 1 : 1;
    };
    const renderTabs = () => {
        const tabs = dashboardSection.querySelectorAll("[data-tab]");
        tabs.forEach(tab => {
            tab.classList.toggle("is-active", tab.dataset.tab === state.activeTab);
        });
    };
    const getCoverFileName = (coverPath) => {
        if (coverPath.startsWith(coversBasePath)) {
            return coverPath.slice(coversBasePath.length);
        }
        return coverPath;
    };
    const renderAlbumForm = (editing) => {
        return `
      <form id="album-form" class="admin-form">
        <input type="hidden" name="id" value="${editing ? editing.id : ""}" />
        <label>
          Titulo
          <input type="text" name="title" required value="${editing ? editing.title : ""}" />
        </label>
        <label>
          Artista
          <input type="text" name="artist" required value="${editing ? editing.artist : ""}" />
        </label>
        <label>
          Año
          <input type="number" name="year" required value="${editing ? editing.year : ""}" />
        </label>
        <label>
          Genero
          <input type="text" name="genre" required value="${editing ? editing.genre : ""}" />
        </label>
        <label>
          Cover URL
          <input
            type="text"
            name="cover"
            required
            placeholder="mi-cover.jpg"
            value="${editing ? getCoverFileName(editing.cover) : ""}"
          />
        </label>
        <label class="checkbox">
          <input type="checkbox" name="liked" ${editing?.liked ? "checked" : ""} />
          Liked
        </label>
        <div class="form-actions">
          <button type="submit">${editing ? "Guardar cambios" : "Agregar album"}</button>
          ${editing
            ? `<button type="button" data-action="cancel-edit" data-entity="album">Cancelar</button>`
            : ""}
        </div>
      </form>
    `;
    };
    const renderUserForm = (editing) => {
        return `
      <form id="user-form" class="admin-form">
        <input type="hidden" name="id" value="${editing ? editing.id : ""}" />
        <label>
          Nombre
          <input type="text" name="name" required value="${editing ? editing.name : ""}" />
        </label>
        <label>
          Email
          <input type="email" name="email" required value="${editing ? editing.email : ""}" />
        </label>
        <label>
          Password
          <input type="text" name="password" required value="${editing ? editing.password : ""}" />
        </label>
        <label>
          Fecha registro
          <input type="date" name="registerDate" value="${editing ? editing.registerDate : today()}" />
        </label>
        <label class="checkbox">
          <input type="checkbox" name="isSubscribed" ${editing?.isSubscribed ? "checked" : ""} />
          Suscripto
        </label>
        <label class="checkbox">
          <input type="checkbox" name="isAdmin" ${editing?.isAdmin ? "checked" : ""} />
          Admin
        </label>
        <label>
          Liked IDs (comma)
          <input type="text" name="likedPostIDs" value="${editing ? editing.likedPostIDs.join(", ") : ""}" />
        </label>
        <div class="form-actions">
          <button type="submit">${editing ? "Guardar cambios" : "Agregar usuario"}</button>
          ${editing
            ? `<button type="button" data-action="cancel-edit" data-entity="user">Cancelar</button>`
            : ""}
        </div>
      </form>
    `;
    };
    const renderAlbumList = () => {
        if (state.albums.length === 0) {
            setListStatus("No hay albums cargados.", "info");
            return `<p class="empty-state">No hay albums cargados.</p>`;
        }
        const searchTerm = normalizeText(state.searchTerm);
        const visibleAlbums = state.albums.filter(album => {
            if (!searchTerm)
                return true;
            const text = `${album.title} ${album.artist} ${album.genre} ${album.year}`;
            return normalizeText(text).includes(searchTerm);
        });
        if (visibleAlbums.length === 0) {
            setListStatus("No hay resultados para la busqueda actual.", "info");
            return `<p class="empty-state">No hay resultados para la busqueda.</p>`;
        }
        setListStatus(`Mostrando ${visibleAlbums.length} de ${state.albums.length} albums.`, "success");
        return `
      <div class="admin-grid">
        ${visibleAlbums
            .map(album => `
              <article class="admin-card">
                <img src="${album.cover}" alt="${album.title}" />
                <div>
                  <h3>${album.title}</h3>
                  <p>${album.artist} (${album.year})</p>
                  <small>${album.genre}</small>
                  <p class="meta">Liked: ${album.liked ? "Si" : "No"}</p>
                  <div class="card-actions">
                    <button data-action="edit-album" data-id="${album.id}">Editar</button>
                    <button data-action="delete-album" data-id="${album.id}">Borrar</button>
                  </div>
                </div>
              </article>
            `)
            .join("")}
      </div>
    `;
    };
    const renderUserList = () => {
        if (state.users.length === 0) {
            setListStatus("No hay usuarios cargados.", "info");
            return `<p class="empty-state">No hay usuarios cargados.</p>`;
        }
        const searchTerm = normalizeText(state.searchTerm);
        const visibleUsers = state.users.filter(user => {
            if (!searchTerm)
                return true;
            const text = `${user.name} ${user.email} ${user.registerDate}`;
            return normalizeText(text).includes(searchTerm);
        });
        if (visibleUsers.length === 0) {
            setListStatus("No hay resultados para la busqueda actual.", "info");
            return `<p class="empty-state">No hay resultados para la busqueda.</p>`;
        }
        setListStatus(`Mostrando ${visibleUsers.length} de ${state.users.length} usuarios.`, "success");
        return `
      <div class="admin-grid">
        ${visibleUsers
            .map(user => `
              <article class="admin-card">
                <div>
                  <h3>${user.name}</h3>
                  <p>${user.email}</p>
                  <p class="meta">Admin: ${user.isAdmin ? "Si" : "No"}</p>
                  <p class="meta">Suscripto: ${user.isSubscribed ? "Si" : "No"}</p>
                  <p class="meta">Registro: ${user.registerDate}</p>
                  <p class="meta">Liked IDs: ${user.likedPostIDs.join(", ") || "Ninguno"}</p>
                  <div class="card-actions">
                    <button data-action="edit-user" data-id="${user.id}">Editar</button>
                    <button data-action="delete-user" data-id="${user.id}">Borrar</button>
                  </div>
                </div>
              </article>
            `)
            .join("")}
      </div>
    `;
    };
    const render = () => {
        if (!state.adminUser) {
            loginSection.classList.remove("hidden");
            dashboardSection.classList.add("hidden");
            setListStatus("", "info");
            return;
        }
        loginSection.classList.add("hidden");
        dashboardSection.classList.remove("hidden");
        renderTabs();
        renderActionLog();
        searchInput.placeholder =
            state.activeTab === "albums"
                ? "Buscar album por titulo, artista o genero..."
                : "Buscar usuario por nombre o email...";
        searchInput.value = state.searchTerm;
        if (state.activeTab === "albums") {
            const editing = state.albums.find(album => album.id === state.editingAlbumId);
            formContainer.innerHTML = renderAlbumForm(editing);
            listContainer.innerHTML = renderAlbumList();
            const albumForm = formContainer.querySelector("#album-form");
            if (albumForm) {
                albumForm.addEventListener("submit", event => {
                    event.preventDefault();
                    handleAlbumSubmit(albumForm);
                });
                albumForm.addEventListener("input", () => {
                    if (feedbackContainer.classList.contains("error")) {
                        setFeedback("", "info");
                    }
                });
            }
        }
        else {
            const editing = state.users.find(user => user.id === state.editingUserId);
            formContainer.innerHTML = renderUserForm(editing);
            listContainer.innerHTML = renderUserList();
            const userForm = formContainer.querySelector("#user-form");
            if (userForm) {
                userForm.addEventListener("submit", event => {
                    event.preventDefault();
                    handleUserSubmit(userForm);
                });
            }
        }
    };
    const handleLogin = (event) => {
        event.preventDefault();
        const formData = new FormData(loginForm);
        const email = String(formData.get("email") ?? "").trim();
        const password = String(formData.get("password") ?? "").trim();
        const user = state.users.find(candidate => candidate.email === email && candidate.password === password);
        if (!user) {
            setMessage("Credenciales invalidas.");
            return;
        }
        if (!user.isAdmin) {
            setMessage("Acceso restringido. Solo administradores.");
            return;
        }
        state.adminUser = user;
        setMessage("");
        setFeedback(`Bienvenido ${user.name}`, "success");
        render();
    };
    const readText = (formData, name) => {
        const value = formData.get(name);
        return typeof value === "string" ? value.trim() : "";
    };
    const readNumber = (formData, name) => {
        const value = Number(readText(formData, name));
        return Number.isFinite(value) ? value : 0;
    };
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };
    const isValidCoverFileName = (coverFileName) => {
        return /^[^\\/]+\.(jpg|jpeg|png|webp)$/i.test(coverFileName);
    };
    const toCoverPath = (coverFileName) => {
        return `${coversBasePath}${coverFileName}`;
    };
    const handleAlbumSubmit = (form) => {
        const formData = new FormData(form);
        const title = readText(formData, "title");
        const artist = readText(formData, "artist");
        const yearRaw = readText(formData, "year");
        const year = Number.parseInt(yearRaw, 10);
        const genre = readText(formData, "genre");
        const coverFileName = readText(formData, "cover");
        const liked = form.querySelector("input[name='liked']")?.checked ?? false;
        if (!title) {
            setFeedback("El titulo del album es obligatorio.", "error");
            return;
        }
        if (!artist) {
            setFeedback("El artista del album es obligatorio.", "error");
            return;
        }
        if (!genre) {
            setFeedback("El genero del album es obligatorio.", "error");
            return;
        }
        if (!coverFileName) {
            setFeedback("La portada del album es obligatoria.", "error");
            return;
        }
        if (!isValidCoverFileName(coverFileName)) {
            setFeedback("Portada invalida. Usa solo nombre de archivo, por ejemplo: mi-cover.jpg", "error");
            return;
        }
        if (!Number.isInteger(year) || year < yearMin || year > yearMax) {
            setFeedback(`Año invalido. Debe estar entre ${yearMin} y ${yearMax}.`, "error");
            return;
        }
        const cover = toCoverPath(coverFileName);
        const id = readNumber(formData, "id");
        const data = {
            id: id || getNextAlbumId(),
            title,
            artist,
            year,
            genre,
            cover,
            liked
        };
        const duplicatedId = state.albums.some(album => album.id === data.id && album.id !== state.editingAlbumId);
        if (duplicatedId) {
            setFeedback(`ID de album duplicado (${data.id}).`, "error");
            return;
        }
        //si hay editingAlbumId, edita un album, sino crea uno nuevo
        if (state.editingAlbumId) {
            const target = state.albums.find(album => album.id === state.editingAlbumId);
            if (!target)
                return;
            const before = target.toData();
            Object.assign(target, data);
            logAdminRequest("update", "album", { before, after: data });
            setFeedback(`Album actualizado: ${data.title}`, "success");
        }
        else {
            state.albums.push(new Album(data));
            logAdminRequest("create", "album", data);
            setFeedback(`Album creado: ${data.title}`, "success");
        }
        saveAlbums(state.albums);
        state.editingAlbumId = null;
        render();
    };
    const parseLikedIds = (raw) => {
        if (!raw)
            return [];
        return raw
            .split(",")
            .map(value => Number(value.trim()))
            .filter(value => Number.isFinite(value) && value > 0);
    };
    const handleUserSubmit = (form) => {
        const formData = new FormData(form);
        const name = readText(formData, "name");
        const email = readText(formData, "email");
        const password = readText(formData, "password");
        const registerDate = readText(formData, "registerDate") || today();
        const isSubscribed = form.querySelector("input[name='isSubscribed']")?.checked ?? false;
        const isAdmin = form.querySelector("input[name='isAdmin']")?.checked ?? false;
        const likedPostIDs = parseLikedIds(readText(formData, "likedPostIDs"));
        if (!name) {
            setFeedback("El nombre del usuario es obligatorio.", "error");
            return;
        }
        if (!email) {
            setFeedback("El email del usuario es obligatorio.", "error");
            return;
        }
        if (!isValidEmail(email)) {
            setFeedback("Email invalido.", "error");
            return;
        }
        if (!password) {
            setFeedback("La password del usuario es obligatoria.", "error");
            return;
        }
        if (!registerDate || Number.isNaN(new Date(registerDate).getTime())) {
            setFeedback("Fecha de registro invalida.", "error");
            return;
        }
        const id = readNumber(formData, "id");
        const data = {
            id: id || getNextUserId(),
            name,
            email,
            password,
            registerDate,
            isSubscribed,
            isAdmin,
            likedPostIDs
        };
        const duplicatedId = state.users.some(user => user.id === data.id && user.id !== state.editingUserId);
        if (duplicatedId) {
            setFeedback(`ID de usuario duplicado (${data.id}).`, "error");
            return;
        }
        const duplicatedEmail = state.users.some(user => user.email.toLowerCase() === data.email.toLowerCase() && user.id !== state.editingUserId);
        if (duplicatedEmail) {
            setFeedback(`Email duplicado (${data.email}).`, "error");
            return;
        }
        if (state.editingUserId) {
            const target = state.users.find(user => user.id === state.editingUserId);
            if (!target)
                return;
            const before = target.toData();
            Object.assign(target, data);
            logAdminRequest("update", "user", { before, after: data });
            setFeedback(`Usuario actualizado: ${data.name}`, "success");
        }
        else {
            state.users.push(new User(data));
            logAdminRequest("create", "user", data);
            setFeedback(`Usuario creado: ${data.name}`, "success");
        }
        saveUsers(state.users);
        state.editingUserId = null;
        render();
    };
    const handleDeleteAlbum = (id) => {
        const index = state.albums.findIndex(album => album.id === id);
        if (index === -1)
            return;
        const removed = state.albums[index];
        const confirmed = window.confirm(`Vas a borrar el album "${removed.title}". Esta accion no se puede deshacer.`);
        if (!confirmed)
            return;
        state.albums.splice(index, 1);
        logAdminRequest("delete", "album", removed.toData());
        saveAlbums(state.albums);
        setFeedback(`Album borrado: ${removed.title}`, "success");
        render();
    };
    const handleDeleteUser = (id) => {
        const index = state.users.findIndex(user => user.id === id);
        if (index === -1)
            return;
        const removed = state.users[index];
        const confirmed = window.confirm(`Vas a borrar el usuario "${removed.name}". Esta accion no se puede deshacer.`);
        if (!confirmed)
            return;
        state.users.splice(index, 1);
        logAdminRequest("delete", "user", removed.toData());
        saveUsers(state.users);
        setFeedback(`Usuario borrado: ${removed.name}`, "success");
        render();
    };
    const handleResetData = async () => {
        const confirmed = window.confirm("Se van a restaurar albums y usuarios desde los JSON originales. Continuar?");
        if (!confirmed)
            return;
        clearStoredData();
        try {
            const [albums, users] = await Promise.all([loadAlbums(), loadUsers()]);
            state.albums = albums;
            state.users = users;
            state.editingAlbumId = null;
            state.editingUserId = null;
            if (state.adminUser) {
                state.adminUser = users.find(user => user.email === state.adminUser?.email) ?? null;
            }
            setFeedback("Datos demo restaurados desde JSON.", "success");
            setListStatus("Datos restaurados correctamente.", "success");
            render();
        }
        catch (error) {
            console.error("Error restaurando datos demo:", error);
            setFeedback("No se pudieron restaurar los datos demo.", "error");
            setListStatus("Error al restaurar datos demo.", "error");
        }
    };
    root.addEventListener("click", async (event) => {
        const target = event.target;
        if (!target)
            return;
        const tabButton = target.closest("[data-tab]");
        if (tabButton) {
            const tab = tabButton.dataset.tab;
            if (tab) {
                state.activeTab = tab;
                state.editingAlbumId = null;
                state.editingUserId = null;
                state.searchTerm = "";
                render();
            }
            return;
        }
        const actionButton = target.closest("[data-action]");
        if (!actionButton)
            return;
        const action = actionButton.dataset.action;
        const id = Number(actionButton.dataset.id);
        if (action === "edit-album" && !Number.isNaN(id)) {
            state.editingAlbumId = id;
            render();
            return;
        }
        if (action === "delete-album" && !Number.isNaN(id)) {
            handleDeleteAlbum(id);
            return;
        }
        if (action === "edit-user" && !Number.isNaN(id)) {
            state.editingUserId = id;
            render();
            return;
        }
        if (action === "delete-user" && !Number.isNaN(id)) {
            handleDeleteUser(id);
            return;
        }
        if (action === "cancel-edit") {
            state.editingAlbumId = null;
            state.editingUserId = null;
            render();
            return;
        }
        if (action === "logout") {
            state.adminUser = null;
            state.searchTerm = "";
            setFeedback("Sesion cerrada.", "info");
            render();
            return;
        }
        if (action === "reset-data") {
            await handleResetData();
        }
    });
    searchInput.addEventListener("input", () => {
        state.searchTerm = searchInput.value;
        render();
    });
    loginForm.addEventListener("submit", handleLogin);
    const initAdmin = async () => {
        try {
            setFeedback("Cargando datos...", "info");
            setListStatus("Cargando datos...", "info");
            const [albums, users] = await Promise.all([loadAlbums(), loadUsers()]);
            state.albums = albums;
            state.users = users;
            setMessage("");
            setFeedback("Datos cargados. Inicia sesion con un admin.", "info");
            setListStatus("Datos listos para administrar.", "success");
        }
        catch (error) {
            console.error("Error cargando datos:", error);
            setMessage("No se pudieron cargar los datos.");
            setListStatus("Error al cargar datos.", "error");
        }
    };
    render();
    initAdmin();
}
