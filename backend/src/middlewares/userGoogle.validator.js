import { check, validationResult } from "express-validator";

export const userGoogleValidator = [
    check("email", "Debe ser un correo electrónico válido")
        .exists()
        .isEmail()
        .normalizeEmail(),
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errores: errors.array()});
        };
        next();
    }
]