import { paymentModel } from "./models/payment.model.js";
import MongoDao from "./mongo.dao.js";

class PaymentDaoMongo extends MongoDao {
    constructor(){
        super(paymentModel)
    };

    create = async(paymentData) => {
        try {
            console.log("DAO: Creando pago con datos:", {
                payment_id: paymentData.payment_id,
                status: paymentData.status
            });
            
            return await paymentModel.create(paymentData);
        } catch (error) {
            console.error("DAO Error creando pago:", error);
            
            throw new Error(`Error al crear el pago: ${error.message}`);
        };
    };

    getAll = async(userId) => {
        try {
            if(userId){
                return await paymentModel.find({ userId })
                    .populate("userId")
                    .populate("cartId")
                    .populate("ticketId")
                    .sort({ createdAt: -1 });
            };

            return await paymentModel.find()
                .populate("userId")
                .populate("cartId")
                .populate("ticketId")
                .sort({ createdAt: -1 });

        } catch (error) {
            console.error("DAO Error obteniendo pagos:", error);            
            throw new Error(`Error al obtener pagos: ${error.message}`);
        };
    };

    getById = async(id) => {
        try {
            return await paymentModel.findById(id)
                .populate("userId")
                .populate("cartId")
                .populate("ticketId");
        } catch (error) {
            console.error("DAO Error obteniendo pago por ID:", error);
            
            throw new Error(`Error al obtener pago por ID: ${error.message}`);
        };
    };

    getPaymentById = async(paymentId) => {
        try {
            const idStr = paymentId.toString();
            return await paymentModel.findOne({ payment_id: idStr })
                .populate("userId")
                .populate("cartId")
                .populate("ticketId");
        } catch (error) {
            console.error("DAO Error obteniendo pago por payment_id:", error, paymentId);            
            return null
        };
    };

    getByCartId = async(cartId) => {
        try {
            return await paymentModel.find({ cartId })
                .populate("userId")
                .populate("ticketId")
                .sort({ createdAt: -1 })
        } catch (error) {
            console.error("DAO Error al obtener pagos por cartId:", error);
            return [];
        };
    };

    update = async(id, dataToUpdate) => {
        try {
            return await paymentModel.findByIdAndUpdate(id, dataToUpdate, {new: true});
        } catch (error) {
            console.error("DAO Error al actualizar el pago:", error);
            
            throw new Error(`Error al actualizar el pago ${error.message}`);
        };
    };

    delete = async(id) => {
        try {
            return await paymentModel.findByIdAndDelete(id);
        } catch (error) {
            console.error("DAO Error al eliminando pago:", error);

            throw new Error(`Error al eliminar pago ${error.message}`);
        };
    };
};

export const paymentDao = new PaymentDaoMongo();