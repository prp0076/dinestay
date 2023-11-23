import mongoose from "mongoose";
const AtSchema = new mongoose.Schema(
  {
    atend: {
      type: Number,
      require: true,
    },
    staff: {
      type: mongoose.ObjectId,
      ref: "users",
      requuire: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model("Attandance", AtSchema);
