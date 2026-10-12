import mongoose, { Schema, Types } from 'mongoose';

interface SaveDocument extends mongoose.Document {
  user: Types.ObjectId;
  food: Types.ObjectId;
}

const saveSchema = new Schema<SaveDocument>({
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

export default mongoose.model<SaveDocument>('save', saveSchema);
