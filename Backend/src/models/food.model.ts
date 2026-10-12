import mongoose, { Schema, Types } from 'mongoose';

export interface FoodDocument extends mongoose.Document {
  name: string;
  video: string;
  mediaType: string;
  description?: string;
  foodPartner?: Types.ObjectId;
  likeCount: number;
  savesCount: number;
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
  savesCount: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model<FoodDocument>('food', foodSchema);
