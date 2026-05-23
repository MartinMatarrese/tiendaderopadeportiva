import cors from "cors";

const isProductuion = process.env.NODE_ENV === "production"

export const corsOptions = {
    origin: function(origin, callback) {
        if(!origin) {
            return callback(null, true)
        };

        if(!isProductuion) {
            return callback(null, true);
        };

        const productionOrigin = [
            "http://localhost:3000",
            "http://192.168.0.7:3000",
            "https://martinmatarrese.github.io",
            "https://martinmatarrese.github.io/tiendaderopadeportiva",
        ]

        if(productionOrigin.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error("No permitido por CORS"));
        };
    },
    credentials: true,
    optionsSuccessStatus: 200
};

export const corsMiddleware = cors(corsOptions);