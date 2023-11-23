import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";
const ActiveHotelOrder = () => {
  const [staff, setStaff] = useState([]);
  const [auth] = useAuth();
  console.log("called");
  function formatDate(dateString) {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    };
    const formattedDate = new Date(dateString).toLocaleString("en-US", options);
    return formattedDate;
  }

  //getall customer
  const getAllOrderByBranch = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/hotel/get-orderbybranch/${auth?.user?.branch}`
      );
      // console.log(data);
      //   const today = new Date().toISOString().split("T")[0];
      const today = new Date().toLocaleDateString();
      console.log(today, "date");
      // Filter orders based on today's checkout date
      const filteredOrders = data.Orders.filter((order) => {
        const checkoutDate = new Date(order?.OrderData?.checkout);
        const formattedCheckoutDate = checkoutDate.toLocaleDateString();
        return checkoutDate && formattedCheckoutDate === today;
      });
      // Set the filtered orders to state
      setStaff(filteredOrders);
      //   setStaff(data.Orders);
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong in Fetching order data");
    }
  };
  const handleCheckout = async (order) => {
    try {
      const { OrderData, razorpay } = order;
      const { parentSubCategory, roomCount } = OrderData;
      const response = await axios.post(
        `/api/v1/rooms/update-quantity/${parentSubCategory}`,
        {
          Addquantity: roomCount,
        }
      );
      const checkoutFlagResponse = await axios.post(
        "/api/v1/payment/checkout-flag",
        {
          orderId: razorpay.orderId,
        }
      );
      if (response.data.success && checkoutFlagResponse.data.success) {
        getAllOrderByBranch();
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };
  //lifecycle method
  useEffect(() => {
    getAllOrderByBranch();
  }, []);

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-semibold text-center mb-6 text-blue-600">
        Today Checkout List
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-3 px-4 text-left">Order Id</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Uniqe Id</th>
              <th className="py-3 px-4 text-left">Check In</th>
              <th className="py-3 px-4 text-left">Check Out</th>
              <th className="py-3 px-4 text-left">Amount</th>
            </tr>
          </thead>
          <tbody>
            {staff.length > 0 ? (
              staff.map((p, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-gray-200 transition duration-300 ease-in-out`}
                >
                  {/* Your existing table data */}
                  <td className="py-3 px-4">{p.razorpay.orderId}</td>
                  <td className="py-3 px-4">{p.OrderData.name}</td>
                  <td className="py-3 px-4">{p.OrderData.idProof}</td>
                  <td className="py-3 px-4">
                    {formatDate(p.OrderData.checkin)}
                  </td>
                  <td className="py-3 px-4">
                    {formatDate(p.OrderData.checkout)}
                  </td>
                  <td className="py-3 px-4">{p.amount}</td>

                  {/* Add a checkout button */}
                  <td className="py-3 px-4">
                    {p.OrderData.checkoutflag ? (
                      <span>Already Checked Out</span>
                    ) : (
                      <button
                        className="bg-blue-500 hover-bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleCheckout(p)}
                      >
                        Checkout
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center text-xl text-gray-600 py-4"
                >
                  No Checkout Order For Today
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveHotelOrder;
