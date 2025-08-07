export default class CartResDto {
    constructor(cart) {
        this.id = cart._id;
        // this.userId = cart.userId
        this.userId = {
            _id: cart.userId._id,
            first_name: cart.userId.first_name,
            last_name: cart.userId.last_name,
            email: cart.userId.email
        };
        this.products = cart.products.map(prod => ({
            id_prod: prod.id_prod._id,
            quantity: prod.quantity,
            title: prod.id_prod.title,
            price: prod.id_prod.price
        }));
    };
};