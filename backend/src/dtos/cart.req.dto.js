export default class CartReqDto {
    constructor(cart) {
        this.id = cart._id
        this.userId = cart.userId,
        this.products = cart.products.map(prod => ({
            id_prod: prod.id_prod,
            quantity: prod.quantity
        }));
    };
};