import "dotenv/config";
import { createTransport } from "nodemailer";

export const transporter = createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

export const sendMail = async(to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Tienda de Ropa deportiva" <${process.env.EMAIL}>`,
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
        if(process.env.NODE_ENV !== "production") {
            console.log("MODO DE DESARROLLO - Simulando envío exitoso");
            return {messageId: "simulted-message-id"}
            
        }
        throw new Error(`No se pudo enviar el email ${error.message}`)
    };
};

// transporter.verify((error, success) => {
//     if(error) {
//         console.log("Error configurando email:", error);        
//     } else {
//         console.log("Servidor de email listo para enviar mensajes"); 
//     }
// })