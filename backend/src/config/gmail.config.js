import "dotenv/config";
import { createTransport } from "nodemailer";

export const tranporter = createTransport({
    service: "gmail",
    secure: true,
    port: process.env.PORT_GMAIL,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
}); 