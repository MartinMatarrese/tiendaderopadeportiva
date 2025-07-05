import { ticketRepository } from "../repository/ticket.repository.js";
import Services from "./service.manager.js";

class TicketService extends Services {
    constructor() {
        super(ticketRepository)
    };

    createTicket = async(ticketData) => {
        try {
            const ticket = await ticketRepository.create(ticketData);
            return ticket;
        }catch(error) {
            throw new Error(`Error al crear el ticket ${error.message}`);
        }
    };

};

export const ticketService = new TicketService();