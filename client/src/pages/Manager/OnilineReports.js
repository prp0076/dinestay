import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment/moment";

const OnlineReports = () => {
  let [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  // eslint-disable-next-line
  const [auth, setAuth] = useAuth();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const id = JSON.parse(localStorage.getItem("auth")).user.branch;
  const getOrders = async () => {
    try {
      const { data } = await axios.get(`/api/v1/auth/all-orders/${id}`);
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  useEffect(() => {
    const filtered = orders.filter((o) =>
      moment(o.createdAt).isBetween(startDate, endDate, null, "[]")
    );
    setFilteredOrders(filtered);
  }, [startDate, endDate, orders]);

  const totalAmount = filteredOrders.reduce((total, o) => total + o.amount, 0);

  return (
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-3xl text-center mb-4">All Orders</h1>
      <div className="flex justify-between space-x-4">
        <div>
          <label className="p-1">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="p-1">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full mt-4">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2">S. NO.</th>
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">Buyer Name</th>
              <th className="px-4 py-2">Payment</th>
              <th className="px-4 py-2">Payment mode</th>
              <th className="px-4 py-2">Total Amount</th>
              <th className="px-4 py-2">Order Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((o, i) => (
              <tr key={o._id}>
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2">{o?.razorpay?.orderId}</td>
                <td className="px-4 py-2">{o?.buyer?.name}</td>
                <td className="px-4 py-2">
                  {o?.isPaid?.true ? "Failed" : "Success"}
                </td>
                <td className="px-4 py-2">
                  {o?.paymentMode ? "Online" : "Cash"}
                </td>
                <td className="px-4 py-2">{Math.round(o.amount)}</td>
                <td className="px-4 py-2">
                  {moment(o.createdAt).format("DD-MM-YYYY")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="font-bold text-2xl mt-4">
        Total Amount for Selected Date Range: {totalAmount.toFixed(2)}
      </p>
    </div>
  );
};

export default OnlineReports;
