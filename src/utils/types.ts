export type TIngredient = {
  type: TIngredientType;
  _id: string;
  name: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
  __v: number;
};

export type TIngredientType = 'bun' | 'main' | 'sauce';

export type TOrderStatus = 'created' | 'pending' | 'done';

export type TOrder = {
  _id: string;
  ingredients: string[];
  name?: string;
  status: TOrderStatus;
  number: number;
  createdAt: string;
  updatedAt: string;
};

export type TOrdersResponse = {
  success: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export type TIngredientUI = TIngredient;

export type TOrderCardUI = {
  id: string;
  number: number;
  name: string;
  status: TOrderStatus;
  date: string;
  price: number;
  ingredients: TIngredientUI[];
};

export type TConstructorIngredient = TIngredient & {
  uid: string;
};

export type TApiResponse<TData> = {
  success: boolean;
  data: TData;
};

export type TUser = {
  email: string;
  name: string;
};

export type TAuthResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: TUser;
};

export type TRefreshTokenResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
};

export type TUserResponse = {
  success: boolean;
  user: TUser;
};

export type TMessageResponse = {
  success: boolean;
  message: string;
};

export type TOrderResponse = {
  success: boolean;
  name: string;
  order: {
    number: number;
  };
};
