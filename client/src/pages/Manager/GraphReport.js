import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/auth";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const GraphReport = () => {
  const [bills, setBills] = useState([]);
  const [auth] = useAuth();
  const [dateRange, setDateRange] = useState("Last 7 Days");
  const [data, setData] = useState([]);
  const id = JSON.parse(localStorage.getItem("auth")).user.branch;

  const getOrders = async () => {
    try {
      const { data } = await axios.get(`/api/v1/bills/get-bills/${id}`);
      setBills(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  useEffect(() => {
    let startDate;
    let endDate = new Date();
    switch (dateRange) {
      case "Today":
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        break;
      case "Yesterday":
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setHours(23, 59, 59, 999);
        break;
      case "Last 24 Hours":
        startDate = new Date();
        startDate.setHours(startDate.getHours() - 24);
        break;
      case "Last 7 Days":
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "Last 30 Days":
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        break;
      case "Last Year":
        startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        break;
    }

    const filtered = bills.filter(
      (b) => new Date(b.date) >= startDate && new Date(b.date) <= endDate
    );

    const groupedData = filtered.reduce((result, order) => {
      const orderDate = new Date(order.date).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const existingEntry = result.find((entry) => entry.date === orderDate);

      if (existingEntry) {
        existingEntry.amount += order.subTotal;
      } else {
        result.push({
          date: orderDate,
          amount: order.subTotal,
        });
      }

      return result;
    }, []);

    setData(groupedData);
  }, [dateRange, bills]);

  return (
    <div className="container p-4">
      <div className=" ">
        <h1 className="text-center text-3xl font-semibold mb-4">
          Sales Reports in Histogram
        </h1>
        <div className="date-range flex justify-center grid sm:grid-row-1 md:grid-row-1 xl:grid-row-1 items-center p-3">
          <label className="mr-2">Select Range:</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border rounded-md px-2 py-1 focus:outline-none focus:ring focus:border-blue-300"
          >
            <option>Today</option>
            <option>Yesterday</option>
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last Year</option>
          </select>
        </div>
        <div className="chart-container  mb-8">
          <div className="mb-4">
            <h2 className="text-center text-2xl font-semibold mb-4">
              Sales Reports in Bar Chart
            </h2>
            <div className="overflow-x-auto">
              <BarChart width={1000} height={400} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="rgba(75, 192, 192, 0.6)" />
              </BarChart>
            </div>
          </div>
          <div>
            <h2 className="text-center text-2xl font-semibold mb-4">
              Sales Reports in Line Chart
            </h2>
            <div className="overflow-x-auto">
              <LineChart width={1000} height={400} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line dataKey="amount" stroke="rgba(75, 192, 192, 0.6)" />
              </LineChart>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphReport;
