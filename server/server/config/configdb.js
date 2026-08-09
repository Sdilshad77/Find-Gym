import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        let conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`DB CONNECTION SUCCESS : ${conn.connection.name}`.bgGreen.black)
    } catch (error) {
        console.log(`DB CONNETION FAILED : ${error.message}`.bgRed.white)
    }
}

