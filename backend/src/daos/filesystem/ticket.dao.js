import fs from "fs";
import { v4 as uuidv4 } from "uuid";

class TicketDaoFs {
    constructor(path) {
        this.path = path
    };

    getAll = async() => {
        try {
            if(fs.existsSync(this.path)) {
                const tickets = await fs.promises.readFile(this.path, "utf-8");
                return JSON.parse(tickets);
            }
            return [];
        } catch(error) {
            throw new Error(`Error al leer los tickets: ${error.message}`);
        }
    };

    create = async(obj) => {
        try {
            const tickets = await this.getAll();
            const newTicket = {
                id: uuidv4(),
                code: obj.code,
                purchese_datetime: obj.purchese_datetime || new Date().toISOString(),
                amount: obj.amount,
                purchaser: obj.purchaser
            };
            const ticketExist = tickets.find(ticket => ticket.code === newTicket.code);
            if(ticketExist) throw new Error("El código del ticket ya existe");
            tickets.push(newTicket);
        } catch (error) {
            throw new Error(`Error al crear el ticket: ${error.message}`);
        };
    };

    getById = async(id) => {
        try {
            const tickets = await this.getAll();
            const ticket = tickets.find(ticket => ticket.id === id);
            return ticket || null;
        } catch(error) {
            throw new Error(`Error al buscar el ticket: ${error.message}`);
        };
    };
};

export const ticketDao = new TicketDaoFs("./src/tickets.json");