import type { VideoPartnerDocument } from '../models/video-partner.model.js';
import type { UserDocument } from '../models/user.model.js';

declare global {
  namespace Express {
    interface Request {
      videoPartner?: VideoPartnerDocument | null;
      user?: UserDocument | null;
    }
  }
}

export {};
