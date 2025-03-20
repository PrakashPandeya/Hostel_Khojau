import mongoose from "mongoose";
import { config } from "dotenv";

const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_CONN);
    console.log("connected to db ✅")
}

export default connectDB;