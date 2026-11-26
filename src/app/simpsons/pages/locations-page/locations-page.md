# LocationsPage

Ruta: `/locations`. Archivos de la vista: `locations-page.ts` y `locations-page.html`.

Al iniciarse solicita la página 1 mediante `LocationService.getLocations`. Guarda en señales las ubicaciones, el total (`count`), el número de páginas (`pages`) y los estados de carga y error. El paginador solicita la página elegida; los números «Mostrando X–Y» se calculan con 20 elementos por página y el total informado por la API.

Antes de cada nueva solicitud cancela la anterior, vacía la lista y activa el indicador de carga. También cancela la suscripción al destruir el componente. Ante un error muestra un botón para reintentar la página actual. Si una respuesta no contiene ubicaciones, ofrece volver a la primera página.

Cada `LocationCard` muestra nombre, uso, pueblo e imagen cuando están disponibles, y enlaza a `/location/:id`.
