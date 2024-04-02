import * as db from "../db";
import express from "express";

//create a new category
const createCategory = async (req: express.Request, res: express.Response) => {
  try {
    if (!req.body.image) {
      return res
        .status(404)
        .json({ success: false, message: "category must have an image " });
    }
    const category = await db.category.create({
      ...req.body,
    });
    return res.status(201).json(category);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//retrieve all categorys
const getAllCategories = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const categorys = await db.category.find();
    return res.status(200).json(categorys);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
//retrieve category
const getCategory = async (req: express.Request, res: express.Response) => {
  const categoryId = req.params.categoryId;
  try {
    const category = await db.category.findOne({ _id: categoryId });
    return res.status(200).json(category);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//update category
const updateCategory = async (req: express.Request, res: express.Response) => {
  const categoryId = req.params.categoryId;
  try {
    const { ...updatedFields } = req.body;

    const existingcategory = await db.category.findById(categoryId);

    if (!existingcategory) {
      return res.status(404).json({ message: "category not found" });
    }

    const updatedcategory = await db.category.findByIdAndUpdate(
      categoryId,
      {
        ...updatedFields,
      },
      { new: true }
    );

    return res.status(200).json(updatedcategory);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//delete a category
const deleteCategory = async (req: express.Request, res: express.Response) => {
  const categoryId = req.params.categoryId;
  try {
    await db.category.findByIdAndDelete(categoryId);
    return res
      .status(204)
      .json({ success: true, message: "category deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export default {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
