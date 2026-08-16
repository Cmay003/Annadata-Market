import type { Seller } from "./sellerTypes";

export interface Category {
    id?: number; // Optional since id is auto-generated
    name: string;
    categoryId: string;
    parentCategory?: Category; // Optional since a category might not have a parent
    level: number;
  }
export interface Product {
  id: number;
  title: string;
  description: string;
  mrpPrice: number;
  sellingPrice: number;
  discountPercent?: number;
  quantity?: number;

   // ✅ NEW FIELD
  grade?: "A" | "B" | "C";

  // ✅ ADD THIS
  weight?: number;   // e.g. 1, 500
  unit?: string;     // e.g. kg, g, piece, dozen

  images: string[];
  numRatings?: number;
  category?: Category;
  seller?: Seller;
  createdAt?: Date;
  in_stock?: boolean;

  commissionPercentage?: number;
farmerEarning?: number;
}