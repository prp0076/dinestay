import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/auth";
import toast from "react-hot-toast";

const HistoryHotelOrder = () => {
  const [hotelOrders, setHotelOrders] = useState([]);
  const [categoryNames, setCategoryNames] = useState({});
  const [auth] = useAuth();

  const getAllHotelOrders = async () => {
    try {
      const result = await axios.get(
        `/api/v1/hotel/Hotel-Order-list/${auth?.user?._id}`
      );
      console.log(result);
      console.log(result?.data);
      setHotelOrders(result?.data?.Orders);
    } catch (error) {
      console.error(error);
      toast.error("Something Went Wrong");
    }
  };

  const getOrdersCategoryName = async (id) => {
    try {
      const response = await axios.get(`/api/v1/roomcategory/cat-name/${id}`);
      return response?.data?.data[0]?.name;
    } catch (error) {
      console.log(error);
      return "";
    }
  };

  const getOrdersSubcategoryName = async (id) => {
    try {
      const response = await axios.get(`/api/v1/roomsubcategory/subcat-name/${id}`);
      return response?.data?.data[0]?.name;
    } catch (error) {
      console.log(error);
      return "";
    }
  };

  // Function to fetch and set category and subcategory names for all orders
  const fetchCategoryAndSubcategoryNamesForAllOrders = async () => {
    let categoryNamesForOrders = {};
    for (const order of hotelOrders) {
      const categoryName = await getOrdersCategoryName(order?.OrderData?.parentCategory);
      const subcategoryName = await getOrdersSubcategoryName(order?.OrderData?.parentSubCategory);
      categoryNamesForOrders[order._id] = { categoryName, subcategoryName };
    }
    setCategoryNames(categoryNamesForOrders);
  };

  useEffect(() => {
    if (auth?.user?._id) {
      getAllHotelOrders();
    }
  }, [auth?.user?._id]);

  // Use a separate effect to fetch and set category and subcategory names for all orders
  useEffect(() => {
    if (hotelOrders.length > 0) {
      fetchCategoryAndSubcategoryNamesForAllOrders();
    }
  }, [hotelOrders]);

  return (
    <div className="row p-5 dashboard">
      <div className="col-md-3" style={{ width: "378px", marginLeft: "22px" }}>
      </div>
      <div className="col-md-8">
      <h2 className="text-center mb-4">Your Hotel Orders</h2>
      <div className="overflow-x-auto ">
        <table className="min-w-full table-auto">
            <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-2 px-3 text-left">Order ID</th>
                <th className="py-2 px-3 text-left">User Name</th>
                <th className="py-2 px-3 text-left">Check-In</th>
                <th className="py-2 px-3 text-left">Check-Out</th>
                <th className="py-2 px-3 text-left">Room Category</th>
                <th className="py-2 px-3 text-left">Subcategory</th>
                <th className="py-2 px-3 text-left">Amount</th>
                <th className="py-2 px-3 text-left">Room Count</th>
            </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
            {hotelOrders.length === 0 ? (
                <tr>
                <td colSpan="8" className="py-3 px-3 text-center">No Orders Found</td>
                </tr>
            ) : (
                hotelOrders.map((order) => (
                <tr
                    className="border-b border-gray-200 hover-bg-gray-100"
                    key={order._id}
                >
                    <td className="py-3 px-3 text-left"> {order?.razorpay?.orderId}</td>
                    <td className="py-3 px-3 text-left">{order?.OrderData?.name}</td>
                    <td className="py-3 px-3 text-left">{order?.OrderData?.checkin}</td>
                    <td className="py-3 px-3 text-left">{order?.OrderData?.checkout}</td>
                    <td className="py-3 px-3 text-left">{categoryNames[order._id]?.categoryName}</td>
                    <td className="py-3 px-3 text-left">{categoryNames[order._id]?.subcategoryName}</td>
                    <td className="py-3 px-3 text-left">{order?.amount}</td>
                    <td className="py-3 px-3 text-left">{order?.OrderData?.roomCount}</td>
                </tr>
                ))
            )}
            </tbody>
        </table>
     </div>

      </div>
    </div>
  );
};

export default HistoryHotelOrder;