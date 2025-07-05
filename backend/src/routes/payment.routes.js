import { Router } from "express";
import { paymentController } from "../controllers/payment.controllers.js";

const paymentRouter = Router();

paymentRouter.post("/create-preference", paymentController.createPreference);

paymentRouter.get("/success", paymentController.handleSuccess);

paymentRouter.get("/", paymentController.getAllPayment);

paymentRouter.get("/:paymentid", paymentController.getPaymentById);

paymentRouter.post("/", paymentController.createPayment);

paymentRouter.put("/:paymentid", paymentController.update);

paymentRouter.delete("/:paymentid", paymentController.delete);

export default paymentRouter
