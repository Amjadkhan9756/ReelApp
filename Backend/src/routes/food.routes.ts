import { Router, type RequestHandler } from 'express';
import multer from 'multer';
import { foodController } from '../controllers/food.controller.js';
import {
    authFoodPartnerMiddleware,
    authUserMiddleware,
} from '../middleware/auth.middleware.js';

const router = Router();
const MAX_MEDIA_SIZE = 20 * 1024 * 1024;

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: MAX_MEDIA_SIZE },
    fileFilter: (_req, file, callback) => {
        if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
            return callback(null, true);
        }
        return callback(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "media"));
    }
});

const uploadMedia: RequestHandler<Record<string, string>, { message: string }, unknown> = (req, res, next) => {
    upload.single("media")(req, res, (error) => {
        if (!error) return next();
        if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
            return res.status(413).json({ message: "Files must be 20MB or smaller" });
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
    authFoodPartnerMiddleware,
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
    authUserMiddleware,
    foodController.likeFood
);

router.get(
    "/save",
    authUserMiddleware,
    foodController.getSavedFoods
);

router.post(
    "/save",
    authUserMiddleware,
    foodController.toggleSaveFood
);

export default router;