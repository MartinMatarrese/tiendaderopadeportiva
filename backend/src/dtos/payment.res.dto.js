export default class PaymentResDto {
    constructor(payment) {
        this.id = payment._id;
        this.paymentId = payment.paymentId;
        this.userId = payment.userId;
        this.status = payment.status;
        this.amount = payment.amount;
        this.cartId = payment.cartId;
        this.createdAt = payment.createdAt;
    };
};