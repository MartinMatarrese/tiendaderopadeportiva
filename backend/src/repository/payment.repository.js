import persistence from "../daos/persistence.js";
import PaymentReqDto from "../dtos/payment.req.dto.js";
import PaymentResDto from "../dtos/payment.res.dto.js";

const { paymentDao } = persistence;

class PaymentRepository {
    constructor() {
        this.dao = paymentDao;
    };

    createPayment = async(paymentData) => {
        try {
            console.log("Creando pago con payment_id:", paymentData.payment_id);
            
            const response = new PaymentReqDto(paymentData);
            const payment = await this.dao.create(response)
            return payment    
        } catch (error) {
            console.error("REPOSITORY Error creando pago:", error);
            
            throw new Error(`Error en paymentRepository al crear el payment: ${error.message}`);
        };
    };

    getAllPayment = async(userId) => {
        try {
            const payments = await this.dao.getAll(userId);
            return payments.map(payment => new PaymentResDto(payment));
        } catch (error) {
            throw new Error(`Error al obtener el paymant: ${error.message}`);
        };
    };

    getById = async(id) => {
        try {
            const payment = await this.dao.getById(id);
            if(!payment) return null
            return new PaymentResDto(payment);
        } catch (error) {
            throw new Error(`Error al obtener el pago por ID: ${error.message}`);
        };
    };

    getPaymentById = async(paymentId) => {
        try {
            console.log("REPOSITORY Buscando pago por payment_id:", paymentId);
            
            const payment = await this.dao.getById(paymentId);
            if(!payment) {
                console.log(`Repository: Pago ${paymentId} no encontrado`);

                return null;
            } else {
                console.log(`Repository: Pago ${paymentId} encontrado`);                
            };

            return new PaymentResDto(payment);
        } catch (error) {
            console.error("Repository: Error en getPaymentId:", error.message);
            return null;
            // throw new Error(`Error al buscar el payment por el id: ${error.message}`);
        };
    };

    getPaymentsByCartId = async(cartId) => {
        try {
            return await this.dao.getByCartId(cartId);
        } catch (error) {
            console.error("Repository: Error obteniendo pagos por cartId:", error);
            return [];            
        };
    };

    update = async(id, dataToUpdate) => {
        try {
            const updatePayment = await this.dao.update(id, dataToUpdate);
            return updatePayment;
        } catch (error) {
            throw new Error(`Error al actualizar el pago: ${error.message}`);
        };
    };

    delete = async(id) => {
        try {
            const payment = await this.dao.delete(id);
            return payment;
        } catch (error) {
            throw new Error(`Error al eliminar el pago: ${error.message}`);
        };
    };
};

export const paymentRepository = new PaymentRepository();