export default class PaymentReqDto {
    constructor(data) {
        this.paymetId = data.paymetId;
        this.userId = data.userId;
        this.status = data.status;
        this.amount = data.amount;
        this.cartId = data.cartId;
    };
};