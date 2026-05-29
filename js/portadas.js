'use strict';

/**
 * portadas.js
 * Obtiene portadas de libros desde Open Library API.
 * Cachea los resultados en memoria para no repetir llamadas.
 *
 * URL base: https://covers.openlibrary.org/b/title/{titulo}-M.jpg
 * Si no encuentra portada por título, usa búsqueda por autor+título.
 */

const _cache = {};

/**
 * Devuelve la URL de la portada de un libro.
 * Primero intenta por título, si falla por título+autor.
 * @param {string} titulo
 * @param {string} autor
 * @returns {Promise<string>} URL de la imagen
 */
async function getPortada(titulo, autor = '') {
    const cacheKey = titulo + autor;
    if (_cache[cacheKey]) return _cache[cacheKey];

    // Open Library Covers API — busca por título
    // Devuelve la imagen directamente; si el libro no existe devuelve una imagen de 1px
    // Por eso usamos la Search API para obtener el olid (Open Library ID) primero

    try {
        const query    = encodeURIComponent(`${titulo} ${autor}`.trim());
        const apiUrl   = `https://openlibrary.org/search.json?q=${query}&limit=1&fields=cover_i,title`;
        const res      = await fetch(apiUrl);
        const data     = await res.json();

        const coverId  = data?.docs?.[0]?.cover_i;

        let url;
        if (coverId) {
            // Tamaño M = ~180px ancho, L = mayor
            url = `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
        } else {
            url = getPortadaFallback();
        }

        _cache[cacheKey] = url;
        return url;

    } catch {
        const url = getPortadaFallback();
        _cache[cacheKey] = url;
        return url;
    }
}

/**
 * Imagen de portada genérica cuando no hay resultado
 */
function getPortadaFallback() {
    return 'data:image/svg+xml,' + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="280" viewBox="0 0 200 280">
            <rect width="200" height="280" fill="#482C2C" rx="8"/>
            <rect x="15" y="15" width="170" height="250" fill="none" stroke="#F0EBE1" stroke-width="1.5" rx="5" opacity="0.4"/>
            <text x="100" y="130" font-family="Georgia,serif" font-size="48" fill="#F0EBE1" text-anchor="middle" opacity="0.6">📚</text>
            <text x="100" y="175" font-family="Georgia,serif" font-size="13" fill="#F0EBE1" text-anchor="middle" opacity="0.5">Sin portada</text>
        </svg>
    `);
}

/**
 * Aplica la portada a un elemento <img> de forma asíncrona.
 * Muestra un placeholder mientras carga.
 * @param {HTMLImageElement} imgEl
 * @param {string} titulo
 * @param {string} autor
 */
async function aplicarPortada(imgEl, titulo, autor = '') {
    // Placeholder SVG mientras carga
    imgEl.src = getPortadaFallback();
    imgEl.style.opacity = '0.5';
    imgEl.style.transition = 'opacity 0.4s ease';

    const url = await getPortada(titulo, autor);
    imgEl.src = url;
    imgEl.onload  = () => { imgEl.style.opacity = '1'; };
    imgEl.onerror = () => { imgEl.src = getPortadaFallback(); imgEl.style.opacity = '1'; };
}
