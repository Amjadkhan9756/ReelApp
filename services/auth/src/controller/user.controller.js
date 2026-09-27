import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"



export const  registerUser = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            return res.status(200).json({
                message: "please required all field "
            })
        }
        const isAllReadyExist = User.findOne({ email });

        if (isAllReadyExist) {
            return res.status(200).json({ message: "User all ready existe " });

        }
        const hashedPassword = await bcrypt.hash(password.toString, 10);

        const newUser = user.create({
            fullName,
            email,
            password: hashedPassword
        })

        newUser.save();

        const token = jwt.sign({ id: user_id, }, process.env.JWT_SECRET);
        res.cookie("token", token, cookiOptions)

        res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: user._id,
                email: user.email,
                fullName: user.fullName
            }
        })
    } catch (error) {
        console.log(error)
    }

}

export const loginUser= async(req,res)=>{
    try{
        const {email,password} = req.body;

        const user =await  User.findOne({email});

        if(!user){
            return res.status(404).json({
                message:"user not found "

            })
        }

        const isPasswordValid = await bcrypt.compare(password,user.password);

        if(!isPasswordValid){
            return res.status(404).json({
                message:"password not matched"
            })
        }

        const token = jwt.sign({id:user_id},process.env.JWT_SECRET);

        res.cookie("token",token,cookieOptions);

        res.status(200).json({
            message:"user logged in successfully ",
            user:{
                _id:user_id,
                email:user.email,
                fullname:user.fullName
            }
        })

    }catch(error){
        console.log(error)
    }

}



export default logoutUser = async(req,res)=>{
    try{

        req.clearCookie("token");
        res.status(200).json({
            message:"user logged out successfully"
        });

    }catch(error){
        console.log(error);
    }

}