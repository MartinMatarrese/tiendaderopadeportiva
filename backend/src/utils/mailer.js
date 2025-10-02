import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

export const sendMail = async(to, subject, html) => {
    try {
        await transporter.sendMail({
            from: `"Tienda de ropa deportiva" <${process.env.EMAIL}`,
            to,
            subject,
            html
        });
    } catch (error) {
        throw new Error(error)
    }
}