import express from "express";
import { isAdmin, isManager, requireSignIn } from "./../middlewares/authMiddleware.js";
import { createBranchController, getAllBranchController, getSingleBranchController, updateBranchController } from "../controllers/branchController.js";

const router = express.Router();

//routes
// create branch
router.post(
  "/create-branch",
  requireSignIn,
  isAdmin,
  createBranchController
);


//get all branch
router.get("/get-all-branch", requireSignIn, getAllBranchController);



//single branch
router.get("/get-branch/:slug", getSingleBranchController);


//routes
router.put(
  "/update-branch/:id",
  requireSignIn,
  updateBranchController
);

export default router;


