import mongoose from "mongoose"
import "dotenv/config";

export const initMongoDB = async() => {
    const env = process.env.NODE_ENV || "development"
    const test = process.env.MONGO_URL_TEST;
    const local = process.env.MONGO_URL_LOCAL;
    const production = process.env.MONGO_URL;
    
    let mongoUrl;
    
    if(env === "test") {
        mongoUrl = test;
        if(!mongoUrl) {
            throw new Error("MONGO_URL_TEST no definida para entotno de test");
        };
        console.log("Conectando a base de datos de TEST:", mongoUrl);        
    } else if(env === "production") {
        mongoUrl = production;
        if(!mongoUrl) {
            throw new Error("MONGO_URL no definida en producción");            
        }
        console.log("Conectando a base de datos de PRODUCCIÓN");        
    } else {
        mongoUrl = local;
        if(!mongoUrl) {
            throw new Error("MONGO_URL_LOCAL no definida para desarrollo");            
        };
        console.log("Conectando a base de datos de desarrollo");
    };

    try {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        };

        await mongoose.connect(mongoUrl, options)
        console.log(`MongoDB conectado (${env})`);
        
    } catch (error) {
        console.error("Error conectando a MongoDB:", error.message);
        throw new Error("Error conectando a MongoDB:", error.message);
                
    }
    
    // if(!mongoUrl) {
    //     throw new Error (`MongoDB URL no definida por ${isProduction ? "production" : "development"} enviorenment`);
    // }

    // try {
        
    //     await mongoose.connect(mongoUrl);
    // } catch(error) {
    //     throw error
    // };
};