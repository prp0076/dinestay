import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";
import JWT from "jsonwebtoken";
import OrderRazor from "../models/orderRazor.js";
import OrderHotelRazor from "../models/OrderHotelRazor.js"
//payment verify
export const razorPayKeyController = async (req, res) => {
  res.send({ key: process.env.RAZORPAY_KEY_ID });
};
//payment verify
export const razorPayCreatOrderController = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });
    const options = {
      amount: req.body.amount,
      currency: "INR",
    };
    const orderRazor = await instance.orders.create(options);
    if (!orderRazor) return res.status(500).send("Some error occured");
    res.send(orderRazor);
  } catch (error) {
    res.status(500).send(error);
  }
};

//it is scondary code for changig bcz of the COD

export const CODPayCreatOrderController = async (req, res) => {
  try {
    const { isPaid, paymentMode,amount, razorpay, products, buyer ,branch} = req.body;
    // console.log(buyer, "ispaid");
    const OrderCod = await new OrderRazor({
      isPaid,
      paymentMode,
      amount,
      razorpay,
      products,
      buyer,
     branch
    }).save();
    if (!OrderCod) return res.status(500).send("Some error occured");
    res.send({
      OrderCod,
      success:true
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

//verify the payment and save in the database for COD

export const CODPayOrderController = async (req, res) => {
  try {
    const { paymentMode,amount, products, razorpay, buyer } = req.body;
    let totalAmount = 0;
    products.map((item) => {
      totalAmount =
        totalAmount +
        (item.price * item.customQuantity)
    });
    const newOrder = new OrderRazor({
      isPaid: true,
      paymentMode: false,
      amount: totalAmount,
      products: products,
      razorpay: razorpay,
      buyer: buyer,
    });
    await newOrder.save();
    res.send({
      msg: "Order placed Successful!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};


//payment verify complete
export const razorPayOrderController = async (req, res) => {
  try {
    const {paymentMode, amount, products, razorpay, buyer,branch } = req.body;
    let totalAmount = 0;
    products.map((item) => {
      totalAmount =
        totalAmount +
        (item.price * item.customQuantity);
    });
   
    const newOrder = new OrderRazor({
      isPaid: true,
      paymentMode: true,
      amount: totalAmount,
      products: products,
      razorpay: razorpay,
      buyer: buyer,
      branch
    });
    await newOrder.save();
    res.send({
      msg: "Payment was successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
export const razorHotelPayOrderController = async (req, res) => {
  try {
    const {paymentMode, amount, OrderData, razorpay, buyer,branch } = req.body;
    console.log(paymentMode,"paymentMode");
    console.log(amount,"amount");
    console.log(OrderData,"OrderData");
    console.log(razorpay,"razorpay");
    // console.log(OrderData,"paymentMode");
    console.log(buyer,"buyer");
    console.log(branch,"branch");
    const newOrder = new OrderHotelRazor({
      isPaid: true,
      paymentMode: true,
      amount: amount,
      OrderData:OrderData,
      razorpay: razorpay,
      buyer: buyer,
      branch
    });
    await newOrder.save();
    res.send({
      msg: "Payment was successful",
      success:true,
      newOrder
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
//payment verify
export const razorPayListOrderController = async (req, res) => {
  try {
    const orders = await OrderRazor.find();
    res.send(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
//checkoutflag 
export const razorPayCheckOutFlagOrderController = async (req, res) => {
  try {
    const { orderId } = req.body;
    console.log(orderId,"hello");
    // Assuming OrderRazor is your Mongoose model
    const updatedOrder = await OrderHotelRazor.findOneAndUpdate(
      { 'razorpay.orderId': orderId },
      { $set: { 'OrderData.checkoutflag': true } },
      { new: true }
    );
    if (updatedOrder) {
      res.status(200).send({
        success: true,
        message: 'Order checkout flag updated successfully',
        order: updatedOrder,
      });
    } else {
      res.status(404).send({
        success: false,
        message: 'Order not found with the provided orderId',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: 'Error while updating order checkout flag',
    });
  }
};

//room payment
export const razorPayyCreatOrderController = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });
    const options = {
      amount: req.body.amount,
      currency: "INR",
    };
    const orderRazor = await instance.orders.create(options);
    if (!orderRazor) return res.status(500).send("Some error occured");
    res.send(orderRazor);
  } catch (error) {
    res.status(500).send(error);
  }
};