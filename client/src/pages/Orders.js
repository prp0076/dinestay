import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../context/auth";
const Orders = () => {
  const [orders, setOrders] = useState([]);
  // eslint-disable-next-line
  const [auth, setAuth] = useAuth();

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/orders");

      console.log(data);
      const sortedOrders = data.sort(
        (a, b) =>
          new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()
      );
      setOrders(sortedOrders);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getOrders();
    }
  }, [auth?.token]);

  return (
    <Layout title={"Your Orders"}>
      <div className="container mt-12 flex justify-center content-center item-center">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="col-span-2">
            <h1 className="text-center text-2xl font-bold mb-4 mt-6">
              All Orders
            </h1>
            {orders?.map((o, i) => {
              return (
                <div
                  className="border rounded-lg  overflow-x-auto shadow mb-4"
                  key={o?.razorpay?.orderId}
                >
                  <table className="table-auto w-auto sm:w-full">
                    <thead>
                      <tr>
                        <th className="px-4 py-2">#</th>
                        <th className="px-4 py-2">Order ID</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Buyer</th>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Payment</th>
                        <th className="px-4 py-2">Payment Mode</th>
                        <th className="px-4 py-2">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-4 py-2">{i + 1}</td>
                        <td className="px-4 py-2">{o?.razorpay?.orderId}</td>
                        <td className="px-4 py-2">{o?.status}</td>
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
                      </tr>
                    </tbody>
                  </table>
                  <div className="mt-4">
                    {o?.products?.map((p, i) => (
                      <div
                        className="flex items-center mb-2 p-3 border rounded-lg"
                        key={p._id}
                      >
                        <div className="w-1/4">
                          <img
                            src={`/api/v1/food/food-photo/${p._id}`}
                            alt={p.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        </div>
                        <div className="w-3/4 ml-4">
                          <p className="font-semibold">{p.name}</p>
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
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
