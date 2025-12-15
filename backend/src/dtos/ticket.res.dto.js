export default class TicketResDto {
    constructor(ticket) {
        this._id = ticket._id?.toString();
        this.code = ticket.code;
        this.purchase_datetime = ticket.purchase_datetime;
        this.amount = ticket.amount;
        this.purchaser = ticket.purchaser;
    };
};