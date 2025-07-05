import persistence from "../daos/persistence.js";
import TicketReqDto from "../dtos/ticket.req.dto.js";
import TicketResDto from "../dtos/ticket.res.dto.js";

const { ticketDao } = persistence

class TicketRepository {
    constructor() {
        this.dao = ticketDao
    };
    
    getAll = async() => {
        try {
            const tickets = await this.dao.getAll();
            return tickets.map(ticket => new TicketResDto(ticket));
        } catch (error) {
            throw new Error(`Error al obtener tickets: ${error.message}`);
        };
    };

    getById = async(id) => {
        try {
            const ticket = await this.dao.getById(id);
            if(!ticket) return null
            return new TicketResDto(ticket);
        } catch (error) {
            throw new Error(`Error al buscar el ticket: ${error.message}`);
        };
    };

    create = async(ticketData) => {
        try {
            const ticketDto = new TicketReqDto(ticketData);
            const newTicket = await this.dao.create(ticketDto);
            return new TicketResDto(newTicket);
        } catch(error) {
            throw new Error(`Error al crear el ticket: ${error.message}`);
        };
    };
};

export const ticketRepository = new TicketRepository();