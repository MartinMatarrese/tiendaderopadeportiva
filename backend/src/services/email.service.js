import { tranporter } from "../config/gmail.config.js";
import { templateHtmlGmail } from "./template.service.js"

export const sendGmail = async(ticket, usuarioEmail) => {
    try {
        const mailConfig = {
            from: process.env.EMAIL,
            to: usuarioEmail,
            subject: `Tu compra en Tienda de Ropa deportiva  - orden ${ticket.code}`,
            html: templateHtmlGmail()
        };
        const response = await tranporter.sendGmail(mailConfig);
        res.json(response);
    } catch (error) {
        throw new Error(`Error al enviar el mail con la compra: ${error.message}`);
    };
};