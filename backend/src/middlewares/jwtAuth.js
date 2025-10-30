import jwt from "jsonwebtoken";
import "dotenv/config";

const SECRET_KEY = process.env.SECRET_KEY

export const jwtAuth = (req, res, next) => {
    try {
        let token;
        // const token = req.cookies.token;
        // if(!token) {
        //     return res.status(401).json({error: "No autorizado"});
        // };
        // const decodeToken = jwt.verify(token, SECRET_KEY);
        // req.user = decodeToken;
        // next();
        const authHeader = req.headers.authorization;
        if(authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
            console.log("🔑 Token obtenido de header Authorization");            
        } else if(req.cookies && req.cookies.token) {
            token = req.cookies.token
            console.log("🔑 Token obtenido de cookies");
        }

        if(!token) {
            console.log("❌ No se encontró token en headers ni cookies");
            return res.status(401).json({error: "No autorizado - Token no proporcionado"});
        }

        const decodeToken = jwt.verify(token, SECRET_KEY);
        req.user = decodeToken;
        console.log("✅ Token verificado - Usuario:", decodeToken.email);
        next();
    } catch(error) {
        console.error("❌ JWT Auth Error:", error.message);
        return res.status(401).json({error: "token inválido o expirado"});
    };
};