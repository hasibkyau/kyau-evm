export interface Cart {
  _id?: string;
  cartType?: string;
  applicationChannel?: 'website' | 'android' | 'ios' | 'admin';
  trip?: string;
  journeyDate?: string;
  seat?: string;
  date?: string;
  user?: CartAuth;
  gender?: string;
  expiredIn?: string;
  version?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CartAuth {
  _id?: string;
  isAuth?: boolean;
  role?: 'user' | 'admin' | 'anonymous';
}
