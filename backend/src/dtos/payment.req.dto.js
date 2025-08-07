export default class PaymentReqDto {
    constructor(data) {
        this.paymentId = data.paymentId;
        this.userId = data.userId;
        this.status = data.status;
        this.amount = data.amount;
        this.cartId = data.cartId;
        this.ticketId = data.ticketId;
    };
};