# LocationService

Archivo: `location.service.ts`. Servicio global que usa `HttpClient` y `environment.baseUrl`.

## Métodos

- `getLocations(page)`: hace `GET /locations?page={page}` y devuelve `Observable<LocationResponse>` con `count`, `pages` y las ubicaciones de esa página.
- `getLocationById(id)`: hace `GET /locations/{id}` y devuelve `Observable<LocationDetail>` para la ficha de una ubicación.

No incluye caché ni transformación de resultados. Cada suscripción hace la solicitud HTTP; las páginas manejan carga, errores, reintentos y navegación.
