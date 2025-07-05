import cartModel from "./models/cart.model.js";
import MongoDao from "./mongo.dao.js";

class CartDaoMongo extends MongoDao {
    constructor() {
        super(cartModel)
    };

    createCart = async(data) => {
        try {
            const newCart = await cartModel.create(data);
            return newCart;
        } catch(error) {
            throw Error(error);
        };
    };

    getCartById = async(id) => {
        try {
            return await cartModel.findById(id).populate("products.id_prod").populate({ path: "userId", model: "users"});
        } catch (error) {
            throw new Error(error);                  
        };
    };

    update = async(cartId, updateData) => {
        try {
            return await cartModel.findByIdAndUpdate(cartId, updateData, {new: true});
        } catch (error) {
            throw new Error(error);
        };
    };


};

export const cartDao = new CartDaoMongo();