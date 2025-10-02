import { check, validationResult } from "express-validator";

export const userValidator = [
    check("first_name", "El nombre es obligatorio")
        .exists().withMessage("El nombre es requerido")
        .isString().withMessage("El nombre debe ser texto")
        .isLength({ min: 3, max: 30 }).withMessage("El nombre debe tener entre 3 y 30 caracteres")
        .trim(),

    check("last_name", "El apellido es obligatorio")
        .exists().withMessage("El apellido es requerido")
        .isString().withMessage("El apellido debe ser texto")
        .isLength({ min: 3, max: 30 }).withMessage("El apellido debe tener entre 3 y 30 caracteres")
        .trim(),

    check("email", "Debe ser un correo electrónico válido")
        .exists().withMessage("El email es obligatorio")
        .isEmail().withMessage("Debe ser un email válido")
        .normalizeEmail(),

    check("age", "Debes insertar una edad")
        .exists().withMessage("La edad es requerida")
        .isInt({ min: 18, max: 100 }).withMessage("Debe ser mayor de edad"),
        
    check("password", "La contraseña debe tener al menos 6 caracteres")
        .exists().withMessage("La contraseña es requerida")
        .isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
        
    check("role", "El role debe ser user o admin")
        .optional()
        .isIn(([ "user", "admin"])).withMessage("El reole debe ser user o admin"),
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errores: errors.array()});
        }
        next()
    }
];

export const LoginValidator = [
    check("email", "Debe ser un correo electrónico válido")
        .exists()
        .isEmail()
        .normalizeEmail(),

    check("password", "La contraseña es requerida")
        .exists()
        .isLength({min: 6}),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errores: errors.array()});
        }
        next();
    }
];

export const forgotValidator = [
    check("email", "Debe ser un correo electrónico válido")
        .exists()
        .isEmail()
        .normalizeEmail(),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errores: errors.array()});
        }
        next();
    }
];