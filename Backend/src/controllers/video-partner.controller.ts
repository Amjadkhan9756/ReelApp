import type { RequestHandler } from 'express';
import { Types } from 'mongoose';
import videoModel, { type VideoDocument } from '../models/video.model.js';
import videoPartnerModel from '../models/video-partner.model.js';

interface VideoPartnerProfileResponse {
  message: string;
  videoPartner: {
    _id: Types.ObjectId;
    name: string;
    contactName: string;
    phone: string;
    address: string;
    email: string;
    videoItems: VideoDocument[];
  };
}

export const getVideoPartnerById: RequestHandler<
  { id: string },
  VideoPartnerProfileResponse | { message: string },
  unknown
> = async (req, res) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: 'Invalid video partner ID' });
    return;
  }

  const videoPartner = await videoPartnerModel.findById(id).select('-password');

  if (!videoPartner) {
    res.status(404).json({ message: 'Video partner not found' });
    return;
  }

  const videoItems = await videoModel.find({ videoPartner: id });
  res.status(200).json({
    message: 'Video partner retrieved successfully',
    videoPartner: {
      _id: videoPartner._id,
      name: videoPartner.name,
      contactName: videoPartner.contactName,
      phone: videoPartner.phone,
      address: videoPartner.address,
      email: videoPartner.email,
      videoItems,
    },
  });
};
