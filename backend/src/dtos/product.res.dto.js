export default class ProductResDto {
    constructor(product){
        if(!product || !product._id) {
            throw new Error("Producto inválido para construir ProductResDto");
            
        }
        this.id = product._id;
        this.image = product.image;
        this.title = product.title;
        this.description = product.description;
        this.category = product.category;
        this.price = product.price;
        this.stock = product.stock;
        this.code = product.code;
    };
};