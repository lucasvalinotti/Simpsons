# FavoritesService

Archivo: `favorites.service.ts`. Servicio global que mantiene los personajes favoritos en la señal pública `favorites` y los persiste en `localStorage` bajo la clave `favorites_charactes`.

## Inicio y persistencia

Al construirse, lee el valor guardado. Acepta un arreglo JSON cuyos elementos tengan `id` numérico y `name` de texto; si el valor está corrupto o no cumple esa estructura, lo elimina y comienza con una lista vacía. Las operaciones de cambio actualizan primero la señal y luego guardan el arreglo completo. Si el navegador impide escribir en `localStorage`, el estado sigue disponible en memoria durante esa sesión.

## Métodos

- `toggleFavorites(character)`: agrega el personaje si su `id` no está presente; si ya existe, lo quita. Después guarda la lista.
- `isFavorite(id)`: indica si el `id` está en la señal.
- `updateGender(id, gender)`: completa o actualiza el género de un favorito y lo persiste. Ignora valores vacíos, personajes ausentes y géneros iguales al actual.

La página de favoritos usa `updateGender` para completar registros antiguos antes de aplicar el filtro por género. La validación de lectura comprueba `id` y `name`; los demás campos no se validan individualmente.
