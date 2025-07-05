import { Router } from "express";
import { CartControllers } from "../controllers/carts.controllers.js"
import { roleAuth } from "../middlewares/roleAuth.js";
import { jwtAuth } from "../middlewares/jwtAuth.js";

const cartRouter = Router();

const cartControllers = new CartControllers();

cartRouter.get("/:cid", jwtAuth, roleAuth(["user"]), cartControllers.getCart);

cartRouter.post("/", jwtAuth, roleAuth(["user"]), cartControllers.createCart);

cartRouter.post("/:cid/products/:pid", jwtAuth, roleAuth(["user"]), cartControllers.insiderProductCart);

cartRouter.put("/:cid", jwtAuth, roleAuth(["user"]), cartControllers.updateProductsCart);

cartRouter.put("/:cid/products/:pid", jwtAuth, roleAuth(["user"]), cartControllers.updateQuantityProductCart);

cartRouter.post("/:cid/purchase", jwtAuth, roleAuth(["user"]), cartControllers.purchaseCart);

cartRouter.delete("/:cid", jwtAuth, roleAuth(["user"]), cartControllers.deleteCart);

cartRouter.delete("/:cid/products/:pid", jwtAuth, roleAuth(["user"]), cartControllers.deleteProductCart);


export default cartRouter