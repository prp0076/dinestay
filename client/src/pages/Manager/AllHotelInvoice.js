import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/auth";

const AllHotelInvoice = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderIdFromUrl = queryParams.get("orderId");
  // State variables
  const [searchResult, setSearchResult] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [orderIdInput, setOrderIdInput] = useState(orderIdFromUrl || "");
  const [printButtonVisible, setPrintButtonVisible] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [CategoryName, setCategoryName] = useState("");
  const [SubCategoryName, setSubCategoryName] = useState("");
  const [auth] = useAuth();
  console.log("AllHotelInvoice Called");
  console.log(filteredOrders,"filteredOrders");
  const formatDate = (d) => {
    if (!d) return ""; 
    const date = new Date(d); 
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options); 
  };
  
  // Function to get the list of orders
  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/all-room-orders");
      setOrders(data.orders);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  const getOrdersCategoryName = async () => {
    try {
      const response = await axios.get(`/api/v1/roomcategory/cat-name/${filteredOrders[0]?.OrderData.parentCategory}`);
    //   setOrders(data.orders);
    setCategoryName(response?.data?.data[0]?.name);
    // console.log(response.data.data[0],"category");
    } catch (error) {
      console.log(error);
    }
  };
  const getOrdersSubcategoryName = async () => {
    try {
      const response = await axios.get(`/api/v1/roomsubcategory/subcat-name/${filteredOrders[0]?.OrderData.parentSubCategory}`);
    //   setOrders(data.orders);
    setSubCategoryName(response?.data?.data[0]?.name);
    //   console.log(response.data.data[0],"subcategory");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(()=>{
   if(filteredOrders){
    getOrdersCategoryName();
    getOrdersSubcategoryName();
   }
  },[filteredOrders])
  // Load orders when the component mounts or when the user's token changes
  useEffect(() => {
    if (auth?.token) {
      getOrders();
    }
  }, [auth?.token]);

  // Filter orders based on orderIdInput
  useEffect(() => {
    if (orderIdInput !== "") {
      const filtered = orders.filter(
        (o) => o?.razorpay?.orderId === orderIdInput
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders([]);
    }
  }, [orderIdInput, orders]);

  // Function to handle user lookup
  const handlePrint = () => {
    setPrintButtonVisible(false);
    window.print();
  };

  return (
    <div className="flex flex-col items-center justify-center">
    <div className="bg-white rounded-lg overflow-hidden shadow-xl p-8 max-w-screen-md">
        <div
          id="invoice-POS"
          //   ref={componentRef}
          className="bg-white p-8 shadow-lg rounded-lg"
          style={{
            width: "80%", // Adjust the width as needed
            margin: "0 auto",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div id="top" className="text-center mb-4">
            <img
              src="https://img.freepik.com/free-vector/detailed-chef-logo-template_23-2148987940.jpg"
              className="logo bg-gray-200 w-16 h-16 rounded-full mx-auto"
              alt="Logo"
            />
            <div className="info mt-2">
              <h2 className="text-xl font-bold">Hotel Management</h2>
              <p>Contact: 123456 | Mumbai Maharashtra</p>
            </div>
          </div>

          <div id="mid">
            <table className="min-w-full bg-white border-collapse border border-red-600">
              <thead className="bg-red-600 text-white">
                <tr>
                  <th className="py-2 px-4 text-left" colspan="2">
                    Customer Details
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b-2  border-red-500">
                  <td className="py-2 px-4 font-semibold">Id</td>
                  <td className="py-2 px-4">
                    <b>{filteredOrders[0]?.razorpay.orderId}</b>
                  </td>
                </tr>
                <tr className="border-b-2 border-red-500">
                  <td className="py-2 px-4 font-semibold whitespace-no-wrap">
                    Customer Name
                  </td>
                  <td className="py-2 px-4 whitespace-no-wrap">
                    <b>{filteredOrders[0]?.OrderData.name}</b>
                  </td>
                </tr>
                <tr className="border-b-2 border-red-500">
                  <td className="py-2 px-4 font-semibold whitespace-no-wrap">
                    Checkin Time
                  </td>
                  <td className="py-2 px-4 whitespace-no-wrap">
                    <b>{formatDate(filteredOrders[0]?.OrderData.checkin)}</b>
                  </td>
                </tr>
                
                <tr className="border-b-2 border-red-500">
                  <td className="py-2 px-4 font-semibold whitespace-no-wrap">
                    Checkout Time
                  </td>
                  <td className="py-2 px-4 whitespace-no-wrap">
                    <b>{formatDate(filteredOrders[0]?.OrderData.checkout)}</b>
                  </td>
                </tr>
                <tr className="border-b-2 border-red-500">
                  <td className="py-2 px-4 font-semibold whitespace-no-wrap">
                    Room Type
                  </td>
                  <td className="py-2 px-4 whitespace-no-wrap">
                    <b>{CategoryName}</b>
                  </td>
                </tr>
                <tr className="border-b-2 border-red-500">
                  <td className="py-2 px-4 font-semibold whitespace-no-wrap">
                    Bed Type
                  </td>
                  <td className="py-2 px-4 whitespace-no-wrap">
                    <b>{SubCategoryName}</b>
                  </td>
                </tr>
                <tr className="border-b-2 border-red-500">
                  <td className="py-2 px-4 font-semibold whitespace-no-wrap">
                    Phone No
                  </td>
                  <td className="py-2 px-4 whitespace-no-wrap">
                    <b>{filteredOrders[0]?.OrderData.phone}</b>
                  </td>
                </tr>
                <tr className="border-b-2 border-red-500">
                  <td className="py-2 px-4 font-semibold">Date</td>
                  <td className="py-2 px-4">
                    <b>{formatDate(filteredOrders[0]?.createdAt)}</b>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div id="bot">
            <div className="mt-4 border border-red-500 p-4 rounded-lg">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="tabletitle">
                    <td />
                    <td />
                    <td className="Rate text-left">Taxable Total</td>
                    <td className="payment text-left">
                      <b>₹{filteredOrders[0]?.amount}</b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div id="legalcopy" className="mt-4">
              <p className="legal">
                <strong>Thank you for your booking!</strong> Please note that
                this is a non-refundable amount. For any assistance, please
                email <b>help@mydomain.com</b>.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handlePrint}
            className="bg-blue-500 text-white px-4 py-2 flex justify-end mt-4 mx-12 rounded hover:bg-blue-600"
          >
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllHotelInvoice;
