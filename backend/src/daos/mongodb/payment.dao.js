import { paymentModel } from "./models/payment.model.js";
import MongoDao from "./mongo.dao.js";

class PaymentDaoMongo extends MongoDao {
    constructor(){
        super(paymentModel)
    };

    create = async(paymentData) => {
        try {
            return await paymentModel.create(paymentData);
        } catch (error) {
            throw new Error(error);
        };
    };

    getAll = async(userId) => {
        try {
            if(userId){
                return await paymentModel.find({ userId }).populate("userId").populate("cartId");
            };
            return await paymentModel.find().populate("userId").populate("cartId");
        } catch (error) {
            throw new Error(error);
        };
    };

    getById = async(paymentId) => {
        try {
            return await paymentModel.findById(paymentId).populate("userId").populate("cartId");
        } catch (error) {
            throw new Error(error);
        };
    };

    getPaymentById = async(paymentId) => {
        try {
            return await paymentModel.findOne({paymentId}).populate("userId").populate("cartId");
        } catch (error) {
            throw new Error(error);
        };
    };

    update = async(id, dataToUpdate) => {
        try {
            return await paymentModel.findByIdAndUpdate(id, dataToUpdate, {new: true});
        } catch (error) {
            throw new Error(error);
        };
    };

    delete = async(id) => {
        try {
            return await paymentModel.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(error);
        };
    };
};

export const paymentDao = new PaymentDaoMongo();