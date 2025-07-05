export default class ProductReqDto {
    constructor (product) {
        this.image = product.image;
        this.title = product.title;
        this.description = product.description;
        this.category = product.category;
        this.price = product.price;
        this.stock = product.stock;
        this.code = product.code;
    };
};