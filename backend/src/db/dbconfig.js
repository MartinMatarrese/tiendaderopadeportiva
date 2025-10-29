import mongoose from "mongoose"
import "dotenv/config";

console.log('Variables de entorno cargadas:', {
  MONGO_URL: process.env.MONGO_URL,
  NODE_ENV: process.env.NODE_ENV,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  SECRET_KEY: process.env.SECRET_KEY
});

export const initMongoDB = async() => {
    try {
        const mongoUrl = process.env.MONGO_URL;
        await mongoose.connect(mongoUrl);
    } catch(error) {
        throw new Error(error)
    }
};