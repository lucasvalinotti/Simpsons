# SimpsonsPrueba

## Ejecutar en desarrollo

Necesitás Node.js 24.x, npm y Git.

~~~bash
git clone https://github.com/lucasvalinotti/Simpsons.git
cd Simpsons
npm ci
npm start
~~~

Abrí http://localhost:4200. Para detener el servidor, presioná Ctrl + C.

## Desiciones técnicas

### Pantalla de personajes
Problema: ¿Qué pasa si el usuario busca un personaje que no está en la página actual?

Solución:
Al abrir la pantalla se solicita la página 1 y se muestra apenas llega. Su respuesta indica el número total de páginas y de personajes. Luego se precargan las páginas restantes en segundo plano, con hasta tres solicitudes de precarga simultáneas. La navegación sigue disponible durante ese proceso.

`CharacterService` guarda cada página recibida en una caché en memoria, identificada por su número. La navegación consulta esa caché y comparte las peticiones que ya estén en curso con la precarga. Si una página falla, el reintento solicita solo las páginas que faltan y conserva las respuestas exitosas. El catálogo se considera completo únicamente cuando están todas las páginas.

Sin filtros, la pantalla muestra directamente los resultados de la página elegida y usa el total de páginas informado por la API. Con filtros por nombre, estado o género, busca sobre el catálogo completo y calcula las páginas a partir de las coincidencias, con 20 personajes por página. Cambiar de página con filtros se resuelve en memoria. Al cambiar o limpiar filtros, vuelve a la página 1; al limpiarlos, recupera la primera página de la caché cuando está disponible.

Si se filtra antes de terminar la descarga, aparece «Preparando búsqueda…». Si falla una página, aparece un error con opción de reintento; «Sin resultados» se muestra solo cuando la búsqueda completa no encuentra coincidencias. La búsqueda global requiere descargar todo el catálogo porque la API solo ofrece páginas y consultas por ID, sin filtros de búsqueda. La caché se reinicia al recargar la aplicación.


### Filtros
Problema: ¿Cómo evitar búsquedas innecesarias?

Solución:
Se agregó un **debounce time** de `300ms` al panel de filtros. Si bien no se hace una petición al backend con el término de búsqueda (por limitaciones del propio backend), el debounce también evita búsquedas innecesarias en caché.


### Favoritos
Problema 1: ¿Cómo hacer persistente la selección de favoritos del usuario?

Solución: Se implementó un servicio de guardado en el **localStorage** del navegador. A diferencia de otros almacenamientos como el sessionStorage, aquí se guarda incluso si el usuario reinicia la computadora.

Posible mejora: Conectar mediante un backend un motor de base de datos en el que guardar los favoritos de los usuarios para que los mismos sean accesibles en todos los usuarios donde el usuario inicie sesión (suponiendo que se implementó la funcionalidad de inicio de sesión).

Problema 2: ¿Almaceno todos los datos?

Solución: Se decidió guardar solamente id y los datos necesarios para mostrar en las tarjetas a fin de no ocupar espacio innecesario en el almacenamiento del navegador.


### Episodios y ubicaciones
Problema: ¿Es necesario crear un caché de episodios y ubicaciones?

Solución: A diferencia de los personajes que se pueden buscar y filtrar, ubicaciones y episodios no tienen esa funcionalidad, por ende se optó por realizar la carga de los mismos bajo demanda del usuario.

### Manejo de Soluciones Inesperadas
Problema 1: Demora en las respuestas de la API

Solución: Implementación de mensajes de carga y sekeletons para indicar la carga de componentes de la app. (Se adjuntan imagenes - Ver carpeta referencias 1.png)

Problema 2: Búsqueda sin resultados, error de API, personaje no existente.

Solución: Diseño de mensajes que notifican al cliente en caso de error o pero¿sonajes no encontrados. (Se adjuntan imagenes - Ver carpeta referencias 2.1, 2.2, 2.3.png)

Problema 3: Algún dato no disponible.

Solución:
- Imagen no disponible: Se coloca en lugar de la imagen el mensaje "Imagen no disponible" (Se adjuntan imagenes - Ver carpeta referencias 3.1.png)
- Datos: Mediante switches de JS y operadores ternarios se coloca un texto adecuado a cada dato faltante. (Se adjuntan imagenes - Ver carpeta referencias 3.2.png)






