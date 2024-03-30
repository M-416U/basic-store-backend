import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import * as db from "../db";
import bcrypt from "bcrypt";

import { config } from "dotenv";

config();

interface DecodedToken extends JwtPayload {
  userId: string;
}

export const addToWishlist = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET) as DecodedToken;
    if (!decodedToken) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const user = await db.user.findOne({ _id: decodedToken.userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.wishlist.includes(productId)) {
      console.log("User before", user);
      user.wishlist.push(productId);
      console.log("User after", user);
    }

    await user.save();

    res.status(200).json({ message: "Product added to wishlist successfully" });
  } catch (error) {
    console.error("Error adding product to wishlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET) as DecodedToken;
    if (!decodedToken) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const user = await db.user.findOne({ _id: decodedToken.userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.cart.includes(productId)) {
      user.cart.push(productId);
    }

    await user.save();

    res.status(200).json({ message: "Product added to cart successfully" });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await db.user.find().select("-token -__v -password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get current user details
export const getCurrentUserDetails = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET) as DecodedToken;
    if (!decodedToken) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const user = await db.user
      .findOne({ _id: decodedToken.userId })
      .select("-token -__v -password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// get  user details
export const getUserDetails = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await db.user
      .findOne({ _id: userId })
      .select("-token -__v -password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//delete the current user loged in
export const deleteCurrentUser = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET) as DecodedToken;
    if (!decodedToken) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const user = await db.user
      .findOneAndDelete({ _id: decodedToken.userId })
      .select("-token -__v -password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//delete user with userId
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const deletedUser = await db.user.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//update current user
export const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const updateData = req.body;
    if (updateData.password) {
      const hashedPassword = await bcrypt.hash(updateData.password, 10);
      updateData.password = hashedPassword;
    }
    const decodedToken = jwt.verify(token, process.env.SECRET) as DecodedToken;
    if (!decodedToken) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    const updatedUser = await db.user
      .findByIdAndUpdate(
        decodedToken.userId,
        { $set: updateData },
        { new: true }
      )
      .select("-token -__v -password");
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating current user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// update user with userId
export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const updateData = req.body;
    if (updateData.password) {
      const hashedPassword = await bcrypt.hash(updateData.password, 10);
      updateData.password = hashedPassword;
    }
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const updatedUser = await db.user
      .findByIdAndUpdate(userId, updateData, {
        new: true,
      })
      .select("-token -__v -password");
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
