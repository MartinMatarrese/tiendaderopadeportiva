import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import "dotenv/config";
import { userService } from "../services/user.service.js";

const verifyToken = async(jwt_playload, done) => {
    if(!jwt_playload) return done(null, false, { messages: "Usuario inexistente" });
    return done(null, jwt_playload);
};

const strategycookieConfig = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretKey: process.env.SECRET_KEY
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
        const user = await userService.getById(id);
        return done(null, user);
    } catch (error) {
        done(error)
    }
});