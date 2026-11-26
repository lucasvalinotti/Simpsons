# CharactersPage

Ruta: `/characters`. Archivos de la vista: `characters-page.ts` y `characters-page.html`.

Al abrirse, carga la página 1 con `CharacterService`. Muestra sus personajes y los totales que devuelve la API. Después precarga las páginas restantes en segundo plano, con hasta tres solicitudes simultáneas. El servicio conserva las páginas en memoria y comparte las peticiones que ya estén en curso.

Sin filtros, el paginador solicita o recupera de caché la página elegida. Los filtros por nombre, estado y género trabajan sobre el catálogo completo: la página espera a que estén todas las respuestas, busca por nombre sin distinguir mayúsculas, compara estado y género, y divide las coincidencias en grupos de 20. Cambiar o limpiar filtros vuelve a la página 1. Los valores de estado y género de la API se convierten a las etiquetas usadas en la interfaz.

La vista distingue carga, preparación de la búsqueda, error y ausencia de resultados. Si falla una página durante la precarga, el botón de reintento solicita solo las páginas faltantes. Cada tarjeta enlaza a `/character/:id` y permite agregar o quitar el personaje mediante `FavoritesService`.
