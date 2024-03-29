
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(conn.connection.host);
    } catch (err) {
        console.log(err.message)
        process.exit(1);
    }
};

export default connectDB;
