const productoRouter = require("express").Router()
const Products = require("../model/product.model");
const productosController = require("../controllers/productos.controller");
const verificarToken = require("../middleware/authMiddleware").verificarToken;
const permisos = require('../permisos/permisos');
const { validacionesProductos } = require('../validaciones/productosValidaciones')

const permisoCrear = "crearProducto"; // aca defino una constante con el nombre del controlador de la ruta, y la envio a permisos.js por parametro
const permisoActualizar = "actualizarProducto";
const permisoObtenerPorID = "obtenerProductoPorID";
const permisoEliminar = "eliminarProducto";


productoRouter.get("/products/obtenerTodosLosProductos", productosController.obtenerTodosLosProductos);

productoRouter.get("/products/obtenerProductoPorTipo/:tipoCategoria", productosController.obtenerProductoPorTipo);

productoRouter.get("/products/obtenerProductoPorID/:product_id", verificarToken, permisos.obtenerPermisos(permisoObtenerPorID), productosController.obtenerProductoPorID);

productoRouter.post("/products/crearProducto", validacionesProductos, productosController.crearProducto);

// productoRouter.post("/products/crearProducto", verificarToken, permisos.obtenerPermisos(permisoCrear), validacionesProductos, productosController.crearProducto);

productoRouter.put("/products/actualizarProducto/:product_id", productosController.actualizarProducto);

productoRouter.delete("/products/eliminarProducto/:product_id", productosController.eliminarProducto)


module.exports = productoRouter;