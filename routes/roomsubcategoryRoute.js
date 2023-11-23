import express from "express";
import { isManager, requireSignIn } from "../middlewares/authMiddleware.js";
import {createSubCategoryController,GetSubcategoryControlller,GetSubcategoryByIdControlller,GetSubcategoryByCategoryControlller,updateSubCategoryController,deleteSubCategoryCOntroller} from "../controllers/roomsubcategoryController.js";
const router = express.Router();
router.post(
    "/create-sub-category",
    requireSignIn,
    isManager,
    createSubCategoryController
);

//get all Subcategory
router.get("/get-sub-category", GetSubcategoryControlller);
router.get("/get-sub-category/:id", GetSubcategoryByCategoryControlller);
router.get("/subcat-name/:id", GetSubcategoryByIdControlller);
//update category
router.put(
    "/update-subcategory/:id",
    requireSignIn,
    isManager,
    updateSubCategoryController
);
router.delete(
    "/delete-subcategory/:id",
    requireSignIn,
    isManager,
    deleteSubCategoryCOntroller
  );
export default router;
  