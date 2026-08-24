const userModel = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const foodPartnerModel = require("../models/foodpartner.model.js");

const cookieOptions = process.env.NODE_ENV === "production"
    ? { httpOnly: true, secure: true, sameSite: "none" }
    : { httpOnly: true, sameSite: "lax" };



async function registerUser(req, res) {

    const { fullName, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        email
    })

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "User already exists"
        })
    }

const hashedPassword = await bcrypt.hash(password.toString(), 10);
    const user = await userModel.create({
        fullName,
        email,
        password: hashedPassword
    })

    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token, cookieOptions)

    res.status(201).json({
        message: "User registered successfully",
        user: {
            _id: user._id,
            email: user.email,
            fullName: user.fullName
        }
    })

}



async function loginUser(req, res) {

    const { email, password } = req.body;

    const user = await userModel.findOne({
        email
    })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token, cookieOptions)

    res.status(200).json({
        message: "User logged in successfully",
        user: {
            _id: user._id,
            email: user.email,
            fullName: user.fullName
        }
    })
}
function logoutUser(req, res) {
    res.clearCookie("token");
    res.status(200).json({
        message: "user logged out successfully "
    });

}


async function registerFoodPartner(req, res) {
    try {

    const { name, email, password, phone, address, contactName } = req.body;
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!name?.trim() || !contactName?.trim() || !phone?.trim() || !address?.trim() || !normalizedEmail || !password) {
        return res.status(400).json({ message: "All registration fields are required" });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const isAccountAlreadyExists = await foodPartnerModel.findOne({
        email: normalizedEmail
    })

    if (isAccountAlreadyExists) {
        return res.status(400).json({
            message: "This email is already registered. Please sign in or use another email."
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const foodPartner = await foodPartnerModel.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        phone,
        address,
        contactName
    })

    const token = jwt.sign({
        id: foodPartner._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token, cookieOptions)

    return res.status(201).json({
        message: "Food partner registered successfully",
        foodPartner: {
            _id: foodPartner._id,
            email: foodPartner.email,
            name: foodPartner.name,
            address: foodPartner.address,
            contactName: foodPartner.contactName,
            phone: foodPartner.phone
        }
    });
    } catch (error) {
        console.error("Food partner registration error:", error.message);
        return res.status(503).json({ message: "Database unavailable. Please start MongoDB and try again." });
    }

}




async function loginFoodPartner(req, res) {
    try {

    const { email, password } = req.body;
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!normalizedEmail || typeof password !== "string" || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const foodPartner = await foodPartnerModel.findOne({
        email: normalizedEmail
    })

    if (!foodPartner) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, foodPartner.password);

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign({
        id: foodPartner._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token, cookieOptions)

    return res.status(200).json({
        message: "Food partner logged in successfully",
        foodPartner: {
            _id: foodPartner._id,
            email: foodPartner.email,
            name: foodPartner.name
        }
    });
    } catch (error) {
        console.error("Food partner login error:", error.message);
        return res.status(503).json({ message: "Database unavailable. Please start MongoDB and try again." });
    }
}

function logoutFoodPartner(req, res) {
    res.clearCookie("token");
    res.status(200).json({
        message: "Food partner logged out successfully"
    });
}

async function getSession(req, res) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ authenticated: false });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select("_id email fullName");
        if (user) return res.status(200).json({ authenticated: true, role: "user", account: user });

        const foodPartner = await foodPartnerModel.findById(decoded.id).select("_id email name");
        if (foodPartner) return res.status(200).json({ authenticated: true, role: "food-partner", account: foodPartner });
        return res.status(401).json({ authenticated: false });
    } catch (err) {
        return res.status(401).json({ authenticated: false });
    }
}



module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner,
    getSession
}