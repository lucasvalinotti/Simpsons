# FavoritesPage

Ruta: `/favorites`. Archivos de la vista: `favorites-page.ts` y `favorites-page.html`.

La lista proviene de la señal `FavoritesService.favorites`, persistida en `localStorage`. La vista filtra por nombre, estado y género, muestra 20 personajes por página y calcula los totales a partir de las coincidencias. Al cambiar filtros vuelve a la primera página; al quitar un favorito ajusta la página actual si quedó fuera del rango.

Si se selecciona un género y algún favorito guardado no lo tiene, la vista consulta esos personajes por ID mediante `CharacterService`, con hasta tres peticiones simultáneas. Guarda cada género recuperado con `FavoritesService.updateGender`. Mientras faltan datos muestra «Preparando filtro de género…»; si una consulta falla, ofrece reintentar. Los estados y géneros en inglés de registros guardados se convierten para compararlos con los filtros en español.

Cuando no hay favoritos se muestra un estado vacío distinto del caso en que sí hay favoritos, pero ninguno coincide con los filtros. Las tarjetas permiten quitar favoritos y abrir `/character/:id`.
