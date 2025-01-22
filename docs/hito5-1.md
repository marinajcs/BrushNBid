# Hito 5: Despliegue de la aplicación en un PaaS - Elección de la plataforma

En este documento se justifica la elección del PaaS correspondiente al hito 5.

## 1. Criterios de elección del PaaS

Se tomará una decisión en cuanto a la elección del PaaS en base a los siguientes criterios:

1. *Compatibilidad con el toolchain actual*: el PaaS debe ser compatible con las herramientas,
lenguajes de programación, frameworks, sistemas de CI/CD y flujos de trabajo que utilizados.
Además, debe ser compatible con Dockerfile y la base de datos elegida (PostgreSQL).
2. *Costo*: se considerarán solo opciones gratuitas o con un plan de prueba limitado que
no tenga costes.
3. *Estabilidad y rendimiento*: el PaaS debe poder manejar el crecimiento esperado de la
aplicación y tener un alto grado de disponibilidad frente a interrupciones.
4. *Seguridad*: no debería tener serias vulnerabilidades, y se valorarán medidas de seguridad,
como protección contra ataques DDoS, cifrado de datos, controles de acceso y auditorías regulares.

## 2. Opciones consideradas

Al evaluar opciones para un PaaS donde desplegar el proyecto, se han considerado diversas plataformas
que se ajustan a diferentes necesidades técnicas y operativas, todas ellas gratuitas (o semi-gratuitas)
y capaces de detectar ficheros Dockerfile.

### 2.1. Railway

[**Railway**](https://railway.com/) se ha posicionado como una opción intuitiva y fácil de
usar, especialmente si se busca simplicidad en el despliegue. Su modelo "plug-and-play" permite integrar
rápidamente aplicaciones con configuraciones mínimas, lo que resulta atractivo para proyectos en etapas
iniciales o con equipos pequeños. Además, cuenta con una interfaz visual moderna y soporte para
despliegues rápidos, lo que puede reducir bastante los tiempos de configuración.

### 2.2. Render

[**Render**](https://render.com/), por su parte, destaca por su capacidad de escalar
aplicaciones tanto web como de procesamiento en segundo plano. Su enfoque en el equilibrio entre
simplicidad y robustez lo convierte en una opción ideal para proyectos de tamaño medio que requieren
estabilidad y herramientas avanzadas. Ofrece soporte nativo para varios frameworks y bases de datos,
además de un modelo de precios predecible que ayuda a controlar costos.

### 2.3. Fly.io

[**Fly.io**](https://fly.io/) es interesante para aplicaciones que necesitan
estar cerca de los usuarios, ya que permite despliegues en múltiples regiones geográficas con facilidad.
Su arquitectura está diseñada para proporcionar baja latencia y alta disponibilidad, lo que resulta
relevante para aplicaciones con requisitos estrictos de rendimiento. Sin embargo, su curva de aprendizaje
puede ser más pronunciada si se requiere un control granular sobre la infraestructura.

### 2.4. Kobe

Por último, [**Kobe**](https://kobeai.tech/), aunque menos conocido, se orienta hacia proyectos
que buscan personalización avanzada y control sobre las configuraciones del entorno de ejecución. Es una
solución adecuada para desarrolladores que prefieren un enfoque más artesanal, pero puede no ser tan
eficiente para equipos que priorizan la automatización y la facilidad de uso sobre la flexibilidad total.

## 3. Elección final: Render

Finalmente se optó por **Render** como plataforma PaaS debido a las siguientes justificaciones:

1. *Compatibilidad con el toolchain actual*: Render es altamente compatible el toolchain gracias a
su soporte nativo para Docker. Esto permite desplegar aplicaciones directamente desde un archivo
Dockerfile, lo que asegura que la infraestructura puede ser adaptada a las herramientas actuales.
Además, Render ofrece soporte nativo para PostgreSQL, proporcionando una solución sencilla y eficiente
para bases de datos. También se integra fácilmente con sistemas de CI/CD como GitHub Actions, lo que
garantiza flujos de trabajo ágiles y sin interrupciones.
2. *Costo*: ofrece un plan gratuito adecuado para proyectos pequeños o en etapas iniciales. Este
plan incluye recursos suficientes para alojar aplicaciones web, APIs, y bases de datos básicas,
eliminando la necesidad de incurrir en costos durante las primeras fases del proyecto.
3. *Estabilidad y rendimiento*: este PaaS garantiza un alto grado de disponibilidad con su infraestructura
basada en contenedores. Ofrece escalado automático tanto horizontal como vertical, asegurando que la
plataforma pueda manejar el crecimiento esperado de la aplicación. Su tiempo de actividad es competitivo
y las capacidades de rendimiento están diseñadas para mitigar las interrupciones, proporcionando un entorno
confiable para aplicaciones en producción.
4. *Seguridad*:  implementa medidas de seguridad sólidas, incluyendo cifrado de datos en tránsito y en reposo,
protección contra ataques DDoS, y controles de acceso granulares para recursos y servicios. También ofrece
entornos privados de red (Private Services) para mejorar la seguridad en configuraciones más avanzadas.
Aunque es una solución relativamente nueva en comparación con gigantes como AWS o GCP, no tiene historial
de vulnerabilidades graves y cuenta con revisiones de seguridad regulares.

En conclusión, se ha elgido Render debido a que se trata de una opción sólida para el despliegue del proyecto
por su compatibilidad con las herramientas actuales, su plan gratuito, su capacidad de escalar y sus medidas
de seguridad robustas.
