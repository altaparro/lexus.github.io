const { check, validationResult } = require('express-validator')


const validateResult = (req, res, next) => {
    try {
        validationResult(req).throw()
        return next()
    } catch (err) {
        res.status(403)
        res.send({ errors: err.array() })
    }
}

// Validaciones de los inputs para cargar un proveedor:

const validacionesProveedores = [
    check('nombre')
    .exists()
    .not()
    .isEmpty()
    .isAlphanumeric()
    .isLength({min: 3})
    .withMessage('El nombre debe tener al menos 3 caracteres'),
    check('cuit')
    .exists()
    .not()
    .isEmpty()
    .isAlphanumeric(),
    check('empresa')
    .exists()
    .not()
    .isEmpty()
    .isAlphanumeric(),

    (req, res, next) => {
       validateResult(req, res, next)
    }
 ]


 module.exports = { validacionesProveedores };