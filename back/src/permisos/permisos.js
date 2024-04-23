const jwt = require("jsonwebtoken");
const sequelize = require("../model/usuario.model").sequelize;

function obtenerPermisos(permisoRequerido) {
  return async function (req, res, next) {
    let token = req.headers["x-access-token"] || req.headers["authorization"];

    if (!token) {
      return res.status(401).send({
        error: "Es necesario un token de autenticación",
      });
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }

    jwt.verify(token, "clavesecreta", async (error, decoded) => {
      if (error) {
        return res.status(401).json({
          message: "El token no es válido",
        });
      } else {
        const userId = decoded.userId;

        try {
          const query = `
          SELECT permisos.permisos AS permisos
          FROM usuarios
          JOIN roles ON usuarios.rol = roles.id
          JOIN roles_permisos ON roles.id = roles_permisos.id_roles
          JOIN permisos ON roles_permisos.id_permisos = permisos.id
          WHERE usuarios.usuario_id = :userId;
          `;

          const results = await sequelize.query(query, {
            replacements: { userId },
            type: sequelize.QueryTypes.SELECT,
          });

          if (!results || results.length === 0) {
            return res.status(404).json({
              ok: false,
              status: 404,
              message: "Usuario no encontrado o sin permisos",
            });
          }

          const permisos = results.map(r => r.permisos);

          if (permisos.includes(permisoRequerido)) {   // permisoRequerido es el que paso por parametro en la ruta para ver que funcion es la que deberia ejecutar
            // El usuario tiene los permisos requeridos, llama a next para continuar con la siguiente función
            return next();
          } else {
            // El usuario no tiene los permisos requeridos
            return res.status(403).json({
              ok: false,
              status: 403,
              message: "No tiene los permisos requeridos",
            });
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({
            ok: false,
            status: 500,
            message: "Error al obtener los permisos",
          });
        }
      }
    });
  };
}





module.exports = {
  obtenerPermisos,
};

