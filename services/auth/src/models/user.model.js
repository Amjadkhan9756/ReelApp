import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName:{
        type:string,
        require:true

    },
    email:{
        type:string,
        require:true,
        unique:true

    },
    password:{
        type:string,
        require:true,

    }
},{
    timestamps:true
});


const userModel = mongoose.model("userModel",userSchema);

export default userModel;