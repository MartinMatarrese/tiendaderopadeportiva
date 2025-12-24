export default class PaymentResDto {
    constructor(payment) {
        this.id = payment._id ? String(payment._id) : undefined;
        this.payment_id = payment.payment_id || payment.paymentId;
        this.userId = payment.userId;
        this.status = payment.status;
        this.amount = payment.amount;
        this.cartId = payment.cartId;
        this.ticketId = payment.ticketId;
        this.emailSent = payment.emailSent || false;
        this.processedAt = payment.processedAt || payment.createdAt;
        this.error = payment.error;
        this.createdAt = payment.createdAt;
        this.updateAdt = payment.updateAdt;
    };
};