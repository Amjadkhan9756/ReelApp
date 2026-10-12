export interface FoodItem {
  _id: string;
  video: string;
  mediaType?: string;
  name?: string;
  description?: string;
  likeCount?: number;
  likesCount?: number;
  likes?: number;
  savesCount?: number;
  bookmarks?: number;
  saves?: number;
  commentsCount?: number;
  comments?: unknown[];
  foodPartner?: string;
}

export interface FoodPartnerProfile {
  _id: string;
  name?: string;
  address?: string;
  totalMeals?: number;
  customersServed?: number;
  foodItems: FoodItem[];
}

export interface FoodPartnerProfileResponse extends ApiMessageResponse {
  foodPartner: FoodPartnerProfile;
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

export interface FoodPartnerAccount {
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

export interface FoodPartnerAuthResponse extends ApiMessageResponse {
  foodPartner: FoodPartnerAccount;
}

export type AuthSessionResponse =
  | { authenticated: false }
  | { authenticated: true; role: 'user'; account: UserAccount }
  | { authenticated: true; role: 'food-partner'; account: Pick<FoodPartnerAccount, '_id' | 'email' | 'name'> };

export interface FoodItemsResponse extends ApiMessageResponse {
  foodItems: FoodItem[];
}

export interface SavedFoodsResponse extends ApiMessageResponse {
  savedFoods: Array<{ food: FoodItem }>;
}

export interface LikeFoodResponse extends ApiMessageResponse {
  like: boolean;
  food: FoodItem;
}

export interface ToggleSaveFoodResponse extends ApiMessageResponse {
  save: boolean;
  food: FoodItem;
}

export interface CreateFoodResponse extends ApiMessageResponse {
  food: FoodItem;
}
