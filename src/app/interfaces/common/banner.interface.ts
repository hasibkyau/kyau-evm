export interface Banner {
  select: boolean;
  _id?: string;
  name?: string;
  description?: string;
  image?: string;
  mobileImage?:string;
  bannerType?:string;
  url?:string;
  createdAt?: Date; 
  updatedAt?: Date;
}
