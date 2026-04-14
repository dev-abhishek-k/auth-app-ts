import mongoose from "mongoose";
const connectDB = async (): Promise<void> => {
    try {
        if(!process.env.MONGO_URI) throw new Error("MONGO_URI is not defined"); 
        const conn = await mongoose.connect(process.env.MONGO_URI as string);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }

}

export default connectDB