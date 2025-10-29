import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import "dotenv/config";
import { userService } from "../services/user.service.js";

const cookieExtractor = (req) => {
    let token = null;

    if(req && req.cookies) {
        token = req.cookies.token;
        console.log("🍪 Cookie extractor - Token:", token ? `✅ ${token.substring(0, 20)}...` : "❌ No encontrado");        
    }

    if(!token && req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if(authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            console.log("📨 Token de header:", token.substring(0, 20) + "...");            
        }
    }
    return token;
}

const strategycookieConfig = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: process.env.JWT_SECRET,
    passReqToCallback: true
};

const verifyToken = async(req, jwt_payload, done) => {
    try {

        if(!jwt_payload || !jwt_payload._id) {
            return done(null, false, { message: "Token Inválido" });
        };
        
        const user = await userService.getUserById(jwt_payload._id);

        if(!user) {
            console.log("❌ JWT - Usuario no encontrado para ID:", jwt_payload._id);
            return done(null, false, { message: "Usuario no encontrado"})
        }

        return done(null, user)
    } catch (error) {
        return done(error, false)        
    }
        
};

passport.use("current", new JwtStrategy(strategycookieConfig, verifyToken));

passport.serializeUser((user, done) => {
    try {
        done(null, user._id);
    } catch(error) {
        done(error)
    }
});

passport.deserializeUser(async(id, done) => {
    try {
        const user = await userService.getUserById(id);
        return done(null, user);
    } catch (error) {
        done(error)
    }
});