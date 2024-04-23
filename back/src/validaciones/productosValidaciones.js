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

// validaciones de los input:

const validacionesProductos = [
    check('product_name')
    .exists()
    .not()
    .isEmpty()
    .isLength({min: 3})
    .withMessage('El nombre debe tener al menos 3 caracteres'),
    check('price')
    .exists()
    .not()
    .isEmpty()
    .isNumeric(),
    check('cantidad')
    .exists()
    .not()
    .isEmpty()
    .isNumeric(),
    check('tipo')
    .exists()
    .not()
    .isEmpty()
    .isAlphanumeric(),
    check('proveedor')
    .exists()
    .not()
    .isEmpty()
    .isAlphanumeric(),

    (req, res, next) => {
       validateResult(req, res, next)
    }
 ]


 module.exports = { validacionesProductos };