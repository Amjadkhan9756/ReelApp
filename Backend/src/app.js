const express =require("express");
const cookieParser=require("cookie-parser");
const foodRoutes = require("./routes/food.routes.js");
const authRoutes=require("./routes/auth.routes.js")
const foodPartnerRoutes = require("./routes/food-partner.routes.js");
const cors = require("cors");
const path = require("path");
const app=express();

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim());

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/videos', express.static(path.join(__dirname, '../videos')));

app.get("/",(req,res)=>{
    res.send("hello  world"); 
});
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/food-partner', foodPartnerRoutes);
















module.exports=app;