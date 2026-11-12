import mongoose, { Schema, Types } from 'mongoose';

interface LikeDocument extends mongoose.Document {
  user: Types.ObjectId;
  video: Types.ObjectId;
}

const likeSchema = new Schema<LikeDocument>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  video: {
    type: Schema.Types.ObjectId,
    ref: 'video',
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model<LikeDocument>('like', likeSchema);
