import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { userService } from "../services/user.service.js";
import "dotenv/config";
import { userGoogleValidator } from "../middlewares/userGoogle.validator.js";

const GoogleStrategyConfig ={
    clientID: process.env.CLIENT_ID_GOOGLE,
    clientSecret: process.env.CLIENT_SECRET_GOOGLE,
    callbackURL: "http://localhost:8080/users/googlecallback"

};

const registerOrLogin = async(accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        const first_name = profile.name.givenName || "GoogleUser";
        const last_name = profile.name.familyName || "GoogleUser";
        const profilePic = profile.photos?.[0]?.value || null;
        const existingUser = await userService.getUserByEmail(email);
        if(existingUser) {
            return done(null, existingUser);
        };

        // if(!email) throw new Error("Email inválido");

        // const user = await userService.getUserByEmail(email);

        // if(user) return done(null, user);

        // const fullName = profile._json.name || "";

        // const [first_name = "Google", last_name = "user"] = fullName.split(" ");
        const userInput = {
            email,
            first_name,
            last_name,
            fromGoogle: true,
            age: 18,
            password: "google_no_password",
            profilePic
        };
        const req = { body: userInput};
        await Promise.all(userGoogleValidator.map((middleware) => middleware(req, {}, () => {})));
        const newUser = await userService.register(userInput);
        return done(null, newUser);
    } catch (error) {
        done(error);
    };
};

passport.use("google", new GoogleStrategy(GoogleStrategyConfig, registerOrLogin));

passport.serializeUser((user, done) => {
    try {
        done(null, user._id);
    } catch (error) {
        done(error)
    }
});

passport.deserializeUser( async(id, done) => {
    try{
        const user = await userService.getUserById(id);
        return done(null, user);
    } catch(error) {
        done(error);
    };
});