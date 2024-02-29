import { User } from "./user.interface";


export interface PrescriptionOrder {
  _id?: string;
  orderId?: string;
  images: string[];
  checkoutDate: Date;
  user?: string | User;
  name: string;
  phoneNo: string;
  email: string;
  city?: string;
  district?: string;
  shippingAddress: string;
  orderNotes?: string;
  createdAt?: Date;
  updatedAt?: Date;
  select?:boolean;
}

