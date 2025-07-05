// import express from "express";
// import { Server } from "socket.io";
// import { __dirname } from "./patch.js";
// import productRouter from "./routes/products.routes.js";
// import cartRouter from "./routes/carts.routes.js";
// import MongoStore from "connect-mongo";
// import cookieParser from "cookie-parser";
// import session from "express-session";
// import usersRoutes from "./routes/users.routes.js";
// import passport from "passport";
// import "./passport/gmail.strategy.js";
// import { errorHandler } from "./middlewares/errorhandler.js";
// import cors from "cors";
// import { create } from "express-handlebars";
// import path from "path";
// import { reqLog } from "./middlewares/rqlog.js";
// import paymentRouter from "./routes/payment.routes.js";
// import swaggerJSDoc from "swagger-jsdoc";
// import swaggerUI from "swagger-ui-express";
// import { info } from "./docs/info.js";
// import chatRouter from "./routes/chat.router.js";

import { Server } from "socket.io";
import app from "./app.js";


// const app = express();
// const hbs = create();
const PORT = 8080;
// const specs = swaggerJSDoc(info);
const server = app.listen(PORT, () => {
    console.log("server on port", PORT);    
})

// const storeConfig = {
//     store: MongoStore.create({
//         mongoUrl: process.env.MONGO_URL,
//         crypto: {secret: process.env.SECRET_KEY},
//         ttl: 160
//     }),
//     secret: process.env.SECRET_KEY,
//     resave: true,
//     saveUninitialized: true,
//     cookie: { maxAge: 160000 }
// };

const io = new Server(server)

// app.use("/docs", swaggerUI.serve, swaggerUI.setup(specs))

// app.use(cors());

// app.use(express.json());

// app.use(express.urlencoded({extended: true}));

// app.use(reqLog)

// app.use(cookieParser());

// app.use(session(storeConfig));

// //Uso de handlebars
// app.engine("handlebars", hbs.engine);
// app.set("view engine", "handlebars");
// app.set("views", path.join(__dirname, "views"))
// //
// app.use("/public", express.static(__dirname + "/public"));

// app.use(passport.initialize());

// app.use(passport.session());
// //Uso de handlebars
// app.use((req, res, next) => {
//     if(req.method === "POST" && req.body.token) {
//         req.headers["authorization"] = `Bearer ${req.body.token}`;
//     };
//     next();
// });
// app.get("/", (req, res) => {
//     res.render("index", { title: "Inicio"});
// });
// //

// app.use("/users", usersRoutes);

// app.use("/api/products", productRouter);

// app.use("/api/carts", cartRouter);

// app.use("/api/payments", paymentRouter);

// app.use("/api/chat", chatRouter);


// app.get("/", (req, res) => {
//     res.status(200).send("Ok");
// });

// app.use(errorHandler);

let mensajes = [];

io.on("connection", (socket) => {
    console.log("Usuario conectado: ", socket.id);
    socket.on("mensaje", (data) => {
        console.log("Mensaje recibido: ", data);
        mensajes.push(data);
        socket.emit("respuesta", mensajes)        
    })
    socket.on("disconnect", () => {
        console.log("Usuario desconectad: ", socket.id);        
    })
    
});