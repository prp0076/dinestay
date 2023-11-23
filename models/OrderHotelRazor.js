import mongoose from "mongoose";
const OrderRazorSchema = new mongoose.Schema(
  {
    isPaid: {
      type: Boolean,
      default: true,
    },
    paymentMode: {
      type: Boolean,
      default: true,
    },
    amount: {
      type: Number,
    },
    razorpay: {
      orderId: {
        type: String,
        default: "",
      },
      paymentId: {
        type: String,
        default: "",
      },
      signature: {
        type: String,
        default: "",
      },
    },
    OrderData: {
        type:Object,
        required:true,
    },
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    branch: {
      type: mongoose.ObjectId,
      ref: "Branch",
    },
  },
  { timestamps: true }
);

export default mongoose.model("OrderHotelRazor", OrderRazorSchema);
