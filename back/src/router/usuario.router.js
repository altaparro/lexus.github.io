const usuarioRouter = require("express").Router();
const { faker } = require("@faker-js/faker");
const Usuarios = require("../model/usuario.model");
const Product = require("../model/product.model");
const usuariosController = require("../controllers/usuario.controllers");
const { request } = require("express");
const verificarToken = require("../middleware/authMiddleware").verificarToken;
const obtenerPermisos = require("../permisos/permisos");
const {
  validacionesInputs,
  validacionLogin,
} = require("../validaciones/usuariosValidaciones");
const permisos = require("../permisos/permisos");
const { capturarToken } = require("../middleware/tokenMiddleware");
const MercadoPago = require("mercadopago");
const MercadoPagoConfig = MercadoPago.MercadoPagoConfig;
const Preferences = MercadoPago.Preference;
const { Op } = require("sequelize");

// aca defino una constante con el nombre del controlador de la ruta, y la envio a permisos.js por parametro con el fin
// de saber que permiso tiene el usuario logueado:

const permisoCrear = "crearUsuario";
const permisoActualizar = "actualizarUsuario";
const permisoActualizarPorID = "actualizarUsuarioPorID";
const permisoObtenerTodos = "obtenerTodosLosUsuarios";
const permisoObtenerPorID = "obtenerUsuarioPorID";
const permisoEliminar = "eliminarUsuario";

// RUTAS:

usuarioRouter.get("/usuarios/obtenerTodosLosUsuarios", verificarToken, permisos.obtenerPermisos(permisoObtenerTodos), usuariosController.obtenerTodosLosUsuarios);

usuarioRouter.get("/usuarios/obtenerUsuarioPorID/:usuario_id", verificarToken, permisos.obtenerPermisos(permisoObtenerPorID), usuariosController.obtenerUsuarioPorID);

usuarioRouter.post("/usuarios/crearUsuario", verificarToken, permisos.obtenerPermisos(permisoCrear), validacionesInputs, usuariosController.crearUsuario);

usuarioRouter.put("/usuarios/actualizarUsuario", verificarToken, permisos.obtenerPermisos(permisoActualizar), usuariosController.actualizarUsuario);

usuarioRouter.put("/usuarios/actualizarUsuarioPorID", verificarToken, permisos.obtenerPermisos(permisoActualizarPorID), usuariosController.actualizarUsuarioPorID);

usuarioRouter.delete("/usuarios/eliminarUsuario/:usuario_id", verificarToken, permisos.obtenerPermisos(permisoEliminar), usuariosController.eliminarUsuario);

usuarioRouter.post("/login", validacionLogin, usuariosController.login);

usuarioRouter.post("/reestablecer", usuariosController.enviarToken);

usuarioRouter.post("/reestablecerPass/:token", capturarToken, usuariosController.actualizarPass);

// integrando mp

usuarioRouter.post("/create_preference", async (req, res) => {
  console.log(req.body.orders);
  const client = new MercadoPagoConfig({
    accessToken:
      "TEST-2502925548518627-010909-c18c4079893f6f5d1cfe9ca8850f125c-1623447233",
    options: { timeout: 5000, idempotencyKey: "abc" },
  });

  const preferences = new Preferences(client);

  const productIdsArray = req.body.orders.map(
    (producto) => producto.product_id
  );

  const carrito = await Product.findAll({
    where: {
      product_id: {
        [Op.in]: productIdsArray,
      },
    },
  });

  const carritoFinal = carrito.map((producto, index) => {
    return {
      title: producto.product_name,
      unit_price: Number(producto.price),
      quantity: Number(req.body.orders[index].cantidad),
      currency_id: "ARS",
    };
  });

  console.log(carritoFinal);

  preferences
    .create({
      body: {
        items: carritoFinal,
        back_urls: {
          success: "http://localhost:5500/index.html?clear=true",
          failure: "http://localhost:5500/carrito.html",
          pending: "http://localhost:5500/carrito.html",
        },
        auto_return: "approved",
      },
    })
    .then((data) => {
      res.json({
        message: data,
      });
    })
    .catch(console.log);
});

usuarioRouter.get("/feedback", function (req, res) {
  res.json({
    Payment: req.query.payment_id,
    Status: req.query.status,
    MerchantOrder: req.query.merchant_order_id,
  });
});

module.exports = usuarioRouter;
