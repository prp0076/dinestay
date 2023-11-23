import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    customerNumber: {
      type: Number,
      required: true,
    },
    subTotal: {
      type: Number,
      default: 2,
    },
    totalAmount: {
      type: Number,
      default: 2,
    },
    tax: {
      type: String,
    },
    taxRate: {
      type: Number,
    },
    paymentMode: {
      type: String,
    },
    branch: {
      type: mongoose.ObjectId,
      ref: "Branch",
    },
    cartItems: [],
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamp: true }
);

export default mongoose.model("Bills", billSchema);
