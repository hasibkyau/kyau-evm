import { Brand } from './brand.interface';
import {Tag} from './tag.interface';
import {Variation, VariationOption} from './variation.interface';
import {Category} from './category.interface';
import {SubCategory} from './sub-category.interface';
import {Author} from './author.interface';
import {Publisher} from './publisher.interface';
import {Type} from "./type.interface";
import {Generic} from "./generic.interface";
import {Unit} from "./unit.interface";

export interface Product {
  // publisher: any;
  _id?: string;
  name: string;
  slug?: string;
  companyName?: string;
  generic?: Generic;
  disclaimer?: string;
  description?: string;
  shortDescription?: string;
  featureTitle?: string;
  prices?: PriceData[];
  costPrice?: number;
  milligram?: string;
  salePrice: number;
  hasTax?: boolean;
  tax?: number;
  sku: string;
  emiMonth?: number[];
  discountType?: number;
  discountAmount?: number;
  images?: string[];
  trackQuantity?: boolean;
  quantity?: number;
  category?: Category;
  subCategory?: SubCategory;
  author?: Author;
  brand?: Brand;
  type?: Type;
  units?: Unit;
  publisher?: Publisher;
  tags?: string[] | Tag[];
  specifications?: ProductSpecification[];
  features?: ProductFeature[];
  hasVariations?: boolean;
  variations?: Variation[];
  variationsOptions?: VariationOption[];
  status?: string;
  videoUrl?: string;
  threeMonth?: number;
  sixMonth?: number;
  twelveMonth?: number;
  unit?: string;
  priceId?: string;
  // Seo
  seoTitle?: string;
  seoImage?: string;
  seoDescription?: string;
  seoKeywords?: string;
  // Point
  earnPoint?: boolean;
  pointType?: number;
  pointValue?: number;
  redeemPoint?: boolean;
  redeemType?: number;
  redeemValue?: number;
  createdAt?: Date;
  updatedAt?: Date;
  select?: boolean;
  selectedQty?: number;
  // For Create Order
  orderVariationOption?: VariationOption;
  orderVariation?: string;

  // For Offer
  offerDiscountAmount?: number;
  offerDiscountType?: number;
  resetDiscount?: boolean;
}

interface CatalogInfo {
  _id: string;
  name: string;
  slug: string;
}

export interface ProductSpecification {
  name?: string;
  value?: string;
  type?: string;
}

export interface ProductFeature {
  name?: string;
  value?: string;
}

export interface PriceData {
  _id: string;
  costPrice: number;
  salePrice: number;
  discountType?: number;
  discountAmount?: number;
  quantity: number;
  soldQuantity?: number;
  unit: string;
  name: string;
}
