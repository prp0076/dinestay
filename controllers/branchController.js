import branchModel from "../models/branchModel.js";
import slugify from "slugify";

export const createBranchController = async (req, res) => {
  try {
    const { name, address } = req.body;
    if (!name) {
      return res.status(401).send({ message: "Name is required" });
    }
    if (!address) {
      return res.status(401).send({ message: "Address is required" });
    }

    const existingBranch = await branchModel.findOne({ name });
    if (existingBranch) {
      return res.status(200).send({
        success: false,
        message: "Branch Already Exists",
      });
    }
    const branch = await new branchModel({
      name,
      slug: slugify(name),
      address,
    }).save();
    res.status(201).send({
      success: true,
      message: "new branch created",
      branch,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in branch",
    });
  }
};

//all branch detail
export const getAllBranchController = async (req, res) => {
  try {
    const Branch = await branchModel.find({});
    res.json(Branch);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Getting Users",
      error,
    });
  }
};



// get single branch
export const getSingleBranchController = async (req, res) => {
  try {
    const product = await branchModel
      .findOne({ slug: req.params.slug })
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single branch Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting single branch",
      error,
    });
  }
};


// /upate producta
export const updateBranchController = async (req, res) => {
  const branchId = req.params.id; // Extract branch ID from request parameters
  const updateData = req.body; // Assuming you send the updated data in the request body

  try {
    // Find the branch by ID and update it
    const updatedBranch = await branchModel.findByIdAndUpdate(
      branchId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedBranch) {
      return res.status(404).json({ success: false, message: "Branch not found" });
    }

    return res.status(200).json({ success: true, message: "Branch updated successfully", branch: updatedBranch });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating branch",
      error,
    });
  }
};
