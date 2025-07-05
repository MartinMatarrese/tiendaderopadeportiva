export const info = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API - Tienda de Ropa Deportiva",
            version: "1.0.0",
            description: "API REST para una tienda de ropa deportiva. Funcionalidades: Registro e inicio de sesión de usuarios (incluye JWT y Passport con Google), Manejo de productos y categorías, Carrito de compras, Integración con Mercado Pago, Emisión de tickets de compra, Envío de emails con detalles de compra, Logs del sistema con log4js, Tecnologías: Node.js, Express.js, MongoDB, Mongoose, Swagger, Socket.io, MercadoPago, Nodemailer, Passport, JWT"
        },
        servers: [
            {
                url: "http://localhost:8080/"
            }
        ]
    },
    apis: ["./src/docs/*.yml"]
}; 