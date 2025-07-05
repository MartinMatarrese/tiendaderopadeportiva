import jwt from "jsonwebtoken";
import "dotenv/config";

const SECRET_KEY = process.env.SECRET_KEY

export const jwtAuth = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token) {
            return res.status(401).json({error: "No autorizado"});
        };
        const decodeToken = jwt.verify(token, SECRET_KEY);
        req.user = decodeToken;
        next();
    } catch(error) {
        return res.status(401).json({error: "token inválido o expirado"});
    };
};