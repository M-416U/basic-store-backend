import mongoose, { Document, Schema } from "mongoose";

interface ProductDocument extends Document {
  name: string;
  description: string;
  price: number;
  rating: number;
  images: string[];
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
  rating: {
    type: Number,
    default: 0,
  },
  images: {
    type: [String],
    required: true,
  },
});

const Product = mongoose.model<ProductDocument>("Product", productSchema);
export default Product;
