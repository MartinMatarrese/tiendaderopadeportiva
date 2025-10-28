import "dotenv/config";
import { createTransport } from "nodemailer";

const getEmailConfig = () => {
    const isProduction = process.env.NODE_ENV === "production";
    if(isProduction) {
        return {
            service: "gmail",
            auth: {
                user:process.env.EMAIL,
                pass: process.env.PASSWORD
            }     
        };
    } else {
        return {
            host: process.env.HOST_MAILTROP,
            port: process.env.PORT_MAILTROP,
            auth: {
                user: process.env.USER_MAILTROP,
                pass: process.env.PASSWORD_MAILTROP        
            },
            tls: {
                rejectUnauthorized: false
            }
        }
    }
}
export const transporter = createTransport(getEmailConfig());

export const sendMail = async(to, subject, html) => {
    const isProduction = process.env.NODE_ENV === "production";
    try {
        const fromEmail = isProduction ? 
        `"Tienda de Ropa deportiva" <${process.env.EMAIL}>`
        : `"Tienda de Ropa deportiva" <no-reply@tiendaderopadeportiva.com`
        const info = await transporter.sendMail({
            from: fromEmail,
            to,
            subject,
            html
        });
        console.log("Email enviado exitosamente a:", to);
        console.log("Message ID:", info.messageId);       
        return info;
    } catch (error) {
        console.error("Error enviando el mail:");
        console.error("Para: ", to);
        console.error("Error:", error.message);
        if(!isProduction) {
            console.log("MODO DE DESARROLLO - Simulando envío exitoso");
            return {
                messageId: "simulted-message-id" + Date.now(),
                simulated: true
            }
            
        }
        throw new Error(`No se pudo enviar el email ${error.message}`)
    };
};