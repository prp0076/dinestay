import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    price: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    category: {
      type: mongoose.ObjectId,
      ref: "RoomCategory",
      required: true,
    },

    subcategory: {
      type: mongoose.ObjectId,
      ref: "RoomSubCategory",
      required: true,
    },

    //   photo: {
    //     data: Buffer,
    //     contentType: String,
    //   },
  },
  { timestamps: true }
);
export default mongoose.model("Roomsss", roomSchema);
