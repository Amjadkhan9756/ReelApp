const mongoose =require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        console.log("mongoDB connected");
    } catch (error) {
        console.error("Configured MongoDB connection failed:", error.message);
        try {
            await mongoose.connect("mongodb://127.0.0.1:27017/food-view", { serverSelectionTimeoutMS: 5000 });
            console.log("mongoDB connected using local fallback");
        } catch (fallbackError) {
            console.error("Local MongoDB connection failed:", fallbackError.message);
            throw fallbackError;
        }
    }
}
module.exports=connectDB;
// export default connectDB;