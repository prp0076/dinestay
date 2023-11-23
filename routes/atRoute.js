import express from "express";
import { requireSignIn, isManager,isStaff } from "./../middlewares/authMiddleware.js";
import {
  getAllstf,
  creatAt,
  getAtend,
  resultZero,
  savePresent,
  getPresent,
  getSingleAtend,
  getSingleStaff
} from "../controllers/atController.js";

const router = express.Router();
// router.post("/at-create");
router.get("/get-pr", requireSignIn, isManager, getPresent);
router.post("/create-pr", requireSignIn, isManager, savePresent);

router.get("/get-stf", requireSignIn, isManager, getAllstf);
router.put("/zero-at", requireSignIn, isManager, resultZero);

router.post("/create-at", requireSignIn, isManager, creatAt);
router.get("/get-at", requireSignIn, isManager, getAtend);





//for getting single atend for staff and gettin single atend for staff
router.get("/single-stf/:id", requireSignIn, isStaff, getSingleStaff);
//for single attendance
router.get("/single-at/:id", requireSignIn, isStaff, getSingleAtend);


export default router;
