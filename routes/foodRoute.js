import express from "express";
import { isManager, requireSignIn } from "../middlewares/authMiddleware.js";

import formidable from "express-formidable";
import {
  createFoodController,
  deletefoodController,
  foodPhotoController,
  getFoodController,
  getSingleFoodController,
  searchOrderController,
  updateFoodController, 
} from "../controllers/foodController.js";

const router = express.Router();

//create food
router.post(
  "/create-food",
  requireSignIn,
  isManager,
  formidable(),
  createFoodController
);

//routes
router.put(
  "/update-food/:fid",
  requireSignIn,
  isManager,
  formidable(),
  updateFoodController
);

//get food
router.get("/get-food", getFoodController);

//single food
router.get("/get-food/:slug", getSingleFoodController);

//get photo
router.get("/food-photo/:fid", foodPhotoController);

//delete food
router.delete("/delete-food/:fid", deletefoodController);

//search order
router.get('/searchOrder/:orderId', searchOrderController);


export default router;
