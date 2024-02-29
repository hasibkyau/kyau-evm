export interface Category {
  slug: any;
  select: boolean;
  _id?: string;
  isFeatured?: boolean;
  isHomed?: boolean;
  discountAmount?: string;
  name?: string;
  code?: string;
  description?: string;
  image?: string;
  mobileImage?: string;
  bannerImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
