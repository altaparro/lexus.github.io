  const swaggerAutogen = require('swagger-autogen');

  const doc = {
    info: {
      title: 'Contadurias Prueba',
      description: 'End points del sistema'
    },
    host: 'localhost:6607/api/v1',
    tags: [
      {
        name: 'Usuarios',
        description: 'Operaciones relacionadas con usuarios'
      }
    ]
  };

  const outputFile = './swagger-output.json';
  const routes = ['./router/usuario.router', './router/product.router', './router/proveedor.router'];

  /* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
  root file where the route starts, such as index.js, app.js, routes.js, etc ... */

  swaggerAutogen(outputFile, routes, doc);