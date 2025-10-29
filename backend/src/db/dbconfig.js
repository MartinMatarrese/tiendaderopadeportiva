import mongoose from "mongoose"
import "dotenv/config";
console.log('Variables de entorno cargadas:', {
  MONGO_URL: process.env.MONGO_URL,
  NODE_ENV: process.env.NODE_ENV
});
export const initMongoDB = async() => {
    try {
        const mongoUrl = process.env.MONGO_URL;
        await mongoose.connect(mongoUrl);
    } catch(error) {
        throw new Error(error)
    }
};