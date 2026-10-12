import { randomUUID } from 'node:crypto';
import type { RequestHandler } from 'express';
import { Types } from 'mongoose';
import foodModel, { type FoodDocument } from '../models/food.model.js';
import storageService from '../services/storage.service.js';

interface CreateFoodBody {
  name: string;
  description?: string;
}

interface FoodIdBody {
  foodId: string;
}

interface MessageResponse {
  message: string;
  error?: string;
}

interface LikeResponse extends MessageResponse {
  like: true;
  food: FoodDocument;
}

interface SaveResponse extends MessageResponse {
  save: boolean;
  food: FoodDocument;
}

interface FoodCreatedResponse extends MessageResponse {
  food: FoodDocument;
}

interface FoodItemsResponse extends MessageResponse {
  foodItems: FoodDocument[];
}

interface SavedFoodsResponse extends MessageResponse {
  savedFoods: Array<{ food: FoodDocument }>;
}

type FoodResponse =
  | MessageResponse
  | LikeResponse
  | SaveResponse
  | FoodCreatedResponse
  | FoodItemsResponse
  | SavedFoodsResponse;

const createFood: RequestHandler<Record<string, string>, FoodResponse, CreateFoodBody> = async (req, res) => {
  if (!req.foodPartner) {
    res.status(401).json({ message: 'Unauthorized: Food partner not found' });
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

  const foodItem = await foodModel.create({
    name: req.body.name,
    ...(req.body.description === undefined ? {} : { description: req.body.description }),
    video: fileUploadResult.url,
    mediaType: req.file.mimetype,
    foodPartner: req.foodPartner._id,
  });

  res.status(201).json({
    message: 'Food created successfully',
    food: foodItem,
  });
};

const getFoodItems: RequestHandler<Record<string, string>, FoodResponse, unknown> = async (_req, res) => {
  const foodItems = await foodModel.find({});
  res.status(200).json({
    message: 'Food items fetched successfully',
    foodItems,
  });
};

const likeFood: RequestHandler<Record<string, string>, FoodResponse, FoodIdBody> = async (req, res) => {
  if (typeof req.body.foodId !== 'string' || !Types.ObjectId.isValid(req.body.foodId)) {
    res.status(400).json({ message: 'Invalid food ID' });
    return;
  }

  const foodItem = await foodModel.findById(req.body.foodId);
  if (!foodItem) {
    res.status(404).json({ message: 'Food not found' });
    return;
  }

  foodItem.likeCount = (foodItem.likeCount || 0) + 1;
  await foodItem.save();

  res.status(200).json({
    message: 'Food liked',
    like: true,
    food: foodItem,
  } satisfies LikeResponse);
};

const getSavedFoods: RequestHandler<Record<string, string>, FoodResponse, unknown> = async (_req, res) => {
  const savedFoods = await foodModel.find({ savesCount: { $gt: 0 } });
  res.status(200).json({
    message: 'Saved foods fetched successfully',
    savedFoods: savedFoods.map((food) => ({ food })),
  });
};

const toggleSaveFood: RequestHandler<Record<string, string>, FoodResponse, FoodIdBody> = async (req, res) => {
  if (typeof req.body.foodId !== 'string' || !Types.ObjectId.isValid(req.body.foodId)) {
    res.status(400).json({ message: 'Invalid food ID' });
    return;
  }

  const foodItem = await foodModel.findById(req.body.foodId);
  if (!foodItem) {
    res.status(404).json({ message: 'Food not found' });
    return;
  }

  const isSaved = (foodItem.savesCount || 0) === 0;
  foodItem.savesCount = isSaved ? (foodItem.savesCount || 0) + 1 : Math.max(0, foodItem.savesCount - 1);
  await foodItem.save();

  res.status(200).json({
    message: isSaved ? 'Food saved' : 'Food unsaved',
    save: isSaved,
    food: foodItem,
  } satisfies SaveResponse);
};

export const foodController = {
  createFood,
  getFoodItems,
  likeFood,
  getSavedFoods,
  toggleSaveFood,
};
