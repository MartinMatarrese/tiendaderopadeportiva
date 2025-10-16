import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { roleAuth } from "../middlewares/roleAuth.js";
import { forgotValidator, LoginValidator, userValidator } from "../middlewares/user.validator.js";
import { jwtAuth } from "../middlewares/jwtAuth.js";
import { uploadUserPic } from "../config/multer.js";
import passport from "passport";
import { passportCall } from "../passport/passportCall.js";

const userRouter = Router()

userRouter.post("/register", userValidator, userController.register);

userRouter.post("/login", LoginValidator, userController.login);

userRouter.get("/verify-email/:token", userController.verifyEmail);

userRouter.post("/resend-verification", userController.resendVerification);

userRouter.post("/forgot-password", forgotValidator, userController.forgotPassword);

userRouter.post("/reset-password", userController.resetPassword);

userRouter.get("/google", passport.authenticate("google", { scope: ["email", "profile"]}));

userRouter.get("/googlecallback", passportCall("google"), userController.googleProfile);

userRouter.get("/current", [jwtAuth, roleAuth("user", "admin")], userController.privateData);

userRouter.post("/profile-pic", [ jwtAuth, roleAuth("user", "admin"), uploadUserPic.single("profilePic")], userController.updateUser);

userRouter.post("/logout", userController.logout);

export default userRouter;