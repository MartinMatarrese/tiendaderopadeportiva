import ticketModel from "./models/ticket.model.js";
import MongoDao from "./mongo.dao.js";

class TicketDaoMongo extends MongoDao {
    constructor() {
        super(ticketModel)
    };
};

export const ticketDao = new TicketDaoMongo();