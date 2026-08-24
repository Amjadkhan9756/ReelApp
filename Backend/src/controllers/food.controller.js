const foodModel = require("../models/food.model.js");
const storageService = require('../services/storage.service.js');
const { randomUUID } = require("crypto");

async function createFood(req, res) {
    try {
        // 1️⃣ Check foodPartner
        if (!req.foodPartner) {
            return res.status(401).json({ message: "Unauthorized: Food partner not found" });
        }

        // 2️⃣ Check file
        if (!req.file) {
            return res.status(400).json({ message: "Image/video file required" });
        }

        // 3️⃣ Upload file
        const extension = req.file.originalname.includes(".")
            ? req.file.originalname.slice(req.file.originalname.lastIndexOf(".")).toLowerCase()
            : "";
        const filename = `${randomUUID()}${extension}`;
        const fileUploadResult = await storageService.uploadFile(req.file.buffer, filename);

        // 4️⃣ Create food item in DB
        const foodItem = await foodModel.create({
            name: req.body.name,
            description: req.body.description,
            video: fileUploadResult.url,
            mediaType: req.file.mimetype,
            foodPartner: req.foodPartner._id
        });

        // 5️⃣ Respond correctly
        return res.status(201).json({
            message: "Food created successfully",
            food: foodItem
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
}



async function getFoodItems(req, res) {
    const foodItems = await foodModel.find({})
    res.status(200).json({
        message: "Food items fetched successfully",
        foodItems
    })
}






async function likeFood(req, res) {
    const { foodId } = req.body;
    const foodItem = await foodModel.findById(foodId);
    if (!foodItem) {
        return res.status(404).json({ message: "Food not found" });
    }

    foodItem.likeCount = (foodItem.likeCount || 0) + 1;
    await foodItem.save();

    return res.status(200).json({
        message: "Food liked",
        like: true,
        food: foodItem
    });
}

async function getSavedFoods(req, res) {
    const savedFoods = await foodModel.find({ savesCount: { $gt: 0 } });
    return res.status(200).json({
        message: "Saved foods fetched successfully",
        savedFoods: savedFoods.map((food) => ({ food }))
    });
}

async function toggleSaveFood(req, res) {
    const { foodId } = req.body;
    const foodItem = await foodModel.findById(foodId);
    if (!foodItem) {
        return res.status(404).json({ message: "Food not found" });
    }

    const isSaved = (foodItem.savesCount || 0) === 0;
    foodItem.savesCount = isSaved ? (foodItem.savesCount || 0) + 1 : Math.max(0, foodItem.savesCount - 1);
    await foodItem.save();

    return res.status(200).json({
        message: isSaved ? "Food saved" : "Food unsaved",
        save: isSaved,
        food: foodItem
    });
}

module.exports = {
    createFood,
    getFoodItems,
    likeFood,
    getSavedFoods,
    toggleSaveFood
};