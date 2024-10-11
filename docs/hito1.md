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

Además, se ha optado por usar [Vue.js](https://vuejs.org/), un framework progresivo de JavaScript de código abierto para
crear interfaces de usuario y aplicaciones de una sola página.
