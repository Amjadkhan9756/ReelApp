import type { RequestHandler } from 'express';
import { Types } from 'mongoose';
import foodModel, { type FoodDocument } from '../models/food.model.js';
import foodPartnerModel from '../models/foodpartner.model.js';

interface FoodPartnerProfileResponse {
  message: string;
  foodPartner: {
    _id: Types.ObjectId;
    name: string;
    contactName: string;
    phone: string;
    address: string;
    email: string;
    foodItems: FoodDocument[];
  };
}

export const getFoodPartnerById: RequestHandler<
  { id: string },
  FoodPartnerProfileResponse | { message: string },
  unknown
> = async (req, res) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: 'Invalid food partner ID' });
    return;
  }

  const foodPartner = await foodPartnerModel.findById(id).select('-password');

  if (!foodPartner) {
    res.status(404).json({ message: 'Food partner not found' });
    return;
  }

  const foodItems = await foodModel.find({ foodPartner: id });
  res.status(200).json({
    message: 'Food partner retrieved successfully',
    foodPartner: {
      _id: foodPartner._id,
      name: foodPartner.name,
      contactName: foodPartner.contactName,
      phone: foodPartner.phone,
      address: foodPartner.address,
      email: foodPartner.email,
      foodItems,
    },
  });
};
