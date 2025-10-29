import { Server } from "socket.io";
import app from "./app.js";

const PORT = 8080;
const server = app.listen(PORT, () => {
    console.log("server on port", PORT);    
});

const io = new Server(server);

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