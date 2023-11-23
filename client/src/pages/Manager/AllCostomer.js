import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import moment from "moment/moment";

const AllCustomer = () => {
  const [staff, setStaff] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Function to get all customers
  const getAllCustomer = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/get-customer");
      setStaff(data);
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  // Filter and update the data when start and end date change
  useEffect(() => {
    getAllCustomer();
  }, [startDate, endDate]);

  // Filter the data based on the selected date range
  const filteredStaff = staff.filter((p) => {
    const createdAt = moment(p.createdAt).format("YYYY-MM-DD");
    return (
      (!startDate || createdAt >= startDate) &&
      (!endDate || createdAt <= endDate)
    );
  });

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-semibold text-center mb-6 text-blue-600">
        All Customer List
      </h1>

      <div className="flex flex-col md:flex-row justify-center md:justify-between m-2">
        <div className="flex flex-col md:flex-row items-center mb-2 md-0">
          <label className="mr-2">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded-md px-2 py-1 focus-outline-none focus-ring focus-border-blue-300"
          />
        </div>
        <div className="flex flex-col md-flex-row items-center">
          <label className="mr-2">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded-md px-2 py-1 focus-outline-none focus-ring focus-border-blue-300"
          />
        </div>
      </div>

      {startDate && endDate && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((p, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover-bg-gray-200 transition duration-300 ease-in-out`}
                >
                  <td className="px-4 py-2">
                    {moment(p.createdAt).format("DD-MM-YYYY")}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">{p.name}</td>
                  <td className="py-3 px-4">{p.email}</td>
                  <td className="py-3 px-4">{p.phone}</td>
                  <td className="py-3 px-4">{p.address}</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllCustomer;