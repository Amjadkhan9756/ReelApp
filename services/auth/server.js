import express from "express"
import connectDB from "../../services/src/db/db";

const app=express();
connectDB();



app.listen(3000,()=>{
    console.log("server are running on 3000")
});

