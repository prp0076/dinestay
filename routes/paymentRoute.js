import express from "express";
import {
  CODPayCreatOrderController,
  CODPayOrderController,
  razorPayCreatOrderController,
  razorPayKeyController,
  razorPayListOrderController,
  razorPayOrderController,
  razorHotelPayOrderController,
  razorPayCheckOutFlagOrderController
} from "../controllers/paymentController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";

const router = express.Router();

//orders
router.get("/get-razorpay-key", requireSignIn, razorPayKeyController);
router.post("/create-order", requireSignIn, razorPayCreatOrderController);
router.post("/create-order-hotel", requireSignIn, razorPayCreatOrderController);



//for COD
router.post("/create-order-COD", requireSignIn, CODPayCreatOrderController);
router.post("/pay-order-COD", requireSignIn, CODPayOrderController);



//payment
router.post("/pay-order", requireSignIn, razorPayOrderController);
router.post("/hotel-pay-order", requireSignIn, razorHotelPayOrderController);

//payment
router.get("/list-orders", requireSignIn, razorPayListOrderController);

//update checkoutflag for checkout button
router.post("/checkout-flag", requireSignIn, razorPayCheckOutFlagOrderController);

export default router;
