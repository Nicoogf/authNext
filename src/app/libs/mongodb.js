import mongoose from "mongoose";

const MONGO_URL = "mongodb://localhost:27017/authNext";

export const connectMongoDB = async () => {
    try {
        await mongoose.connect(MONGO_URL)
        console.log("Conexion exitosa a la base de datos")
    } catch (error) {
        console.log(error)
    }
};