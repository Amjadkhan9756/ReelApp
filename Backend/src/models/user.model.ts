import mongoose, { Schema } from 'mongoose';

export interface UserDocument extends mongoose.Document {
  fullName: string;
  email: string;
  password: string;
}

const userSchema = new Schema<UserDocument>({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model<UserDocument>('user', userSchema);
