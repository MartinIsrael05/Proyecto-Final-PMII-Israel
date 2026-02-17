# Proyecto Final PMII - SoundLab

Este proyecto fue desarrollado con HTML, CSS y TypeScript.

Para ejecutarlo correctamente y ver todos los albumes, usa una de estas opciones.

## Opcion 1: Live Server desde VS Code

1. Abrir la carpeta del proyecto en Visual Studio Code.
2. Abrir `index.html`.
3. Ejecutar **Open with Live Server**.

## Opcion 2: Terminal con npm

1. Instalar dependencias (solo la primera vez):

```bash
npm install
```

2. Compilar TypeScript:

```bash
npm run build
```

3. Levantar el servidor:

```bash
npm run start
```

## Nota sobre albumes y localStorage

El proyecto guarda cambios en `localStorage`.  
Si no ves todos los albumes nuevos, borra la clave `soundlab_albums` desde DevTools y recarga la pagina.
