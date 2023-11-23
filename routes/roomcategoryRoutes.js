import express from "express";
import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js";
import {
  RoomcategoryControlller,
  createRoomCategoryController,
  deleteRoomCategoryCOntroller,
  singleRoomCategoryController,
  updateRoomCategoryController,
  GetNameRoomCategoryController
} from "./../controllers/roomcategoryController.js";

const router = express.Router();

//routes
// create category
router.post(
  "/create-room-category",

  createRoomCategoryController
);

//update category
router.put(
  "/update-room-category/:id",

  updateRoomCategoryController
);

//getALl category
router.get("/get-room-category", RoomcategoryControlller);
//get category name by id
router.get("/cat-name/:id",GetNameRoomCategoryController)
//single category
router.get("/single-room-category/:slug", singleRoomCategoryController);

//delete category
router.delete(
  "/delete-room-category/:id",

  deleteRoomCategoryCOntroller
);

export default router;
