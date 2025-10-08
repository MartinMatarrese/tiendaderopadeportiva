import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
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
            from: `"Tienda de ropa deportiva" <${process.env.EMAIL}>`,
            to,
            subject,
            html
        });

        return info;
        
    } catch (error) {    
        throw new Error(`No se pudo enviar el email: ${error.message}`);
    };
};