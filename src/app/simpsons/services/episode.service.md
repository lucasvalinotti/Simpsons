# EpisodeService

Archivo: `episode.service.ts`. Servicio global que usa `HttpClient` y `environment.baseUrl`.

## Métodos

- `getEpisodes(page)`: hace `GET /episodes?page={page}` y devuelve `Observable<EpisodeResponse>`. La respuesta contiene `count`, `pages` y `results` para mostrar y paginar episodios.
- `getEpisodeById(id)`: hace `GET /episodes/{id}` y devuelve `Observable<EpisodeDetail>` para la ficha de un episodio.

El servicio no guarda respuestas ni transforma datos. Cada suscripción inicia una solicitud HTTP y el componente que lo llama decide cómo mostrar carga, errores y reintentos.
