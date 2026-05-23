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