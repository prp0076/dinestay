import express from "express";
import { addBillsController,getAllBillsController,getBillsController } from "../controllers/billsController.js";

const router = express.Router();

//routes
//Method - POST
router.post("/add-bills",addBillsController);


//Method - GET
router.get("/get-bills/:id",getBillsController);


//Method - GET
router.get("/get-bills",getAllBillsController);



export default router;