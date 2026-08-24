const express = require("express");
const foodController = require("../controllers/food.controller.js");
const authMiddleware = require("../middleware/auth.middleware.js");
const multer = require("multer");

const router = express.Router();

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
        if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
            return callback(null, true);
        }
        return callback(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "media"));
    }
});

function uploadMedia(req, res, next) {
    upload.single("media")(req, res, (error) => {
        if (!error) return next();
        if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
            return res.status(413).json({ message: "Files must be 100MB or smaller" });
        }
        if (error instanceof multer.MulterError && error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(415).json({ message: "Only image and video files are supported" });
        }
        return res.status(400).json({ message: "Could not read the uploaded file" });
    });
}

// POST /api/food
router.post(
    "/",
    authMiddleware.authFoodPartnerMiddleware,
    uploadMedia,
    foodController.createFood
);

// GET /api/food
router.get(
    "/",
    foodController.getFoodItems
);

router.post(
    "/like",
    authMiddleware.authUserMiddleware,
    foodController.likeFood
);

router.get(
    "/save",
    authMiddleware.authUserMiddleware,
    foodController.getSavedFoods
);

router.post(
    "/save",
    authMiddleware.authUserMiddleware,
    foodController.toggleSaveFood
);

module.exports = router;