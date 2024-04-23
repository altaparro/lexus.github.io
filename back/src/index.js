// Donde inicia el sistema:

require('dotenv').config();
const app = require("./app/app");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.PORT;

app.listen(port, ()=> {
    console.log(`-------- server corriendo en puerto ${port}`);
});