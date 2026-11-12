import mongoose, { Schema, Types } from 'mongoose';

export interface VideoDocument extends mongoose.Document {
  name: string;
  video: string;
  mediaType: string;
  description?: string;
  videoPartner?: Types.ObjectId;
  likeCount: number;
  likedBy: Types.ObjectId[];
  savesCount: number;
  savedBy: Types.ObjectId[];
}

const videoSchema = new Schema<VideoDocument>({
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
  videoPartner: {
    type: Schema.Types.ObjectId,
    ref: 'videopartner',
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

export default mongoose.model<VideoDocument>('video', videoSchema);
