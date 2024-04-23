// Configurando la app:

const express = require("express");
const morgan = require("morgan");
const productoRouter = require("../router/product.router");
const usuarioRouter = require("../router/usuario.router");
const proveedorRouter = require("../router/proveedor.router");
const app = express();
const cors = require("cors");
const keys = require("../settings/keys");
const outputFile = './swagger-output.json';


app.use(cors());

app.set("key", keys.key);

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("mi app");
});



app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use("/api/v1", productoRouter);

app.use("/api/v1", usuarioRouter);

app.use("/api/v1", proveedorRouter);




module.exports = app;
