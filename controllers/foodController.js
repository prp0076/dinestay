import foodModel from "../models/foodModel.js";
import categoryModel from "../models/categoryModel.js";
import fs from "fs";
import slugify from "slugify";
import dotenv from "dotenv";
import orderRazor from "../models/orderRazor.js";
dotenv.config();

export const createFoodController = async (req, res) => {
  try {
    const { name, price, category } = req.fields;
    const { photo } = req.files;
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });

      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });

      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }
    const foods = new foodModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      foods.photo.data = fs.readFileSync(photo.path);
      foods.photo.contentType = photo.type;
    }
    await foods.save();
    res.status(201).send({
      success: true,
      message: "Food Created Successfully",
      foods,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating food",
    });
  }
};

//get all products
export const getFoodController = async (req, res) => {
  try {
    const foods = await foodModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      counTotal: foods.length,
      message: "Allfoods ",
      foods,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting foods",
      error: error.message,
    });
  }
};
// get single product
export const getSingleFoodController = async (req, res) => {
  try {
    const food = await foodModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single food Fetched",
      food,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting single food",
      error,
    });
  }
};

// get photo
export const foodPhotoController = async (req, res) => {
  try {
    const food = await foodModel.findById(req.params.fid).select("photo");
    if (food.photo.data) {
      res.set("Content-type", food.photo.contentType);
      return res.status(200).send(food.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting photo",
      error,
    });
  }
};

//delete controller
export const deleteFoodController = async (req, res) => {
  try {
    const { itemId } = req.body;
    console.log(itemId);
    await foodModel.findOneAndDelete({ _id: itemId });
    res.status(200).send("item deleted");
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting food",
      error,
    });
  }
};

//upate producta
export const updateFoodController = async (req, res) => {
  try {
    const { name, price, category } = req.fields;
    const { photo } = req.files;
    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });

      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const foods = await foodModel.findByIdAndUpdate(
      req.params.fid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      foods.photo.data = fs.readFileSync(photo.path);
      foods.photo.contentType = photo.type;
    }
    await foods.save();
    res.status(201).send({
      success: true,
      message: "food Updated Successfully",
      foods,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Update food",
    });
  }
};

//delete controller
export const deletefoodController = async (req, res) => {
  try {
    await foodModel.findByIdAndDelete(req.params.fid).select("-photo");
    res.status(200).send({
      success: true,
      message: "food Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting food",
      error,
    });
  }
};



// search order
export const searchOrderController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const results = await orderRazor.findOne({ "razorpay.orderId": orderId });

    if (!results) {
      return res.status(404).json({ error: "Order not found." });
    }

    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in searchOrderController",
      error,
    });
  }
};