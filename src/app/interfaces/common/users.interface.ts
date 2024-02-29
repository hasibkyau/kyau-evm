import {Cart} from './cart.interface';

export interface Users {
  _id?: string;
  name?: string;
  email?: string;
  address?: string;
  username?: string;
  carts?: string | Cart;
  image?: string;
  profileImg?: string;
  phone?: string;
  phoneNo?: string;
  createdAt?: Date;
  updatedAt?: Date;
  select?: boolean;
}
