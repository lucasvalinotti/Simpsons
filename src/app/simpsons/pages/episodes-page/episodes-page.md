# EpisodesPage

Ruta: `/episodes`. Archivos de la vista: `episodes-page.ts` y `episodes-page.html`.

Al iniciarse solicita la página 1 mediante `EpisodeService.getEpisodes`. Guarda en señales los episodios, el total (`count`), el número de páginas (`pages`) y los estados de carga y error. El paginador solicita la página elegida; los números «Mostrando X–Y» se calculan con 20 elementos por página y el total informado por la API.

Antes de cada nueva solicitud cancela la anterior, vacía la lista y activa el indicador de carga. También cancela la suscripción al destruir el componente. Ante un error muestra un botón para reintentar la página actual. Si una respuesta no contiene episodios, ofrece volver a la primera página.

Cada `EpisodeCard` muestra temporada, número, nombre, fecha de estreno y sinopsis disponible, y enlaza a `/episode/:id`.
