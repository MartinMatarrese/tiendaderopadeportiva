import { check, validationResult } from "express-validator";

export const userValidator = [
    check("first_name", "El nombre es obligatorio")
        .exists()
        .isString()
        .not()
        .isEmpty(),
    check("last_name", "El apellido es obligatorio")
        .exists()
        .isString()
        .not()
        .isEmpty(),
    check("email", "Debe ser un correo electrónico válido")
        .exists()
        .isEmail()
        .normalizeEmail(),
    check("age", "Debes insertar una edad")
        .exists()
        .isInt()
        .not()
        .isEmpty(),
    check("password", "Debes insertar una contraseña")
        .exists()
        .isLength()
        .not()
        .isEmpty(),
    check("role", "El role debe ser user o admin")
        .optional()
        .isIn(([ "user", "admin"])),
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errores: errors.array()});
        }
        next()
    }
];