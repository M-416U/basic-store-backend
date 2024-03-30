import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

interface UserDocument extends Document {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  token: string;
  email: string;
  password: string;
  wishlist: string[];
  cart: string[];
}

const userSchema = new Schema<UserDocument>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  token: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  wishlist: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  cart: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

userSchema.pre<UserDocument>("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    return next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<UserDocument>("User", userSchema);
export default User;
