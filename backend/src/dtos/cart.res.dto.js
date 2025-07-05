export default class CartResDto {
    constructor(cart) {
        this.id = cart._id;
        this.userId = cart.userId
        this.products = cart.products.map(prod => ({
            id_prod: prod.id_prod._id,
            quantity: prod.quantity,
            title: prod.id_prod.title,
            price: prod.id_prod.price
        }));
    };
};