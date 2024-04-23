const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
    let token = req.headers['x-access-token'] || req.headers['authorization'];

    if (!token) {
        return res.status(401).send({
            error: 'Es necesario un token de autenticación'
        });
    }

    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    jwt.verify(token, 'clavesecreta', (error, decoded) => {
        if (error) {
            return res.status(401).json({
                message: 'El token no es válido'
            });
        } else {
            // Accede al ID del usuario desglosando el token en su parte de id 
            const userId = decoded.userId;

            // Almacena el ID del usuario en el objeto 'req' para su uso en las rutas protegidas
            req.userId = userId;
            
            next();
        }
    });
}

module.exports = {
    verificarToken
};