import mongoose, { Schema, Types } from 'mongoose';

interface LikeDocument extends mongoose.Document {
  user: Types.ObjectId;
  food: Types.ObjectId;
}

const likeSchema = new Schema<LikeDocument>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  food: {
    type: Schema.Types.ObjectId,
    ref: 'food',
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model<LikeDocument>('like', likeSchema);
