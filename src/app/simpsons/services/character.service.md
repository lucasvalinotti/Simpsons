# CharacterService

Archivo: `character.service.ts`. Se inyecta como servicio global (`providedIn: 'root'`) y usa `HttpClient` con la URL base definida en `environment.baseUrl`.

## Métodos

- `getCharacters(page)`: solicita `GET /characters?page={page}` y devuelve un `Observable<CharacterResponse>` con el total de personajes, las páginas y los resultados.
- `getCachedPage(page)`: devuelve una página ya recibida, si existe.
- `getCachedCatalog(totalPages)`: devuelve las páginas de la 1 a `totalPages` en orden. Devuelve `null` si falta alguna.
- `getCharacterById(id)`: solicita `GET /characters/{id}` y devuelve `Observable<CharacterByID>`.

## Caché y solicitudes simultáneas

Las respuestas paginadas se guardan en un `Map` en memoria. Si una página ya está guardada, `getCharacters` la entrega con `of()` sin llamar otra vez a la API. Si la misma página se está descargando, las llamadas comparten el observable mediante `shareReplay(1)`. Al terminar la petición se elimina su entrada de solicitudes en curso; una petición fallida puede reintentarse y no borra las páginas que sí se descargaron.

La consulta por ID no usa esta caché. Todo el estado en memoria se pierde al recargar la aplicación. Las páginas consumidoras manejan los errores de HTTP.
