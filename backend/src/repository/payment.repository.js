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
            const response = new PaymentReqDto(paymentData);
            const payment = await this.dao.create(response)
            return payment    
        } catch (error) {
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
            throw new Error(`Error al buscar el paymant: ${error.message}`);
        };
    };

    getPaymentById = async(paymentId) => {
        try {
            const payment = await this.dao.getById(paymentId);
            if(!payment) return null;
            return new PaymentResDto(payment);
        } catch (error) {
            throw new Error(`Error al buscar el payment por el id: ${error.message}`);
        };
    };

    update = async(id, dataToUpdate) => {
        try {
            const updatePayment = await this.dao.update(id, dataToUpdate);
            return updatePayment;
        } catch (error) {
            throw new Error(`Error en paymentRepository: ${error.message}`);
        };
    };

    delete = async(id) => {
        try {
            const payment = await this.dao.delete(id);
            return payment;
        } catch (error) {
            throw new Error(`Error al borrar el payment: ${error.message}`);
        };
    };
};

export const paymentRepository = new PaymentRepository();