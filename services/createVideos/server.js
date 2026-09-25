require("dotenv").config();   // ✅ ADD THIS LINE FIRST

const app = require("./src/app.js");
const connectDB = require("./src/db/db.js");

connectDB()
    .then(() => {
        app.listen(4000, () => {
            console.log("server is connected");
        });
    })
    .catch(() => {
        process.exitCode = 1;
    });



    // this is for create file for videos creater 