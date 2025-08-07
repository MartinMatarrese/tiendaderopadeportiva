import { transporter } from "../config/gmail.config.js";
import { templateHtmlGmail } from "./template.service.js"

export const sendGmail = async(ticket, email, products) => {
    try {
        const mailConfig = {
            from: process.env.EMAIL,
            to: email,
            subject: `Tu compra en Tienda de Ropa deportiva  - orden ${ticket.code}`,
            html: templateHtmlGmail(products, ticket, email)
        };
        const response = await transporter.sendMail(mailConfig);
        return response;
    } catch (error) {
        throw new Error(`Error al enviar el email con la compra: ${error.message}`);
    };
};