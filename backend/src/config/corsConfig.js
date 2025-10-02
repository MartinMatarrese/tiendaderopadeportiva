import cors from "cors";

const alloweredOrigins = [
    "http://localhost:3000",
    "https://martinmatarrese.github.io"
];

export const corsOptions = {
    origin: function(origin, callback) {
        if(!origin || alloweredOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("No permitido por CORS"));
        };
    },
    credentials: true
};

export const corsMiddleware = cors(corsOptions);