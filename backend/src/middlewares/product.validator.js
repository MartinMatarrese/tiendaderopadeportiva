import { check, validationResult } from "express-validator";

export const productValidator = [
    check("title", "Debe insertar un valor en el title")
        .exists()
        .isString()
        .not()
        .isEmpty(),
    check("description", "debe insertar una descripción")
        .exists()
        .isString()
        .not()
        .isEmpty(),
    check("category", "Debe insertar una categoria")
        .exists()   
        .isString()
        .not()
        .isEmpty(),
    check("price", "Debe insertar un price")
        .exists()
        .isInt()
        .not()
        .isEmpty(),
    check("stock", "Debe insertar un valor en stock")
        .exists()
        .isInt()
        .not()
        .isEmpty(),
    check("code", "Debe insertar un code")
        .exists()
        .isAlphanumeric()
        .not()
        .isEmpty(),
    (req, res, next) => {
        try {
            validationResult(req).throw();
            next()
        } catch(error) {
            res.status(400).json({ errores: error.array() });
        };
    }
];   