import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
  getAllUserController,
  registerManagerController,
  getAllStaffController,
  getAllManagerController,
  registerStaffController,
  getAllCustomerController,
  getAllOrdersByBranchController,
  getAllStaffMController,
  getAllRoomOrdersController,
  getAllRoomWithOutOrdersController,
  updateStaffController,
  deletestaffController
} from "../controllers/authController.js";
import {
  isAdmin,
  isManager,
  isStaff,
  requireSignIn,
} from "../middlewares/authMiddleware.js";

//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", registerController);

//REGISTER || METHOD POST
router.post("/manager-register", registerManagerController);

//REGISTER || METHOD POST
router.post("/staff-register", registerStaffController);

//LOGIN || POST
router.post("/login", loginController);

//Forgot Password || POST
router.post("/forgot-password", forgotPasswordController);

//test routes
router.get("/test", requireSignIn, isAdmin, testController);

//protected User route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
//protected Admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//protected Admin route auth
router.get("/manager-auth", requireSignIn, isManager, (req, res) => {
  res.status(200).send({ ok: true });
});


//protected Admin route auth
router.get("/staff-auth", requireSignIn, isStaff, (req, res) => {
  res.status(200).send({ ok: true });
});

//update profile
router.put("/profile", requireSignIn, updateProfileController);

//orders
router.get("/orders", requireSignIn, getOrdersController);

//all orders
router.get("/all-orders", requireSignIn, getAllOrdersController);
router.get("/all-room-orders/:id", requireSignIn, getAllRoomOrdersController);
router.get("/all-room-orders", requireSignIn, getAllRoomWithOutOrdersController);

//all user admin manager and staff and customer
router.get("/all-users", getAllUserController);


//get all staff details
router.get("/get-staff/:id", requireSignIn, isAdmin, getAllStaffController);

//get all manager details
router.get("/get-manager", requireSignIn, isAdmin, getAllManagerController);

//get all customer details
router.get("/get-customer", requireSignIn, isManager, getAllCustomerController);


router.get("/get-staff-manager/:id", requireSignIn, isManager, getAllStaffMController);

// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  orderStatusController
);

//get order by branch
router.get("/all-orders/:id", requireSignIn, getAllOrdersByBranchController);
router.put(
  "/update-staff/:id",
  // requireSignIn,
  updateStaffController
);

//delete staff
router.delete("/delete-staff/:id", deletestaffController);

export default router;
