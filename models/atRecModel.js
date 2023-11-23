import mongoose from "mongoose";
const RecSchema = new mongoose.Schema(
  {
    staff: {
      type: Object,
      required: true,
    },
    presentData: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model("PRecord", RecSchema);
