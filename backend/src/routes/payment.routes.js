import { Router } from "express";
import { paymentController } from "../controllers/payment.controllers.js";
import { jwtAuth } from "../middlewares/jwtAuth.js";
import { roleAuth } from "../middlewares/roleAuth.js";

const paymentRouter = Router();

paymentRouter.post("/create-preference", jwtAuth, roleAuth(["user"]), paymentController.createPreference);

paymentRouter.get("/success", jwtAuth, roleAuth(["user"]), paymentController.handleSuccess);

paymentRouter.get("/", jwtAuth, roleAuth(["user"]), paymentController.getAllPayment);

paymentRouter.get("/:paymentid", jwtAuth, roleAuth(["user"]), paymentController.getPaymentById);

paymentRouter.post("/", jwtAuth, roleAuth(["user"]), paymentController.createPayment);

paymentRouter.put("/:paymentid", jwtAuth, roleAuth(["user"]), paymentController.update);

paymentRouter.delete("/:paymentid", jwtAuth, roleAuth(["user"]), paymentController.delete);

export default paymentRouter
