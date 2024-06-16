export interface Product {
  productID: number;
  name: string;
  description: string;
  images: string[];
  price: number;
  categoryID: number;
  stockQuantity: number; ///
  weight?: number;
  weights?: number[];
  quantity?: number;
  size?: string;
  category?: Category;
  length?: string;
  minTest?: number;
  maxTest?: number;
}

export interface Category {
  categoryID: number;
  name: string;
  description: string;
  products?: Product[];
}

export interface HeadHook extends Product {
  weights: number[];
  quantity: number;
}

export interface FishingRod extends Product {
  length: string;
  weight: number;
  minTest: number;
  maxTest: number;
}
