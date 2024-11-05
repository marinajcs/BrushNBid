# Hito 1: Repositorio de prácticas y definición del proyecto

## Configuración del entorno

Previamente se ha generado un par de claves (pública y privada) y se ha configurado correctamente
en los ajustes del perfil de GitHub para que se pueda clonar el repositorio con SSH de forma segura.

Capturas de la configuración:

- [Par de claves generadas](../imgs/keypair.JPG)
- [Clave SSH configurada](../imgs/ssh-key.png)
- [Configuración del entorno](../imgs/git-conf.png)

## Problema planteado

Muchos artistas noveles tienen dificultades a la hora de comercializar y poner a la venta sus obras debido
a la falta de visibilidad, redes de contactos limitadas y recursos insuficientes para promocionarse en el
competitivo mercado artístico. Esta situación no solo restringe su capacidad para obtener ingresos sostenibles,
sino que también limita su oportunidad de desarrollar y consolidar sus carreras creativas.

## Solución propuesta

La idea sería diseñar, desarrollar y desplegar una aplicación en la nube que permita a artistas noveles darse a
a conocer mediante la publicación de sus obras, poniéndolas a la venta para que los usuarios registrados
(y verificados) puedan pujar por ellas.

El sistema de subastas estará basado en el modelo inglés tradicional, ampliamente extendido, que sigue un esquema
de puja ascendente en el que las personas usuarias realizan ofertas sucesivas, aumentando el precio gradualmente
hasta que no haya más interesados. Se adoptan los siguientes términos:

- **Lotes**: en este caso son las obras puestas a la venta (cuadros, esculturas, etc) por sus autores.
- **Puja mínima**: parámetro opcional que establece el precio mínimo inicial para pujar por un lote.
- **Incremento**: define el monto mínimo por el cual se puede aumentar cada nueva puja.
- **Precio de reserva**: el precio mínimo acordado por el vendedor, por el que se reserva el derecho a no adjudicarlo en
caso de que no se alcance dicho valor.
- **Precio de martillo** (_Hammer price_): el precio final al que se adjudica el lote.
- **Comisión**: el porcentaje que la casa de subastas cobra sobre el precio de venta.
- **Compra directa** (_Buyout_): opcional, permite al comprador adquirir el lote inmediatamente por un precio fijo.

## Herramientas de desarrollo

Se va a utilizar el lenguaje de programación de [TypeScript](https://www.typescriptlang.org/), popular debido a su
escalabilidad, seguridad y amplia documentación. Además, permite definir estructuras de datos y es fuertemente tipado,
lo que facilitará el manejo de excepciones.

Además, se ha optado por usar [Webpack](https://webpack.js.org/), una herramienta de empaquetado que ayuda a
automatizar, optimizar y empaquetar el código en TypeScript, haciéndolo más eficiente para el navegador.

El sistema de base de datos elegido es [PostgreSQL](https://www.postgresql.org/), que sigue el modelo relacional para almacenar y gestionar
datos estructurados de forma eficiente.

También se usará el framework [Express](https://expressjs.com/es/) de Node.js para la construcción de servidores y APIs de manera rápida y
estructurada, junto con el mecanismo de seguridad [CORS](https://www.npmjs.com/package/cors) para gestionar el acceso a la API entre dominios distintos.
Para el testeo de APIs, se hará uso de [Postman](https://www.postman.com/), que permite realizar solicitudes HTTP a los endpoints configurados,
y verificar las respuestas que recibe la API.
