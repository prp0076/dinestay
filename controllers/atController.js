import atModel from "../models/atModel.js";
import userModel from "../models/userModel.js";
import atRecModel from "../models/atRecModel.js";

// Get all staff
export const getAllstf = async (req, res) => {
  try {
    const users = await userModel.find({ role: 3 });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while getting users",
      error: error.message,
    });
  }
};

//save data before cleaning this all record
export const savePresent = async (req, res) => {
  try {
    const { staff, presentData } = req.body;

    const record = new atRecModel({
      staff,
      presentData,
    });

    await record.save();

    res
      .status(201)
      .json({ message: "Records created successfully", data: record });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//get saved data
export const getPresent = async (req, res) => {
  try {
    const total = await atRecModel.find({});

    if (!total) {
      return res.status(404).json({
        success: false,
        message: "saved data not  found",
      });
    }

    res.status(200).json(total);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while getting data",
      error: error.message,
    });
  }
};
//setZero

export const resultZero = async (req, res) => {
  try {
    //
    const updateResult = await atModel.updateMany({}, { $set: { atend: 0 } });

    if (updateResult.nModified > 0) {
      res.status(200).json({
        message: "Attendance updated successfully",
        success: true,
        updatedCount: updateResult.nModified, // Number of documents modified
      });
    } else {
      res.status(200).json({
        message: "No documents were updated",
        success: true,
        updatedCount: 0,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update attendance",
      error: error.message,
    });
  }
};

//get attendance
export const getAtend = async (req, res) => {
  try {
    const { staff } = req.body;
    const attend = await atModel.find({ "staff.$oid": staff });

    if (!attend) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      });
    }

    res.status(200).json(attend);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while getting attend",
      error: error.message,
    });
  }
};

//creation methods
export const creatAt = async (req, res) => {
  try {
    const { staff, atend } = req.body;
    const oldAttendance = await atModel.findOne({ staff });
    if (oldAttendance) {
      oldAttendance.atend += atend;
      await oldAttendance.save();
      res.status(200).json({
        message: "Attendance updated successfully",
        success: true,
        updatedAttendance: oldAttendance,
      });
    } else {
      const newAttendance = new atModel({
        atend,
        staff,
      });

      await newAttendance.save();
      res.status(201).json({
        message: "Attendance recorded successfully",
        success: true,
        newAttendance,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create/update attendance",
      error: error.message,
    });
  }
};






//getSingleStaff
export const getSingleStaff = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id, "first idddddd");
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while getting user by ID",
      error: error.message,
    });
  }
};

//getSingleAtend

export const getSingleAtend = async (req, res) => {
  try {
    const { id } = req.params;
    const attendance = await atModel.findOne({ staff: id }).populate("staff"); // Find attendance by ID

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      });
    }

    res.status(200).json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while getting attendance",
      error: error.message,
    });
  }
};




