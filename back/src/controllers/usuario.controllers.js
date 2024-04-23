const Usuarios = require("../model/usuario.model");
const bcrypt = require("bcrypt");
const Usuario = require("../model/usuario.model");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const keys = require("../settings/keys");

async function login(req, res) {
  const usuariosBase = await Usuario.findAll({
    where: {
      usuario: req.body.usuario,
    },
  });
  if (usuariosBase.length > 0) {
    const usuarioBase = usuariosBase[0];
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      usuarioBase.password
    );

    if (passwordMatch) {
      const userId = usuarioBase.usuario_id;
      const payload = {
        userId: userId,
        check: true,
      };
      const token = jwt.sign(payload, keys.key, {
        expiresIn: "30m",
      });
      res.json({
        message: "Autenticación exitosa",
        success: true,
        token: token,
        rol: usuarioBase.rol
      });
    } else {
      res.json({
        message: "Contraseña incorrecta",
      });
    }
  } else {
    res.json({
      message: "Usuario no encontrado",
    });
  }
}

async function crearUsuario(req, res) {
  try {
    const dataUsuarios = req.body;
    const rolCliente = 2;
    // Verificar si el usuario o el email ya existen, recorriendo la base
    const usuarioExistente = await Usuarios.findOne({
      where: { usuario: dataUsuarios.usuario },
    });
    const emailExistente = await Usuarios.findOne({
      where: { email: dataUsuarios.email },
    });

    if (usuarioExistente || emailExistente) {
      return res.status(409).json({
        ok: false,
        status: 409,
        message: "El usuario o el email ya existe",
      });
    } else {
      const hashedPassword = await bcrypt.hash(dataUsuarios.password, 8);

      await Usuarios.sync();

      const createUsuario = await Usuarios.create({
        usuario: dataUsuarios.usuario,
        password: hashedPassword,
        email: dataUsuarios.email,
        rol: rolCliente,
      });

      res.status(201).json({
        ok: true,
        status: 201,
        message: "Usuario cargado",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      status: 500,
      message: "Error al crear el usuario",
    });
  }
}

async function obtenerUsuarioPorID(req, res) {
  try {
    const id = req.params.usuario_id;
    const usuario = await Usuarios.findOne({
      where: {
        usuario_id: id,
      },
    });

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: "Usuario no encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      status: 200,
      body: usuario,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      status: 500,
      message: "Error al obtener el usuario",
    });
  }
}

async function obtenerTodosLosUsuarios(req, res) {
  const userId = req.userId;
  try {
    const usuarios = await Usuarios.findAll();

    res.status(200).json({
      ok: true,
      status: 200,
      body: usuarios,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      status: 500,
      message: "Error al obtener todos los usuarios",
    });
  }
}
// actualiza usuario propio de quien loguea luego agregar para un admin que modifique todos

async function actualizarUsuario(req, res) {
  const userId = req.userId; // Obten el ID del usuario autenticado desde el token
  console.log(userId);
  const dataUsuarios = req.body;
  const hashedPassword = await bcrypt.hash(dataUsuarios.password, 8);

  try {
    const [updateCount] = await Usuarios.update(
      {
        usuario: dataUsuarios.usuario,
        password: hashedPassword,
        email: dataUsuarios.email,
        rol: dataUsuarios.rol,
      },
      {
        where: {
          usuario_id: userId, // Utiliza el ID del usuario del token
        },
      }
    );

    if (updateCount === 0) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: "Usuario no encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      status: 200,
      message: "Usuario actualizado correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      status: 500,
      message: "Error al actualizar el usuario",
    });
  }
}

async function actualizarUsuarioPorID(req, res) {
  const dataUsuarios = req.body;
  const hashedPassword = await bcrypt.hash(dataUsuarios.password, 8);

  try {
    const [updateCount] = await Usuarios.update(
      {
        usuario_id: dataUsuarios.usuario_id,
        usuario: dataUsuarios.usuario,
        password: hashedPassword,
        email: dataUsuarios.email,
        rol: dataUsuarios.rol,
      },
      {
        where: {
          usuario_id: dataUsuarios.usuario_id,
        },
      }
    );

    if (updateCount === 0) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: "Usuario no encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      status: 200,
      message: "Usuario actualizado correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      status: 500,
      message: "Error al actualizar el usuario",
    });
  }
}

async function eliminarUsuario(req, res) {
  try {
    const id = req.params.usuario_id;

    const deleteCount = await Usuarios.destroy({
      where: {
        usuario_id: id,
      },
    });

    if (deleteCount === 0) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: "Usuario no encontrado",
      });
    }

    res.status(204).json({
      ok: true,
      status: 204,
      message: "Usuario eliminado correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      status: 500,
      message: "Error al eliminar el usuario",
    });
  }
}

//funcion enviar email para restaurar pass
function iniciarTransporter () {
  return nodemailer.createTransport({
    service: 'smtp',
    port: 25,
    host: '172.16.1.203',
    tls: {
      rejectUnauthorized: false
    }
  })
}


function enviarEmail(email, token){
  const transporter = iniciarTransporter();

  const link = `http://localhost:3001/api/v1/reestablecerPass/${token}`;
  const mailOptions = {
    from: '"Contadurias Prueba" <noreply2@spb.gba.gov.ar>',
    to: email,
    subject: 'Reestablecer contraseña',
    text: link
  }
  
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo electrónico:', error);
    } else {
      console.log('Correo electrónico enviado:', info.response);
    }
  });
  
}


// controlador para generar token y reestablecer contraseña
async function enviarToken(req, res, next) {
  const emailBody = req.body.email;
  let usuario = "";

  try {
    usuario = await Usuarios.findOne({
      where: {
        email: emailBody,
      },
    }); 
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      status: 500,
      message: "Error al obtener el email",
    });
  }

  // Genera el token
  if (!usuario) {
    return res.status(404).json({
      ok: false,
      message: "Usuario no encontrado",
    });
  }else{
    const userId = usuario.usuario_id;
    const payload = {
      userId: userId,
      check: true,
    };
    const token = jwt.sign(payload, keys.key, {
      expiresIn: "30m",
    });
    enviarEmail(emailBody, token)
  
    res.json({
      message: "Se le ha enviado un email con un link para restaurar la contraseña",
      success: true
    });

  }
 
}

async function actualizarPass(req, res) {
  const nuevaPassword = req.body.password;
  const hashedPassword = await bcrypt.hash(nuevaPassword, 8);
  const userId = req.userId;
  // Busca al usuario por el token
  const usuario = await Usuario.findOne({
    where: {
      usuario_id: userId,
    },
  });

  if (!usuario) {
    return res.redirect("/api/v1/reestablecer");
  }

  try {
    // Actualiza la contraseña del usuario en la base de datos
    await Usuarios.update(
      {
        password: hashedPassword,
      },
      {
        where: {
          usuario_id: userId,
        },
      }
    );

    res.status(201).json({
      ok: true,
      message: "Contraseña actualizada con éxito",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      status: 500,
      message: "Error al actualizar la contraseña",
    });
  }
}


module.exports = {
  crearUsuario,
  obtenerUsuarioPorID,
  obtenerTodosLosUsuarios,
  actualizarUsuario,
  actualizarUsuarioPorID,
  eliminarUsuario,
  login,
  enviarToken,
  actualizarPass,
};
