import { prodDao as prodDaoMongo } from "./mongodb/product.dao.js";
import { cartDao as cartDaoMongo } from "./mongodb/cart.dao.js";
import { ticketDao as ticketDaoMongo } from "./mongodb/ticket.dao.js";
import {userDao as UserDaoMongo } from "./mongodb/user.dao.js";
import { paymentDao as paymentDaoMongo} from "./mongodb/payment.dao.js";
import { initMongoDB } from "../db/dbconfig.js";

await initMongoDB()
        .then(() => console.log("Base de datos conectada"))
        .catch((error) => {
            console.log("Error al conectar a MongoDB:", error)
            process.exit(1);
        });

export default { 
    prodDao: prodDaoMongo,
    cartDao: cartDaoMongo,
    ticketDao: ticketDaoMongo, 
    userDao: UserDaoMongo,
    paymentDao: paymentDaoMongo
};