import { productService } from "../services/product.service.js";

class ProductController  {
    constructor() {
        this.productService = productService;
    };

    getProducts = async (req, res, next) => {
            try {
                const { category } = req.query;
                if(category) {
                    const products = await this.productService.getByCategory(category);
                    return res.status(200).send(products);
                };
                const { limit, page, filter, metFilter, ord } = req.query;
                const pag = page !== undefined ? page : 1;
                const lim = limit !== undefined ? limit : 10;
                const query = {
                    ...(metFilter !== undefined ? {[metFilter] : filter} : {}),
                    ...(category !== undefined ? { categoria: category } : {})
                };
                const onQuery = ord !== undefined ? {price: ord} : {}
                const prods = await this.productService.getAll(query, {limit: lim, page: pag, sort: onQuery})
                res.status(200).send(prods)
            }catch(error){
                next(error)
            };
        };

        getProduct = async (req, res, next) => {
            try {
                const { pid } = req.params
                const prod = await this.productService.getById(pid);
                if(prod) {
                    res.status(200).json(prod);
                } else {
                    res.status(404).json({error: "El producto no existe"});
                }
            } catch(error){
                next(error)
            };
        };
        
        createProduct = async (req, res, next) => {
            try {                
                const product = req.body
                const createProduct = await this.productService.create(product)
                res.status(201).json(createProduct);
            } catch(error){
                next(error);
            };
        };
        
        updateProduct = async (req, res, next) => {
            try {
                const { pid } = req.params
                const update = req.body
                const updateProduct = await this.productService.update(pid, update);
                res.status(200).json(updateProduct);
            } catch(error){
                next(error);
            };
        };

        getByCategory = async(req, res, next) => {
            try {
                const { category } = req.params;
                const products = await productService.getByCategory(category);
                res.status(200).json(products);
            } catch(error) {
                next(error);
            }
        };
        
        deleteProduct = async (req, res, next) => {
            try {
                const { pid } = req.params
                await this.productService.delete(pid)
                res.status(200).json({ message: "Producto eliminado correctamente" });
            }catch(error){
                next(error);
            };
        };
};

export const productController = new ProductController();