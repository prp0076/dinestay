import roomsModel from "../models/roomsModel.js";
import fs from "fs";
export const createRoomController = async (req, res) => {
  try {
    const { price, quantity, description, category, subcategory } = req.body;
    // const  {photo}  = req.files;
    // console.log(photo,"photppjpjpjpjpjpojjpo00");
    // console.log(req.files,"filojoij");

    if (!price) {
      return res.status(401).send({ message: "Price is Required " });
    }
    if (!quantity) {
      return res.status(401).send({ message: "Quantity is Required " });
    }
    if (!description) {
      return res.status(401).send({ message: "Description is Required " });
    }

    if (!category) {
      return res.status(401).send({ message: "Category is Required " });
    }

    if (!subcategory) {
      return res.status(401).send({ message: "SubCategory is Required " });
    }

    // if(photo && photo.size > 1000000){
    //   return res
    //   .status(500)
    //   .send({ error: "photo is Required and should be less then 1mb" })
    // }

    const rooms = await new roomsModel({
      price,
      quantity,
      description,
      category,
      subcategory,
    });
    // if (photo) {
    //   rooms.photo.data = fs.readFileSync(photo.path);
    //   rooms.photo.contentType = photo.type;
    // }
    rooms.save();
    res.status(201).send({
      success: true,
      message: "Rooms created successfully",
      rooms,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating Rooms",
    });
  }
};

export const getRoomController = async (req, res) => {
  try {
    const room = await roomsModel.find({});
    res.status(200).send({
      success: true,
      message: "All Rooms List",
      room,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all rooms",
    });
  }
};
export const getRoomSubController = async (req, res) => {
  try {
    const { Subcategory } = req.query; // Use req.query to get URL parameters
    console.log(Subcategory, "subcatete");

    const room = await roomsModel.find({ subcategory: Subcategory });
    res.status(200).send({
      success: true,
      message: "Get Rooms List",
      room,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting by subcat rooms",
    });
  }
};
export const updateRoomQuantityController = async (req, res) => {
  try {
    const { Subcategory, quantity } = req.query;
    const updatedRoom = await roomsModel.findOneAndUpdate(
      { subcategory: Subcategory },
      { quantity },
      { new: true } // Set to true to return the modified document
    );

    res.status(200).send({
      success: true,
      message: 'Room quantity updated successfully',
      room: updatedRoom,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: 'Error while updating room quantity',
    });
  }
};
export const updateRoomQuantityDuringCheckoutController = async (req, res) => {
  try {
    const {id}=req.params
    const {  Addquantity } = req.body;
    // console.log(id,"subcategoryid");
    // console.log(Addquantity,"addquantity");
    const addQuantityNumeric = parseInt(Addquantity, 10);
    const updatedRoom = await roomsModel.findOneAndUpdate(
      { subcategory: id },
      { $inc: { quantity: addQuantityNumeric } }, 
      { new: true } 
    );
    res.status(200).send({
      success: true,
      message: 'Room quantity updated successfully',
      room: updatedRoom,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: 'Error while updating room quantity',
    });
  }
};



export const updateRoomController = async (req, res) => {
  try {
    const { price, quantity, description, category, subcategory } = req.body;
    const id=req.params.rid;
    console.log(id);
    //validation
    switch (true) {
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !subcategory:
        return res.status(500).send({ error: "SubCategory is Required" });
    }
    const room = await roomsModel.findByIdAndUpdate(id, {
      price,
      quantity,
      description,
      category,
      subcategory,
    });

    res.status(201).send({
      success: true,
      message: "Room Updated Successfully",
      room,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Update food",
    });
  }
};
export const bookRoomController =async(req,res)=>{

  try{
  const {name,checkin,checkout,people,phone,address,idProof}=req.body;
  
  if(!checkin){
      return res.status(401).send({message:"checkin is Required "})
  }
  if(!checkout){
      return res.status(401).send({message:"checkout is Required "})
  }if(!name){
      return res.status(401).send({message:"name is Required "})
  }
  if(!people){
      return res.status(401).send({message:"people is Required "})
  }
  if(!phone){
      return res.status(401).send({message:"people is Required "})
  }
  if(!address){
      return res.status(401).send({message:"people is Required "})
  }
  if(!idProof){
      return res.status(401).send({message:"people is Required "})
  }
  const rooms = await new hotelBookUser({
      name,checkin,checkout,people,phone,address,idProof
  }).save();
  res.status(201).send({
      success: true,
      message: "Rooms created successfully",
      rooms,
    });
  
  
  
  }
  
  catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error in creating Rooms",
      });
    }
  
  
  }