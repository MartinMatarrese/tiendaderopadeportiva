import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { roleAuth } from "../middlewares/roleAuth.js";
import { userValidator } from "../middlewares/user.validator.js";
import { jwtAuth } from "../middlewares/jwtAuth.js";
import { uploadUserPic } from "../config/multer.js";
import passport from "passport";
import { passportCall } from "../passport/passportCall.js";

const userRouter = Router()

userRouter.post("/register", userValidator, userController.register);

userRouter.post("/login", userController.login);

userRouter.get("/current", [jwtAuth, roleAuth("user", "admin")], userController.privateData);

userRouter.post("/profile-pic", [ jwtAuth, roleAuth("user", "admin"), uploadUserPic.single("profilePic")], userController.updateUser);

userRouter.get("/google", passport.authenticate("google", { scope: ["email", "profile"]}));

userRouter.get("/googlecallback", passportCall("google"), userController.googleProfile);

userRouter.get("/logout", [jwtAuth], userController.logout);

export default userRouter;