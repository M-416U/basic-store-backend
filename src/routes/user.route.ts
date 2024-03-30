import express from "express";

import {
  addToCart,
  addToWishlist,
  deleteUser,
  getAllUsers,
  getUserDetails,
  getCurrentUserDetails,
  updateUser,
  updateCurrentUser,
} from "../controllers";

const router = express.Router();
// retrive all users
router.get("/", getAllUsers);
// retrieve current user data
router.get("/me", getCurrentUserDetails);
// retrieve user data
router.get("/:userId", getUserDetails);

// delete current user
router.delete("/me", deleteUser);
// delete a user
router.delete("/:userId", deleteUser);

// update current user
router.put("/me", updateCurrentUser);
// update a user
router.put("/:userId", updateUser);

//  add a product to the wishlist
router.post("/wishlist/:productId", addToWishlist);
// add a product to the cart
router.post("/cart/:productId", addToCart);

export default router;
