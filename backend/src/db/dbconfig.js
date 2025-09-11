import mongoose from "mongoose"
import "dotenv/config";

export const initMongoDB = async() => {
    try {
        const mongoUrl = process.env.MONGO_URL || process.env.MONGO_DOCKER;
        await mongoose.connect(mongoUrl);
    } catch(error) {
        throw new Error(error)
    }
};