import mongoose from "mongoose";

const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
    },
    address: {
        type: {},
        required: true,
      },
    
   

    // staffDetails: {
    //   type: mongoose.ObjectId,
    //   ref: "Staff",
    //   required: true,
    // },

  },
  { timestamps: true }
);

export default mongoose.model("Branch", branchSchema);