import mongoose, { Schema, Types } from 'mongoose';

export interface FoodDocument extends mongoose.Document {
  name: string;
  video: string;
  mediaType: string;
  description?: string;
  foodPartner?: Types.ObjectId;
  likeCount: number;
  likedBy: Types.ObjectId[];
  savesCount: number;
  savedBy: Types.ObjectId[];
}

const foodSchema = new Schema<FoodDocument>({
  name: {
    type: String,
    required: true,
  },
  video: {
    type: String,
    required: true,
  },
  mediaType: {
    type: String,
    default: 'video/mp4',
  },
  description: {
    type: String,
  },
  foodPartner: {
    type: Schema.Types.ObjectId,
    ref: 'foodpartner',
  },
  likeCount: {
    type: Number,
    default: 0,
  },
  likedBy: {
    type: [Schema.Types.ObjectId],
    default: [],
  },
  savesCount: {
    type: Number,
    default: 0,
  },
  savedBy: {
    type: [Schema.Types.ObjectId],
    default: [],
  },
});

export default mongoose.model<FoodDocument>('food', foodSchema);
