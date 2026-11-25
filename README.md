# SimpsonsPrueba

## Pantalla de personajes

Al abrir la pantalla se solicita la página 1 y se muestra apenas llega. Su respuesta indica el número total de páginas y de personajes. Luego se precargan las páginas restantes en segundo plano, con hasta tres solicitudes de precarga simultáneas. La navegación sigue disponible durante ese proceso.

`CharacterService` guarda cada página recibida en una caché en memoria, identificada por su número. La navegación consulta esa caché y comparte las peticiones que ya estén en curso con la precarga. Si una página falla, el reintento solicita solo las páginas que faltan y conserva las respuestas exitosas. El catálogo se considera completo únicamente cuando están todas las páginas.

Sin filtros, la pantalla muestra directamente los resultados de la página elegida y usa el total de páginas informado por la API. Con filtros por nombre, estado o género, busca sobre el catálogo completo y calcula las páginas a partir de las coincidencias, con 20 personajes por página. Cambiar de página con filtros se resuelve en memoria. Al cambiar o limpiar filtros, vuelve a la página 1; al limpiarlos, recupera la primera página de la caché cuando está disponible.

Si se filtra antes de terminar la descarga, aparece «Preparando búsqueda…». Si falla una página, aparece un error con opción de reintento; «Sin resultados» se muestra solo cuando la búsqueda completa no encuentra coincidencias. La búsqueda global requiere descargar todo el catálogo porque la API solo ofrece páginas y consultas por ID, sin filtros de búsqueda. La caché se reinicia al recargar la aplicación.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.1.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
