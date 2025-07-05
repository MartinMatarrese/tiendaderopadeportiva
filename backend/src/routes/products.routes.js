import { Router } from "express";
import { productController } from "../controllers/products.controllers.js";
import { roleAuth } from "../middlewares/roleAuth.js";
import { productValidator } from "../middlewares/product.validator.js";
import { jwtAuth } from "../middlewares/jwtAuth.js";


const productRouter = Router();

productRouter.get("/", productController.getProducts);

productRouter.get("/category/:category", productController.getByCategory);

productRouter.get("/:pid", productController.getProduct);

productRouter.post("/", jwtAuth, roleAuth(["admin"]), productValidator, productController.createProduct);

productRouter.put("/:pid", jwtAuth, roleAuth(["admin"]), productController.updateProduct);

productRouter.delete("/:pid", jwtAuth, roleAuth(["admin"]), productController.deleteProduct);

export default productRouter