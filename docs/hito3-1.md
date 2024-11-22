# Hito 3: Diseño de microservicios - Justificación de herramientas

En este documento se justifica la elección de las herramientas para la realización del hito 3.

## 1. Herramientas para el desarrollo de la API

Se ha elegido [**Express**](https://expressjs.com/) para implementar la API debido a su simplicidad, flexibilidad y extensibilidad.
Express, como framework minimalista de Node.js, permite estructurar la API de manera modular utilizando
controladores y rutas, lo que facilita la organización del código. Los controladores encapsulan la lógica
de negocio y las rutas gestionan las solicitudes HTTP, promoviendo la separación de responsabilidades y un
código más limpio y mantenible. Además, su vasta comunidad y soporte lo convierten en una opción ideal para
construir APIs robustas y escalables.

Para probar y validar los endpoints, se ha utilizado [**Postman**](https://www.postman.com/), una herramienta ampliamente adoptada para
desarrollo y pruebas de APIs. Postman permite realizar solicitudes HTTP de manera sencilla, verificar respuestas
y simular distintos escenarios, como errores o datos específicos, asegurando que cada endpoint funcione
correctamente antes de la integración o despliegue.

## 2. Elección de herramientas de test para la API

Se han tenido en cuenta los siguientes criterios para la elección de herramientas de testeo:

1. *Estándares y conformidad*: que cumpla los estándares relevantes de la industria de desarrollo de software,
que sea compatible con el lenguaje (TypeScript) y el runtime (Node.js) elegidos.
2. *Comunidad y mantenimiento*: según Snyk Advisor, se considerá a una comunidad grande y activa aquella con una
alta cantidad de contribuidores y un elevado índice de uso entre los usuarios. Tendrá buen mantenimiento o no en
base a a la frecuencia de actualizaciones y últimas versiones de la herramienta a evaluar.
3. *Mejores prácticas*: que las herramientas sigan buenas prácticas de software como la capacidad de mantener
casos de prueba de forma eficiente, la ejecución paralela y la creación de informes concisos.

### 2.1. Biblioteca de aserciones

La elección final entre las aserciones consideradas en el [hito2-1](./hito2-1.md) ha sido las de [**Chai**](https://chaijs.com/), con una
sorprendente puntuación de 97/100 según [Snyk Advisor](https://snyk.io/advisor/npm-package/chai), debido a los siguientes factores:

1. *Estándares y conformidad*: Chai se destaca por sus aserciones expresivas y legibles, facilitando la
comprensión de las pruebas. Permite adoptar varios estilos de aserciones, entre ellos el que interesa, BDD,
con funciones como `describe`, `it`, `expect`...
2. *Comunidad y mantenimiento*: Chai es muy adoptado en la comunidad, con una media de 15.629.515 descargas
semanales, localizándose en el top 5% más utilizado y con alrededor de 160 contribuidores. Además, es actualizado
con gran frecuencia, su última versión y último commit, hace un mes (octubre 2024).
3. *Mejores prácticas*: Chai se integra bien con otras herramientas y marcos comunes. Permite agregar aserciones
personalizadas, lo que fomenta la adaptación a casos de uso específicos y la creación de pruebas más específicas
y significativas. Chai tiene tipos de TypeScript oficialmente mantenidos (@types/chai), lo que facilita la
integración y proporciona una experiencia de desarrollo más sólida.

No solo se ha optado por usar Chai por los motivos descritos previamente, sino también porque así se puede
utilizar una herramienta que ya está instalada en el entorno de desarrollo, ya que fue empleada en el hito anterior.

### 2.2. Biblioteca para mocks

Se ha optado por usar también [**Sinon**](https://sinonjs.org/) debido a los siguientes factores:

1. *Estándares y conformidad*: Sinon es compatible con TypeScript y Node.js, alineándose con los estándares de la
industria. Proporciona herramientas robustas para pruebas unitarias y simulación de APIs externas.
2. *Comunidad y mantenimiento*: cuenta con una comunidad activa, actualizaciones regulares y amplio soporte,
asegurando su confiabilidad y relevancia en el ecosistema moderno
3. *Mejores prácticas*: facilita la creación y mantenimiento eficiente de pruebas aisladas, admite la integración
con diversas herramientas, entre ellas Mocha y Chai, y genera informes claros para evaluar resultados.

En resumen, el uso de Sinon.js para realizar mocks en las pruebas de API, sin necesidad de acceder a la base
de datos ofrece: velocidad, fiabilidad, flexibilidad y un entorno de pruebas independiente. Esto resulta
especialmente útil para la creación de pruebas unitarias y de integración robustas mientras
separan responsabilidades y mantienen las pruebas enfocadas

## 3. Elección de la herramienta para CI

Se tendrán en cuenta los siguientes requisitos, en orden de importancia:

1. *Compatibilidad con el entorno actual*: debe ser compatible con el runtime Node.js y con GitHub, para
poder automatizar la ejecución de tests cada vez que se haga un push en el repositorio del proyecto.
2. *Costo*: se busca una solución gratuita, priorizando las opciones de código abierto o servicios de CI
que cuentan con planes gratuitos con características suficientes.
3. *Comunidad y mantenimiento*: la presencia de una comunidad activa, buen soporte técnico y una larga
"esperanza de vida" mediante actualizaciones frecuentes.

Se ha optado por [**GitHub Actions**](https://github.com/features/actions), debido a las siguientes razones:

1. *Compatibilidad con el entorno actual*: dado que el principal requisito es automatizar la ejecución de tests
cada vez que se haga un push en el repositorio, esta herramienta es la más idónea y fácil de integrar con el proyecto.
2. *Costo*: este servicio gratuito es más que suficiente para cumplir los requisitos del proyecto.
3. *Comunidad y mantenimiento*: GitHub Actions, como parte integral de GitHub, cuenta con una comunidad masiva,
con actualizaciones frecuentes y soporte técnico sólido.

Como en el caso de Chai, también se ha optado por esta herramienta porque ya está instalada en el entorno de
desarrollo, al haber sido empleada en el hito anterior.

## 4. Elección de herramienta para logs

Se ha elegido [**Winston**](https://github.com/winstonjs/winston) para manejar los logs debido a su flexibilidad, robustez y amplia adopción en la
comunidad de Node.js. Winston permite gestionar logs de manera estructurada y configurable, ofreciendo soporte
para múltiples niveles de registro (info, error, debug, etc.) y la capacidad de almacenar los logs en diversos
transportes, como archivos, bases de datos o servicios en la nube. Su capacidad para personalizar formatos y
agregar metadatos a los registros lo hace ideal para aplicaciones complejas donde los logs deben ser claros
y procesables.

Además, Winston es modular y extensible, lo que permite adaptarlo a diferentes necesidades, como registro
condicional según el entorno (desarrollo o producción) y la integración con herramientas de monitoreo.
Su soporte para JSON y la configuración de transportes simultáneos (por ejemplo, consola y archivo) lo
convierten en una solución completa para la gestión de logs en aplicaciones modernas.
