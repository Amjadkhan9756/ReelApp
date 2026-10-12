import type { FoodPartnerDocument } from '../models/foodpartner.model.js';
import type { UserDocument } from '../models/user.model.js';

declare global {
  namespace Express {
    interface Request {
      foodPartner?: FoodPartnerDocument | null;
      user?: UserDocument | null;
    }
  }
}

export {};
