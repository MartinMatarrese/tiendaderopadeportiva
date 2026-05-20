import mongoose from "mongoose"
import "dotenv/config";

export const initMongoDB = async() => {
    const local = process.env.MONGO_URL_LOCAL;
    const url = process.env.MONGO_URL;
    const env = process.env.NODE_ENV || "development";
    const isProduction = env === "production";
    const mongoUrl = isProduction ? url : local
    
    if(!mongoUrl) {
        throw new Error (`MongoDB URL no definida por ${isProduction ? "production" : "development"} enviorenment`);
    }
    // const isDevelopment = env === "development";
    try {
        // const mongoUrl = process.env.MONGO_URL;
        
        await mongoose.connect(mongoUrl);
    } catch(error) {
        throw error
    };
};