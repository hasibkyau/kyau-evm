import { Brand } from './brand.interface';
import {User} from './user.interface';
import {Product} from './product.interface';
import {Area} from './area.interface';
import { Division } from './division.interface';
export interface Order {
  _id?: string;
  orderId?: string;
  discountTypes?: DiscountType[];
  name?: string;
  phoneNo?: string;
  email?: string;
  division?:Division;
  zone?:Zone;
  city?: string;
  shippingAddress?: string;
  paymentType?: string;
  orderedItems?: OrderedItem[];
  subTotal?: number;
  deliveryCharge?: number;
  discount?: number;
  productDiscount?: number;
  coupon?: string;
  couponDiscount?: number;
  grandTotal: number;
  checkoutDate: string;
  deliveryDate?: any;
  orderStatus?: number;
  paymentStatus?: string;
  hasOrderTimeline?: boolean;
  processingDate?: Date;
  shippingDate?: Date;
  deliveringDate?: Date;
  user?: User;
  orderTimeline?: OrderTimeline;
  preferredDate?: Date;
  preferredTime?: string;
  orderType?: string;
  preferredDateString?: string;
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;
  select?: boolean;
  area?: string | Area;
  prescription?: string;
  prescriptionImages?: string;
  prescriptionType?: boolean;
  requestMedicine?: boolean;
  requestMedicineType?: boolean;


}

export interface OrderedItem {
  // publisher: any;
  _id: string | Product;
  name: string;
  slug: string;
  milligram:string;
  image: string;
  category: any;
  subCategory: any;
  publisher: any;
  brand: Brand;
  regularPrice: number;
  unitPrice: number;
  quantity: number;
  orderType: string;
  discountAmount: string;
  unit: string;
}

export interface OrderTimeline {
  confirmed?: OrderTimelineType;
  processed?: OrderTimelineType;
  shipped?: OrderTimelineType;
  delivered?: OrderTimelineType;
  canceled?: OrderTimelineType;
  refunded?: OrderTimelineType;
}

export interface DiscountType {
  type: string;
  amount: number;
}

export interface OrderTimelineType {
  success: boolean;
  date?: Date;
  expectedDate?: Date;
}
