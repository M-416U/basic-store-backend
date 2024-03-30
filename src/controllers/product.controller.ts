import * as db from "../db";
import express from "express";

//create a new product
const createProduct = async (req: express.Request, res: express.Response) => {
  try {
    if (!req.body.images) {
      return res
        .status(404)
        .json({ success: false, message: "product must have an image " });
    }
    const product = await db.product.create(req.body);
    return res.status(201).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//retrieve all products
const getAllProducts = async (req: express.Request, res: express.Response) => {
  try {
    const products = await db.product.find();
    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
//retrieve product
const getProduct = async (req: express.Request, res: express.Response) => {
  const productId = req.params.productId;
  try {
    const product = await db.product.findOne({ _id: productId });
    return res.status(200).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//update product
const updateProduct = async (req: express.Request, res: express.Response) => {
  const productId = req.params.productId;
  try {
    const { images, ...updatedFields } = req.body;

    const existingProduct = await db.product.findById(productId);

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const mergedImages = existingProduct.images.concat(images || []);

    const updatedProduct = await db.product.findByIdAndUpdate(
      productId,
      { ...updatedFields, images: mergedImages },
      { new: true }
    );

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//delete a product
const deleteProduct = async (req: express.Request, res: express.Response) => {
  const productId = req.params.productId;
  try {
    await db.product.findByIdAndDelete(productId);
    return res
      .status(204)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export default {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
