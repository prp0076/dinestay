import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/auth";
import { Link } from "react-router-dom";
import { FaFileInvoiceDollar } from "react-icons/fa";

const AllOrders = () => {
  const [status] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "Delivered",
    "Canceled",
  ]);
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth(); // Assuming useAuth returns auth object with token
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

  const handleChange = async (orderId, value) => {
    try {
      await axios.put(`/api/v1/auth/order-status/${orderId}`, {
        status: value,
      });
      getOrders();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto mt-4">
      <h1 className="text-3xl text-center mb-4">All Orders</h1>
      {orders?.map((o, i) => (
        <div className="border shadow mb-4 p-2" key={o._id}>
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead className="bg-gray-800 text-white">
                <tr className="text-center">
                  <th className="px-4 py-2">S. No.</th>
                  <th className="px-4 py-2">Order ID</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Buyer</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Payment</th>
                  <th className="px-4 py-2">Payment Mode</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Invoice</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center">
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2">{o?.razorpay?.orderId}</td>
                  <td className="px-4 py-2">
                    <select
                      onChange={(e) => handleChange(o._id, e.target.value)}
                      value={o?.status}
                      className="border rounded p-2"
                    >
                      {status.map((s, index) => (
                        <option key={index} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">{o?.buyer?.name}</td>
                  <td className="px-4 py-2">
                    {new Date(o?.createdAt).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-2">
                    {o?.isPaid?.true ? "Failed" : "Success"}
                  </td>
                  <td className="px-4 py-2">
                    {o?.paymentMode ? "Online" : "Cash"}
                  </td>
                  <td className="px-4 py-2">{o?.products?.length}</td>
                  <td className="px-4 py-2">
                    <Link
                      to={`/dashboard/manager/allInvoice?orderId=${o?.razorpay?.orderId}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaFileInvoiceDollar />
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="container">
            {o?.products?.map((p, j) => (
              <div
                className="flex items-center justify-between  mb-2"
                key={p._id}
              >
                <div className="flex items-center">
                  <img
                    src={`/api/v1/food/food-photo/${p._id}`}
                    className="h-16 w-16 rounded-md object-cover"
                    alt={p.name}
                  />
                  <div className="ml-4">
                    <p className="text-xl font-semibold">{p.name}</p>
                    <p>
                      Price:{" "}
                      {Math.round(p.price).toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </p>
                    <p>Quantity: {p.customQuantity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllOrders;
