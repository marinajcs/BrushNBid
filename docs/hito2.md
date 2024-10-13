# Hito 2: Integración continua

En este hito se va a proceder a la elección, justificación y uso de: el gestor de
tareas, la biblioteca de aserciones, el framework para testing y la herramienta
de integración continua.

## Elección del gestor de dependencias

La elección del gestor de dependencias es vital porque impacta en la eficiencia,
consistencia y control del desarrollo.

### Criterios de selección para el gestor de dependencias

Se han tenido en cuenta los siguientes criterios a la hora de elegir un gestor:

1. *Estándares y conformidad*: asegura la adhesión a estándares y convenciones de la industria para
una integración y desarrollo coherente
2. *Recomendaciones y comunidad*: una comunidad activa respalda la fiabilidad y evolución del gestor.
Las recomendaciones proporcionan información valiosa sobre casos de uso y soluciones.
3. *Mejores prácticas*: facilita la gestión eficiente de versiones, resolución de conflictos y prácticas
ordenadas de manejo de dependencias.

### Gestores de dependencias considerados

Dado que se ha elegido Node.js como runtime, se han considerado los siguientes gestores:

#### bun

* *Descripción*: Bun es un entorno de ejecución relativamente
nuevo para JavaScript, pero también un empaquetador y gestor de paquetes.
Es compatible si se ha elegido Node.js como runtime.
* *Características*: utiliza enlaces simbólicos, un archivo de bloqueo
binario y su gestor de paquetes está escrito en Zig. Todo esto contribuye
a que sea más rápido.

#### npm

* *Descripción*: NPM es el gestor de paquetes oficial para Node.js y
JavaScript. Se utiliza para instalar, compartir y gestionar
dependencias en proyectos JavaScript.
* *Características*: repositorio de paquetes enorme, gestión de
versiones, scripts npm para automatización, instalación de
dependencias.

#### yarn

* *Descripción*: Yarn es otro gestor de paquetes para JavaScript,
creado por Facebook. Se diseñó para mejorar la velocidad, la
consistencia y la seguridad en comparación con NPM.
* *Características*: instalación paralela, bloqueo de versiones,
mejora de la velocidad de instalación, instalación offline.

#### pnpm

* *Descripción*: PNPM es un gestor de paquetes para JavaScript similar
a NPM, pero con un enfoque en la eficiencia al compartir dependencias
entre proyectos.
* *Características*: almacenamiento compartido de dependencias,
instalación rápida, espacio en disco eficiente, soporte para múltiples
proyectos en un único espacio de almacenamiento.

### Elección final de gestor de dependencias

Al final, se ha optado por **npm** debido a los siguientes factores:

1. *Estándares y conformidad*: npm cumple con las especificaciones y estándares de
CommonJS y Node.js (el runtime escogido), lo que lo hace compatible con proyectos
y bibliotecas comunes en el ecosistema de JavaScript y TypeScript (el lenguaje
del proyecto).

2. *Recomendaciones y comunidad*: npm tiene una comunidad grande y activa, y está
respaldado por desarrolladores que valoran la eficiencia en la instalación de paquetes.

3. *Mejores prácticas*: npm permite implementar muchas de las mejores prácticas, como la
definición de dependencias en el archivo package.json, la gestión de dependencias de desarrollo,
la instalación de versiones específicas de paquetes y la actualización segura de dependencias.

## Elección del gestor de tareas

La elección de un gestor de tareas en un proyecto es crucial para automatizar
tareas repetitivas, procesos como la compilación y las pruebas, y asegurar
un flujo de trabajo eficiente durante el desarrollo.

### Criterios de selección para el gestor de tareas

1. *Estándares y conformidad*: que siga estándares para garantizar la coherencia en el
desarrollo y la integración con otras herramientas.
2. *Recomendaciones y comunidad*: una comunidad activa respalda la fiabilidad y evolución
del gestor. Las recomendaciones ofrecen información sobre casos de uso y buenas prácticas.
3. *Mejores prácticas*: facilita la automatización de tareas, ejecución de pruebas y
otras prácticas de desarrollo eficientes.

### Gestores de tareas considerados

#### make

* *Descripción*: Make es una herramienta de construcción que automatiza la compilación y ejecución de programas. Utiliza un archivo llamado Makefile para definir reglas y dependencias.
* *Características*: sistema de construcción de propósito general, define reglas en un Makefile, manejo de dependencias.

#### npm run

* *Descripción*: gestor de paquetes predeterminado para Node.js.
* *Características*: ejecuta scripts definidos en el archivo package.json y mantiene un registro centralizado de dependencias.

#### pnpm run

* *Descripción*: Administrador de paquetes para Node.js con almacenamiento compartido.
* *Características*: comparte dependencias para conservar espacio, instalación rápida y eficiente y ejecuta scripts del archivo package.json.

#### yarn run

* *Descripción*: Alternativa a npm, también es un administrador de paquetes para Node.js.
* *Características*: instalación rápida y consistente, ejecuta scripts del archivo package.json.

### Elección final de gestor de tareas

La opción que mejor se adapta a las herramientas elegidas hasta ahora sería  **npm run**, además de ser una opción
razonable tener por los siguientes motivos:

1. *Estándares y conformidad*: npm run es parte del ecosistema de herramientas de Node.js. Sigue los estándares
comunes en el desarrollo basado en Node.js, lo que garantiza coherencia en el desarrollo y la integración con
otras herramientas del ecosistema.
2. *Recomendaciones y comunidad*: aunque puede ser visto más como un gestor de paquetes que uno de tareas, sigue siendo
una parte integral del ecosistema Node.js. Tiene una comunidad activa que respalda su desarrollo y evolución, y puede
beneficiarse de las experiencias y recomendaciones compartidas por la comunidad de Node.js.
3. *Mejores prácticas*: se integra con el sistema de scripts npm, permitiendo la ejecución de tareas personalizadas.
Es decir, se pueden definir y ejecutar scripts en el propio archivo package.json.

## Elección de la biblioteca de aserciones

## Elección del framework para testing

## Elección de la herramienta para integración continua
