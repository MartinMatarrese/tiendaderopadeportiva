import { Server } from "socket.io";
import app from "./app.js";
import "dotenv/config";

console.log("=== 🔍 DEBUG ENVIRONMENT ===");
console.log("PERSISTENCE:", process.env.PERSISTENCE);
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✅ SET" : "❌ MISSING");
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "✅ SET" : "❌ MISSING");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PORT:", process.env.PORT);
console.log("Todas las variables:", Object.keys(process.env).filter(key => key.includes('SECRET') || key.includes('MONGO') || key.includes('PERSISTENCE')));
console.log("=== 🔍 END DEBUG ===");

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