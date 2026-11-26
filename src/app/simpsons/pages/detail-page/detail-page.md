# DetailPage: detalle de personaje

Ruta: `/character/:id`. Archivos de la vista: `detail-page.ts` y `detail-page.html`. Esta documentación corresponde solo al detalle de personaje.

La página toma el `id` de la ruta y, al iniciarse, solicita `CharacterService.getCharacterById(id)`. Si falta el ID o la API responde 404, muestra «personaje no encontrado». Para otros errores muestra una opción de reintento que vuelve a ejecutar la consulta. Mientras espera la respuesta muestra un esqueleto de carga.

Con una respuesta válida presenta nombre, estado, edad, género, ocupación y frases. Construye la URL del retrato con el tamaño `1280` del CDN; si no hay ruta de imagen o esta falla, muestra «Imagen no disponible». El botón de corazón consulta `FavoritesService.isFavorite` y agrega o quita el personaje con `toggleFavorites`. El enlace de regreso lleva a `/characters`.
