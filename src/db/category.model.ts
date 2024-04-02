import mongoose, { Document, Schema } from "mongoose";

interface ICategory extends Document {
  name: string;
  description: string;
  image: string;
  products: [string];
}

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  products: { type: [String], required: true },
});

const CategoryModel = mongoose.model<ICategory>("Category", categorySchema);
export default CategoryModel;
