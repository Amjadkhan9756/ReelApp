import { randomUUID } from 'node:crypto';
import type { RequestHandler } from 'express';
import { Types } from 'mongoose';
import videoModel, { type VideoDocument } from '../models/video.model.js';
import storageService from '../services/storage.service.js';

interface CreateVideoBody {
  name: string;
  description?: string;
}

interface VideoIdBody {
  videoId: string;
}

interface ToggleLikeBody extends VideoIdBody {
  like?: boolean;
}

interface ToggleSaveBody extends VideoIdBody {
  save?: boolean;
}

interface MessageResponse {
  message: string;
  error?: string;
}

interface LikeResponse extends MessageResponse {
  like: boolean;
  video: VideoDocument;
}

interface SaveResponse extends MessageResponse {
  save: boolean;
  video: VideoDocument;
}

interface VideoCreatedResponse extends MessageResponse {
  video: VideoDocument;
}

interface VideoItemsResponse extends MessageResponse {
  videoItems: VideoDocument[];
}

interface SavedVideosResponse extends MessageResponse {
  savedVideos: Array<{ video: VideoDocument }>;
}

type VideoResponse =
  | MessageResponse
  | LikeResponse
  | SaveResponse
  | VideoCreatedResponse
  | VideoItemsResponse
  | SavedVideosResponse;

const createVideo: RequestHandler<Record<string, string>, VideoResponse, CreateVideoBody> = async (req, res) => {
  if (!req.videoPartner) {
    res.status(401).json({ message: 'Unauthorized: Video partner not found' });
    return;
  }

  if (!req.file) {
    res.status(400).json({ message: 'Image/video file required' });
    return;
  }

  if (typeof req.body.name !== 'string' || !req.body.name.trim()) {
    res.status(400).json({ message: 'A post name is required' });
    return;
  }

  const extension = req.file.originalname.includes('.')
    ? req.file.originalname.slice(req.file.originalname.lastIndexOf('.')).toLowerCase()
    : '';
  const filename = `${randomUUID()}${extension}`;
  const fileUploadResult = await storageService.uploadFile(req.file.buffer, filename);

  const videoItem = await videoModel.create({
    name: req.body.name,
    ...(req.body.description === undefined ? {} : { description: req.body.description }),
    video: fileUploadResult.url,
    mediaType: req.file.mimetype,
    videoPartner: req.videoPartner._id,
  });

  res.status(201).json({
    message: 'Video created successfully',
    video: videoItem,
  });
};

const getVideoItems: RequestHandler<Record<string, string>, VideoResponse, unknown> = async (_req, res) => {
  const videoItems = await videoModel.find({});
  res.status(200).json({
    message: 'Video items fetched successfully',
    videoItems,
  });
};

const likeVideo: RequestHandler<Record<string, string>, VideoResponse, ToggleLikeBody> = async (req, res) => {
  if (typeof req.body.videoId !== 'string' || !Types.ObjectId.isValid(req.body.videoId)) {
    res.status(400).json({ message: 'Invalid video ID' });
    return;
  }

  const userId = req.user?._id;
  if (!userId) {
    res.status(401).json({ message: 'Please login first' });
    return;
  }

  const videoItem = await videoModel.findById(req.body.videoId);
  if (!videoItem) {
    res.status(404).json({ message: 'Video not found' });
    return;
  }

  const likedBy = Array.isArray(videoItem.likedBy) ? videoItem.likedBy : [];
  const shouldLike = req.body.like !== undefined ? Boolean(req.body.like) : !likedBy.some((id) => id.toString() === userId.toString());

  videoItem.likedBy = shouldLike
    ? [...new Set([...likedBy.map((id) => id.toString()), userId.toString()])].map((id) => new Types.ObjectId(id))
    : likedBy.filter((id) => id.toString() !== userId.toString());

  videoItem.likeCount = videoItem.likedBy.length;
  await videoItem.save();

  res.status(200).json({
    message: shouldLike ? 'Video liked' : 'Video unliked',
    like: shouldLike,
    video: videoItem,
  } satisfies LikeResponse);
};

const getSavedVideos: RequestHandler<Record<string, string>, VideoResponse, unknown> = async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    res.status(401).json({ message: 'Please login first' });
    return;
  }

  const savedVideos = await videoModel.find({ savedBy: userId });
  res.status(200).json({
    message: 'Saved videos fetched successfully',
    savedVideos: savedVideos.map((video) => ({ video })),
  });
};

const toggleSaveVideo: RequestHandler<Record<string, string>, VideoResponse, ToggleSaveBody> = async (req, res) => {
  if (typeof req.body.videoId !== 'string' || !Types.ObjectId.isValid(req.body.videoId)) {
    res.status(400).json({ message: 'Invalid video ID' });
    return;
  }

  const userId = req.user?._id;
  if (!userId) {
    res.status(401).json({ message: 'Please login first' });
    return;
  }

  const videoItem = await videoModel.findById(req.body.videoId);
  if (!videoItem) {
    res.status(404).json({ message: 'Video not found' });
    return;
  }

  const savedBy = Array.isArray(videoItem.savedBy) ? videoItem.savedBy : [];
  const shouldSave = req.body.save !== undefined ? Boolean(req.body.save) : !savedBy.some((id) => id.toString() === userId.toString());

  videoItem.savedBy = shouldSave
    ? [...new Set([...savedBy.map((id) => id.toString()), userId.toString()])].map((id) => new Types.ObjectId(id))
    : savedBy.filter((id) => id.toString() !== userId.toString());

  videoItem.savesCount = videoItem.savedBy.length;
  await videoItem.save();

  res.status(200).json({
    message: shouldSave ? 'Video saved' : 'Video unsaved',
    save: shouldSave,
    video: videoItem,
  } satisfies SaveResponse);
};

export const videoController = {
  createVideo,
  getVideoItems,
  likeVideo,
  getSavedVideos,
  toggleSaveVideo,
};
