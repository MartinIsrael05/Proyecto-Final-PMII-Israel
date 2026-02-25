"use strict";
const researchRoot = document.getElementById("research-root");
if (researchRoot) {
    void initResearchPage(researchRoot);
}
async function initResearchPage(root) {
    const links = Array.from(root.querySelectorAll("[data-research-link]"));
    const sections = Array.from(root.querySelectorAll("[data-research-section]"));
    const progressFill = document.getElementById("research-progress-fill");
    const summary = document.getElementById("research-summary");
    const scrollStatus = document.getElementById("research-scroll");
    const updateSummary = () => {
        const reviewed = sections.filter(section => section.classList.contains("is-reviewed")).length;
        if (summary) {
            summary.textContent = `${reviewed} de ${sections.length} conceptos revisados`;
        }
        if (progressFill) {
            const progress = sections.length === 0 ? 0 : Math.round((reviewed / sections.length) * 100);
            progressFill.style.width = `${progress}%`;
        }
    };
    const setActiveSection = (sectionId) => {
        links.forEach(link => {
            const targetId = link.dataset.researchLink;
            link.classList.toggle("is-active", targetId === sectionId);
        });
        const activeSection = sections.find(section => section.id === sectionId);
        if (scrollStatus && activeSection) {
            const title = activeSection.dataset.conceptTitle ?? sectionId;
            scrollStatus.textContent = `Seccion activa: ${title}`;
        }
    };
    // Intersection Observer para detectar la sección activa
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting)
                return;
            const id = entry.target.id;
            if (id)
                setActiveSection(id);
        });
    }, { threshold: 0.45 });
    sections.forEach(section => observer.observe(section));
    root.addEventListener("click", event => {
        const target = event.target;
        if (!target)
            return;
        const toggleButton = target.closest("[data-action='toggle-reviewed']");
        if (!toggleButton)
            return;
        const section = toggleButton.closest("[data-research-section]");
        if (!section)
            return;
        const reviewed = section.classList.toggle("is-reviewed");
        toggleButton.textContent = reviewed ? "Marcar pendiente" : "Marcar revisado";
        updateSummary();
    });
    updateSummary();
    if (sections[0])
        setActiveSection(sections[0].id);
    try {
        const vue = await import("vue");
        mountVueDemos(vue);
    }
    catch (error) {
        console.error("No se pudo cargar Vue en research page", error);
        renderVueLoadError();
    }
}
function renderVueLoadError() {
    const demoIds = [
        "vue-reactivity-demo",
        "vue-conditional-demo",
        "vue-lists-demo",
        "vue-components-demo",
        "vue-async-demo"
    ];
    demoIds.forEach(id => {
        const mountPoint = document.getElementById(id);
        if (!mountPoint)
            return;
        mountPoint.innerHTML =
            "<p class='status-line error'>No se pudo cargar Vue. Verifica tu conexion y recarga la pagina.</p>";
    });
}
function mountVueDemos(vue) {
    const { createApp, ref, computed, watch, defineComponent } = vue;
    const reactivityTarget = document.getElementById("vue-reactivity-demo");
    if (reactivityTarget) {
        createApp({
            setup() {
                const query = ref("");
                const albums = ref([
                    { id: 1, title: "After Hours", artist: "The Weeknd", genre: "Synth-pop" },
                    { id: 2, title: "Thriller", artist: "Michael Jackson", genre: "Pop" },
                    { id: 3, title: "Back in Black", artist: "AC/DC", genre: "Rock" },
                    { id: 4, title: "Random Access Memories", artist: "Daft Punk", genre: "Electronic" }
                ]);
                const filteredAlbums = computed(() => {
                    const normalizedQuery = query.value.trim().toLowerCase();
                    if (!normalizedQuery)
                        return albums.value;
                    return albums.value.filter(album => {
                        const searchable = `${album.title} ${album.artist} ${album.genre}`.toLowerCase();
                        return searchable.includes(normalizedQuery);
                    });
                });
                return { query, albums, filteredAlbums };
            },
            template: `
        <div class="vue-demo">
          <label class="vue-field">
            Filtro reactivo
            <input
              v-model="query"
              type="text"
              placeholder="Escribi titulo, artista o genero"
            />
          </label>
          <p class="status-line">
            Resultado: {{ filteredAlbums.length }} de {{ albums.length }} albums
          </p>
          <ul class="vue-list">
            <li v-for="album in filteredAlbums" :key="album.id">
              <strong>{{ album.title }}</strong> - {{ album.artist }} - {{ album.genre }}
            </li>
          </ul>
        </div>
      `
        }).mount(reactivityTarget);
    }
    const ConditionalPanel = defineComponent({
        name: "ConditionalPanel",
        setup() {
            const note = ref("");
            return { note };
        },
        template: `
      <div class="vue-panel">
        <label class="vue-field">
          Estado local del componente
          <input v-model="note" type="text" placeholder="Escribi algo aca" />
        </label>
        <p class="status-line">Valor interno: "{{ note || "vacio" }}"</p>
      </div>
    `
    });
    const conditionalTarget = document.getElementById("vue-conditional-demo");
    if (conditionalTarget) {
        createApp({
            components: {
                ConditionalPanel
            },
            setup() {
                const mode = ref("if"); // Cambia entre v-if y v-show (default: v-if)
                const open = ref(false);
                return { mode, open };
            },
            template: `
        <div class="vue-demo">
          <div class="vue-demo-row">
            <button type="button" class="ghost" @click="open = !open">
              {{ open ? "Ocultar panel" : "Mostrar panel" }}
            </button>
            <label class="vue-inline-field">
              Estrategia
              <select v-model="mode">
                <option value="if">v-if</option>
                <option value="show">v-show</option>
              </select>
            </label>
          </div>
          <p class="status-line">
            Con v-if el panel se desmonta y pierde su estado local. Con v-show solo se oculta.
          </p>

          <template v-if="mode === 'if'">
            <Transition name="fade-slide">
              <ConditionalPanel v-if="open" />
            </Transition>
          </template>
          <template v-else>
            <ConditionalPanel v-show="open" />
          </template>
        </div>
      `
        }).mount(conditionalTarget);
    }
    const TrackRow = defineComponent({
        name: "TrackRow",
        props: {
            track: {
                type: Object,
                required: true
            }
        },
        emits: ["remove"],
        setup() {
            const personalNote = ref("");
            const likes = ref(0);
            return { personalNote, likes };
        },
        template: `
      <article class="vue-track-row">
        <div class="vue-track-main">
          <strong>{{ track.title }}</strong>
          <small>{{ track.artist }} - id: {{ track.id }}</small>
        </div>
        <label class="vue-mini-field">
          Nota local
          <input v-model="personalNote" type="text" placeholder="Se conserva por key" />
        </label>
        <div class="vue-track-actions">
          <button type="button" class="ghost" @click="likes += 1">+1 like</button>
          <span>{{ likes }}</span>
          <button type="button" class="ghost" @click="$emit('remove', track.id)">Quitar</button>
        </div>
      </article>
    `
    });
    const listsTarget = document.getElementById("vue-lists-demo");
    if (listsTarget) {
        createApp({
            components: {
                TrackRow
            },
            setup() {
                const tracks = ref([
                    { id: 1, title: "Billie Jean", artist: "Michael Jackson" },
                    { id: 2, title: "Smells Like Teen Spirit", artist: "Nirvana" },
                    { id: 3, title: "Get Lucky", artist: "Daft Punk" }
                ]);
                let nextId = 4;
                const pool = [
                    { title: "Like a Prayer", artist: "Madonna" },
                    { title: "Wonderwall", artist: "Oasis" },
                    { title: "Blinding Lights", artist: "The Weeknd" },
                    { title: "Lose Yourself", artist: "Eminem" }
                ];
                const rotate = () => {
                    if (tracks.value.length < 2)
                        return;
                    const [first, ...rest] = tracks.value;
                    tracks.value = [...rest, first];
                };
                const reverse = () => {
                    tracks.value = [...tracks.value].reverse();
                };
                const addTrack = () => {
                    const next = pool[Math.floor(Math.random() * pool.length)];
                    tracks.value = [...tracks.value, { id: nextId, title: next.title, artist: next.artist }];
                    nextId += 1;
                };
                const removeTrack = (id) => {
                    tracks.value = tracks.value.filter(track => track.id !== id);
                };
                return { tracks, rotate, reverse, addTrack, removeTrack };
            },
            template: `
        <div class="vue-demo">
          <div class="vue-demo-row">
            <button type="button" class="ghost" @click="rotate">Mover primero al final</button>
            <button type="button" class="ghost" @click="reverse">Invertir orden</button>
            <button type="button" class="ghost" @click="addTrack">Agregar track</button>
          </div>
          <p class="status-line">
            Reordena la lista: cada fila mantiene su estado local gracias a :key="track.id".
          </p>
          <ul class="vue-list">
            <li v-for="track in tracks" :key="track.id">
              <TrackRow :track="track" @remove="removeTrack" /> // emit remove con el id del track a eliminar
            </li>
          </ul>
        </div>
      `
        }).mount(listsTarget);
    }
    const ScoreControl = defineComponent({
        name: "ScoreControl",
        props: {
            modelValue: {
                type: Number,
                required: true
            }
        },
        emits: ["update:modelValue"],
        setup(props, { emit }) {
            const changeBy = (delta) => {
                const nextScore = Math.max(1, Math.min(5, props.modelValue + delta));
                emit("update:modelValue", nextScore);
            };
            return { changeBy };
        },
        template: `
      <div class="vue-score-control">
        <button type="button" class="ghost" @click="changeBy(-1)">-</button>
        <strong>{{ modelValue }}/5</strong>
        <button type="button" class="ghost" @click="changeBy(1)">+</button>
      </div>
    `
    });
    const componentsTarget = document.getElementById("vue-components-demo");
    if (componentsTarget) {
        createApp({
            components: {
                ScoreControl
            },
            setup() {
                const score = ref(3);
                const history = ref([]);
                watch(score, current => {
                    history.value = [current, ...history.value].slice(0, 5);
                });
                const scoreDescription = computed(() => {
                    if (score.value <= 2)
                        return "Feedback bajo";
                    if (score.value === 3)
                        return "Feedback neutral";
                    return "Feedback positivo";
                });
                return { score, history, scoreDescription };
            },
            template: `
        <div class="vue-demo">
          <p class="status-line">Padre define el estado y el hijo emite cambios.</p>
          <ScoreControl v-model="score" />
          <p class="status-line success">Estado en el padre: {{ scoreDescription }}</p>
          <p class="status-line">Ultimos valores emitidos: {{ history.join(" - ") || "sin cambios" }}</p>
        </div>
      `
        }).mount(componentsTarget);
    }
    const asyncTarget = document.getElementById("vue-async-demo");
    if (asyncTarget) {
        createApp({
            setup() {
                const query = ref("");
                const status = ref("idle");
                const results = ref([]);
                const errorMessage = ref("");
                let requestId = 0;
                const catalog = [
                    "The Weeknd",
                    "Taylor Swift",
                    "Daft Punk",
                    "Arctic Monkeys",
                    "Kendrick Lamar",
                    "Billie Eilish",
                    "Dua Lipa",
                    "Metallica",
                    "Bad Bunny",
                    "Adele",
                    "Bruno Mars"
                ];
                const fakeSearch = async (term) => {
                    await new Promise(resolve => setTimeout(resolve, 650));
                    if (term.toLowerCase().includes("error")) {
                        throw new Error('Busqueda fallida (simulada). Proba con otro termino.');
                    }
                    return catalog.filter(artist => artist.toLowerCase().includes(term.toLowerCase()));
                };
                watch(query, async (nextQuery) => {
                    const normalized = nextQuery.trim();
                    requestId += 1;
                    const currentRequest = requestId;
                    if (!normalized) {
                        status.value = "idle";
                        results.value = [];
                        errorMessage.value = "";
                        return;
                    }
                    status.value = "loading";
                    errorMessage.value = "";
                    try {
                        const found = await fakeSearch(normalized);
                        if (currentRequest !== requestId)
                            return;
                        results.value = found;
                        status.value = "success";
                    }
                    catch (error) {
                        if (currentRequest !== requestId)
                            return;
                        results.value = [];
                        status.value = "error";
                        errorMessage.value =
                            error instanceof Error ? error.message : "Se produjo un error inesperado";
                    }
                });
                return { query, status, results, errorMessage };
            },
            template: `
        <div class="vue-demo">
          <label class="vue-field">
            Buscar artista (escribi "error" para simular una falla)
            <input
              v-model="query"
              type="text"
              placeholder="Ejemplo: daft"
            />
          </label>

          <p v-if="status === 'idle'" class="status-line">Esperando busqueda...</p>
          <p v-else-if="status === 'loading'" class="status-line">Buscando resultados...</p>
          <p v-else-if="status === 'error'" class="status-line error">{{ errorMessage }}</p>
          <template v-else>
            <p class="status-line success">Resultados: {{ results.length }}</p>
            <ul class="vue-list">
              <li v-for="artist in results" :key="artist">{{ artist }}</li>
            </ul>
          </template>
        </div>
      `
        }).mount(asyncTarget);
    }
}
