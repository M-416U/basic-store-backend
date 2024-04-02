import mongoose, { Document, Schema } from "mongoose";

export interface ProductDocument extends Document {
  name: string;
  description: string;
  video: string;
  brand: string;
  categoryId: string;
  inStock: number;
  price: number;
  oldPrice: number;
  rating: number;
  images: string[];
  colors: string[];
}

const productSchema = new Schema<ProductDocument>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  inStock: {
    type: Number,
    required: true,
  },
  video: {
    type: String,
  },
  brand: {
    type: String,
  },
  categoryId: {
    type: String,
  },
  oldPrice: {
    type: Number,
  },
  rating: {
    type: Number,
    default: 0,
  },
  images: {
    type: [String],
    required: true,
  },
  colors: {
    type: [String],
  },
});

const Product = mongoose.model<ProductDocument>("Product", productSchema);
export default Product;
