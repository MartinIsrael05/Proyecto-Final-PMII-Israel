# Proyecto Final PMII - SoundLab

Sitio web de 3 paginas para **Programacion Multimedial II**:

- `index.html`: galeria de albums con carga asincronica desde JSON.
- `admin.html`: ABM de albums y usuarios con login admin.
- `research.html`: pagina interactiva del tema de investigacion (**Vue.js**).

## Stack

- HTML5
- CSS3
- TypeScript (compilado con `tsc`)
- Vue 3 (solo en `research.html`, cargado por `importmap` CDN)
- LocalStorage para persistencia en el front

## Requisitos

- Node.js 18+ (recomendado)
- npm

## Instalacion

```bash
npm install
```

## Scripts

- `npm run build`: compila `src/` a `dist/`
- `npm run start`: levanta `live-server` abriendo `index.html`

## Ejecucion

Opcion A (recomendada):

```bash
npm run build
npm run start
```

Opcion B:

- Abrir `index.html` con Live Server desde VS Code.
- Si hay cambios en TypeScript, correr antes `npm run build`.

## Credenciales Admin Demo

- Email: `admin@soundlab.com`
- Password: `admin123`

Usuario no admin de prueba:

- Email: `user@soundlab.com`
- Password: `user123`

## Persistencia y reset de datos

El proyecto persiste en `localStorage`:

- `soundlab_albums`
- `soundlab_users`

Formas de reset:

- Desde Admin: boton **Reset demo** (restaura desde `public/data/*.json`).
- Desde DevTools: borrar esas claves en `Application > Local Storage`.

## Portadas de albums

- Las imagenes viven en `public/images/covers/`.
- En el form de Admin, el campo portada acepta **solo nombre de archivo** (ej: `thriller.jpg`).
- El sistema arma la ruta completa automaticamente como `public/images/covers/<archivo>`.

## Estructura principal

- `src/models/`: clases `Album` y `User`.
- `src/services/data-service.ts`: carga asincronica JSON + persistencia local.
- `src/pages/home.ts`: render de galeria, filtros, orden y likes.
- `src/pages/admin.ts`: login admin, CRUD de albums/usuarios, validaciones, bitacora de acciones.
- `src/pages/research.ts`: demos Vue (reactividad, condicionales, listas con key, props/emit, watch async).
- `styles/main.css`: estilos globales y responsive.

## Notas para entrega

- Si subis cambios de TypeScript, subi tambien `dist/` actualizado.
- Si no se reflejan cambios de albums/usuarios, probablemente hay datos previos en localStorage.
- La seccion de Vue en `research.html` requiere conexion a internet para cargar Vue desde CDN.
