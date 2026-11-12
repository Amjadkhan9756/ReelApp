import mongoose, { Schema, Types } from 'mongoose';

interface SaveDocument extends mongoose.Document {
  user: Types.ObjectId;
  video: Types.ObjectId;
}

const saveSchema = new Schema<SaveDocument>({
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

export default mongoose.model<SaveDocument>('save', saveSchema);
