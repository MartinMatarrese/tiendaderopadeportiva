export default class PaymentResDto {
    constructor(payment) {
        this.id = payment._id ? String(payment._id) : undefined;
        this.userId = payment.userId;
        this.status = payment.status;
        this.amount = payment.amount;
        this.cartId = payment.cartId;
        this.ticketId = payment.ticketId;
        this.createdAt = payment.createdAt;
    };
};