
import express from "express"
import { createRoomController,getRoomController,updateRoomController,getRoomSubController ,bookRoomController,updateRoomQuantityController,updateRoomQuantityDuringCheckoutController} from "../controllers/roomController.js";
const router =express.Router();

router.post(
    "/create-rooms",
    createRoomController
)

router.post("/book-rooms",bookRoomController);
router.get("/get-rooms",getRoomController)
router.get("/get-rooms-subcat",getRoomSubController)
router.get("/get-rooms-subcat-quant",updateRoomQuantityController)
router.post("/update-quantity/:id",updateRoomQuantityDuringCheckoutController)
router.put(
    "/update-room/:rid",
    
    updateRoomController
  );
  

export default router;