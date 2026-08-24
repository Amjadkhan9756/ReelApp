const mongoose =require("mongoose");

async function connectDB() {
    if (mongoose.connection.readyState === 1) return;
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI is required");
    try {
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    } catch (error) {
        if (process.env.VERCEL) throw error;
        await mongoose.connect("mongodb://127.0.0.1:27017/food-view", { serverSelectionTimeoutMS: 5000 });
        console.log("mongoDB connected using local development fallback");
        return;
    }
    console.log("mongoDB connected");
}
module.exports=connectDB;
// export default connectDB;