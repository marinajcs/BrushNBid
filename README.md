# BrushNBid

Repositorio del proyecto de prácticas de la asignatura de Cloud Computing (CC) en el Máster
Universitario en Ingeniería Informática de la Universidad de Granada (UGR), curso 24-25.

## Hito 1: Repositorio de pácticas y definición del proyecto

En el primer hito se ha configurado el entorno, creado el repositorio y definido la idea de la
aplicación, partiendo de un problema que podría abordarse con una solución desplegada en
la nube. Enlace al documento: [hito 1](docs/hito1.md).

## Hito 2: Integración continua

En el segundo hito se va a proceder a la elección, justificación y uso de las siguientes
herramientas: el gestor de dependencias y de tareas, la biblioteca de aserciones, el framework
para testing y el mecanismo de integración continua. Enlace al documento: [hito 2-1](docs/hito2-1.md).

Más información acerca de los test, incluidas capturas, en el siguiente documento: [hito 2-2](docs/hito2-2.md).

## Hito 3: Diseño de microservicios

En el tercer hito se va a implementar la API, hacer tests para la integración continua de la misma
e incluir los logs para el registro de acciones en la API en un fichero. Enlace al documento con la
justificación de herramientas: [hito 3-1](docs/hito3-1.md).

Más información acerca de los test, incluidas capturas, en el siguiente documento: [hito 3-2](docs/hito3-2.md).

## Hito 4: Composición de servicios

En el cuarto hito se ha realizado la composición de servicios a través de un archivo `compose.yaml`,
que permite desplegar un clúster de contenedores mediante la conexión de puertos, uso de redes y
volúmenes de datos. Para los servicios, se han utilizado imágenes base de Docker para la base de datos
y el monitoreo de logs, y se ha creado una propia a partir de un Dockerfile (que más tarde ha sido
publicado en Docker Hub) para la aplicación. La justificación de las imágenes y explicación de la estructura
del clúster vienen descritas en el documento: [hito 4-1](./docs/hito4-1.md).

Además, se han implementado tests de integración continua tanto para las pruebas de la API como para la
publicación y actualización automática de la imagen docker publicada. Finalmente, se ha incluido un test
para la construcción del clúster y la ejecución de algunas solicitudes a la API (ya conectada con la base
de datos). Se pueden consultar las capturas de tests, CI y visualización de logs en el fichero: [hito 4-2](./docs/hito4-2.md).
