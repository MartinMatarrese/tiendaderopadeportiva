export default class PaymentReqDto {
    constructor(data) {
        this.payment_id = data.payment_id || data.paymentId;
        this.userId = data.userId;
        this.status = data.status;
        this.amount = data.amount;
        this.cartId = data.cartId;
        this.ticketId = data.ticketId;
        this.emailSent = data.emailSent || false;
        this.processedAt = data.processedAt || new Date();
        this.error = data.error;
    };
};