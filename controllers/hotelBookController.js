import hotelBookUser from "../models/hotelBookUser.js";
import OrderHotelRazor from "../models/OrderHotelRazor.js";
import mongoose from "mongoose";
import { useParams } from 'react-router-dom';
export const hotelBookController = async (req, res) => {
  try {
    const { name, checkin, checkout, phone, adult, children, idProof, address,parentCategory,parentSubCategory,branch ,roomCount} = req.body;
    // validations
    if (!name || !checkin || !checkout || !phone || !adult || !children || !idProof || !address ||!roomCount) {
      return res.status(400).send({ error: "All fields are required." });
    }

    // save
    const Room = await new hotelBookUser({
      name,
      checkin,
      phone,
      address,
      checkout,
      adult,
      children,
      idProof,
      parentCategory,
      parentSubCategory,
      branch,
      roomCount
    }).save();
    
    res.status(201).send({
      success: true,
      message: "Room Booked Successfully",
      Room,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in Room Booking",
      error,
    });
  }
};

export const GetOrderByBranchController = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id,"idididi");
    const Orders = await OrderHotelRazor.find({branch:id});
    res.status(200).send({
      success: true,
      message: 'Order Fetch successfully',
      Orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: 'Error while fetching online order quantity',
    });
  }
};

export const HotelOrderHistorByUserwise = async (req,res)=>{
  try {
    const { id } = req.params;
    console.log(id,"idididi");
    const Orders = await OrderHotelRazor.find({buyer:id});
    res.status(200).send({
      success: true,
      message: 'Order Fetch successfully',
      Orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: 'Error while fetching online order quantity',
    });
  }
}