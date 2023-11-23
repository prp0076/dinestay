import mongoose from "mongoose";

const SubcategoryRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
    // unique: true,
  },
  parentCategory: {
    type: mongoose.ObjectId,
    ref: "RoomCategory",
    required: true,
  },
  slug: {
    type: String,
    lowercase: true,
  },
});

export default mongoose.model("RoomSubCategory", SubcategoryRoomSchema);
