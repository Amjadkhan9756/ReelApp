import { Router, type RequestHandler } from 'express';
import multer from 'multer';
import { videoController } from '../controllers/video.controller.js';
import {
    authVideoPartnerMiddleware,
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

// POST /api/video
router.post(
    "/",
    authVideoPartnerMiddleware,
    uploadMedia,
    videoController.createVideo
);

// GET /api/video   
router.get(
    "/",
    videoController.getVideoItems
);

router.post(
    "/like",
    authUserMiddleware,
    videoController.likeVideo
);

router.get(
    "/save",
    authUserMiddleware,
    videoController.getSavedVideos
);

router.post(
    "/save",
    authUserMiddleware,
    videoController.toggleSaveVideo
);

export default router;