import mongoose from "mongoose";

const hotelBookUser = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    checkoutflag:{
      type:Boolean,
      default:false
    },
    parentCategory:{ 
      type:mongoose.ObjectId,
      ref:"RoomCategory",
      required:true
    },
    parentSubCategory:{
      type:mongoose.ObjectId,
      ref:"RoomSubCategory",
      required:true
    },
    branch:{
      type:mongoose.ObjectId,
      ref:"Branch",
      required:true 
    },
    checkin: {
      type: Date,
      required: true,
    },
    checkout: {
      type: Date,
      required: true,
    },
    adult:{
        type:String,
        required:true
    },
    children:{
      type:String,
      required:true
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    idProof: {
      type: String,
      required: true,
    },
    roomCount:{
      type:String,
      required:true
    }
  },
  { timestamps: true }
);

export default mongoose.model("hotelbookusers", hotelBookUser);
