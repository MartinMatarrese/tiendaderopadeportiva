import ticketModel from "./models/ticket.model.js";
import MongoDao from "./mongo.dao.js";

class TicketDaoMongo extends MongoDao {
    constructor() {
        super(ticketModel)
    };

    findById = async(id) => {
        try {
            return ticketModel.findById(id)
        } catch (error) {
            throw new Error(`Error al buscar el ticket por id: ${error.message}`);
        };
    };
};

export const ticketDao = new TicketDaoMongo();