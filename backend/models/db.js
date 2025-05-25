import mongoose from "mongoose";
import { config } from "dotenv";

const connectDB = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connected to db ✅")
}

export default connectDB;