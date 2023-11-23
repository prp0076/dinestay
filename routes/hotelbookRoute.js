import express from "express";
import { hotelBookController,GetOrderByBranchController,HotelOrderHistorByUserwise} from "../controllers/hotelBookController.js";

const router = express.Router();

//routes
//Method - POST
router.post("/book-a-room",hotelBookController);
router.get("/get-orderbybranch/:id",GetOrderByBranchController)
router.get("/Hotel-Order-list/:id",HotelOrderHistorByUserwise)

//Method - GET
// router.get("/get-bills/:id",getBillsController);


//Method - GET
// router.get("/get-bills",getAllBillsController);



export default router;