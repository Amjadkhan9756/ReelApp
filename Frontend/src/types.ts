export interface VideoItem {
  _id: string;
  video: string;
  mediaType?: string;
  name?: string;
  description?: string;
  likeCount?: number;
  likesCount?: number;
  likes?: number;
  liked?: boolean;
  savesCount?: number;
  bookmarks?: number;
  saves?: number;
  saved?: boolean;
  commentsCount?: number;
  comments?: unknown[];
  videoPartner?: string;
}

export interface VideoPartnerProfile {
  _id: string;
  name?: string;
  address?: string;
  contactName?: string;
  videoItems: VideoItem[];
}

export interface VideoPartnerProfileResponse extends ApiMessageResponse {
  videoPartner: VideoPartnerProfile;
}

export interface ApiMessageResponse {
  message: string;
}

export interface ApiErrorResponse {
  message?: string;
  error?: string;
}

export interface UserAccount {
  _id: string;
  email: string;
  fullName: string;
}

export interface VideoPartnerAccount {
  _id: string;
  email: string;
  name: string;
  address?: string;
  contactName?: string;
  phone?: string;
}

export interface UserAuthResponse extends ApiMessageResponse {
  user: UserAccount;
}

export interface VideoPartnerAuthResponse extends ApiMessageResponse {
  videoPartner: VideoPartnerAccount;
}

export type AuthSessionResponse =
  | { authenticated: false }
  | { authenticated: true; role: 'user'; account: UserAccount }
  | { authenticated: true; role: 'video-partner'; account: Pick<VideoPartnerAccount, '_id' | 'email' | 'name'> };

export interface VideoItemsResponse extends ApiMessageResponse {
  videoItems: VideoItem[];
}

export interface SavedVideosResponse extends ApiMessageResponse {
  savedVideos: Array<{ video: VideoItem }>;
}

export interface LikeVideoResponse extends ApiMessageResponse {
  like: boolean;
  video: VideoItem;
}

export interface ToggleSaveVideoResponse extends ApiMessageResponse {
  save: boolean;
  video: VideoItem;
}

export interface CreateVideoResponse extends ApiMessageResponse {
  video: VideoItem;
}
