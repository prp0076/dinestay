import billsModel from "../models/billsModel.js";

//add items
export const addBillsController = async (req, res) => {
  try {
    const {
      customerName,
      customerNumber,
      subTotal,
      totalAmount,
      tax,
      taxRate,
      paymentMode,
      cartItems,
      branch
    } = req.body;
    // const taxRate = JSON.parse(tax);
    // console.log("Received request body:", req.body);
    // console.log(cartItems, "cart");
    const parsedCartItems = JSON.parse(cartItems);
    // Check if any required field is missing or empty
    if (
      !customerName ||
      !customerNumber ||
      !subTotal ||
      !totalAmount ||
      !tax ||
      !taxRate ||
      !paymentMode ||
      !cartItems  ||
      !branch

    ) {
      return res.status(400).json({
        message: "Missing or empty required fields",
        success:false
      });
    }
// console.log(taxRate);
    const newBill = new billsModel({
      customerName,
      customerNumber,
      subTotal,
      totalAmount,
      tax,
      taxRate,
      paymentMode,
      branch,
      cartItems : parsedCartItems,
      
    });

    await newBill.save();
    res.status(201).json({ message: "Bill Created Successfully" ,success:true});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong",success:false });
  }
};

//get bills data

export const getBillsController = async (req, res) => {
  try {
    const id=req.params.id
    const bills = await billsModel.find({branch:id});
    res.send(bills);
  } catch (error) {
    console.log(error);
  }
};


export const getAllBillsController = async (req, res) => {
  try {
    const bills = await billsModel.find();
    res.send(bills);
  } catch (error) {
    console.log(error);
  }
};