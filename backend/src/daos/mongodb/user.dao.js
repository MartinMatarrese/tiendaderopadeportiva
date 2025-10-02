import MongoDao from "./mongo.dao.js";
import { userModel } from "./models/user.model.js";

class userDaoMongo extends MongoDao {
    constructor() {
        super(userModel)
    }

    async register(user) {
        try {
            return await this.model.create(user);
        } catch (error) {
            throw new Error(error);
        }
    };

    async getById(id) {
        try {
            return await this.model.getById(id).populate("cart");
        } catch (error) {
            throw new Error(error);
        }
    };

    async getByEmail(email) {
        try {
            return await this.model.findOne({email});
        } catch (error) {
            throw new Error(error);
        }
    };

    async updatePassword (userId, hashedPassword) {
        try {
            return await this.model.findByIdAndUpdate(userId, { password: hashedPassword});
        } catch (error) {
            throw new Error(error);
        }
    }
}

export const userDao = new userDaoMongo();