import mongoose from "mongoose";
import "dotenv/config";
const database = process.env.MONGO_URI;

mongoose.set("strictQuery", true);

const connectDatabase = async () => {
    try {
        await mongoose.connect(database);
        console.log("Kết nối MongoDB thành công");
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

export default connectDatabase;