import mongoose, { Schema } from 'mongoose';

export interface FoodPartnerDocument extends mongoose.Document {
  name: string;
  contactName: string;
  phone: string;
  address: string;
  email: string;
  password: string;
}

const foodPartnerSchema = new Schema<FoodPartnerDocument>({
  name: {
    type: String,
    required: true,
  },
  contactName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
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
});

export default mongoose.model<FoodPartnerDocument>('foodpartner', foodPartnerSchema);
