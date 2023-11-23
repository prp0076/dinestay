import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment/moment";
const Reports = () => {
  let [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  // eslint-disable-next-line
  const [auth, setAuth] = useAuth();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState("");
  const id = JSON.parse(localStorage.getItem("auth")).user.branch;
  const getBills = async () => {
    try {
      const { data } = await axios.get(`/api/v1/bills/get-bills/${id}`);
      setBills(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (auth?.token) getBills();
  }, [auth?.token]);
  useEffect(() => {
    const filtered = bills.filter((b) =>
      moment(b.date).isBetween(startDate, endDate, null, "[]")
    );
    setFilteredBills(filtered);
  }, [startDate, endDate, bills]);
  const totalAmount = filteredBills.reduce((total, o) => total + o.subTotal, 0);

  const handleBill = (billsData) => {
    setSelectedBill(billsData);
    setOpen(true);
  };

  const handleGoBack = () => {
    window.location.reload(); // This will navigate back one step in the history stack
  };

  return (
    <div className="container mx-auto bg-white rounded-lg p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        <div className="mb-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
            onClick={handleGoBack}
          >
            Back
          </button>
        </div>
        <div className="lg:col-span-3">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-center mb-4">
            All Bills
          </h1>

          <div className="flex flex-col md:flex-row justify-center md:justify-between m-2">
            <div className="flex flex-col md:flex-row items-center mb-2 md:mb-0">
              <label className="mr-2">Start Date:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded-md px-2 py-1 focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div className="flex flex-col md:flex-row items-center">
              <label className="mr-2">End Date:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded-md px-2 py-1 focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
          </div>
          <div className="bg-blue-100 p-2 md:p-4 rounded-lg shadow-md mb-4">
            <h2 className="font-bold font-mono text-xl md:text-2xl lg:text-3xl">
              Total Amount for Selected Date Range: ₹{totalAmount.toFixed(2)}
            </h2>
          </div>

          <div className="table-responsive overflow-x-auto">
            <table className="table-auto w-full">
              <thead className="bg-gray-200 text-gray-800 text-center">
                <tr>
                  <th className="py-2 px-2 md:py-4 md:px-4 lg:py-6 lg:px-6 text-left">
                    SNo.
                  </th>
                  <th className="py-2 px-2 md:py-4 md:px-4 lg:py-6 lg:px-6 text-left">
                    Items
                  </th>
                  <th className="py-2 px-2 md:py-4 md:px-4 lg:py-6 lg:px-6 text-left">
                    Customer Name
                  </th>
                  <th className="py-2 px-2 md:py-4 md:px-4 lg:py-6 lg:px-6 text-left">
                    Customer Number
                  </th>
                  <th className="py-2 px-2 md:py-4 md:px-4 lg:py-6 lg:px-6 text-left">
                    Taxable Amount
                  </th>
                  <th className="py-2 px-2 md:py-4 md:px-4 lg:py-6 lg:px-6 text-left">
                    Tax
                  </th>
                  <th className="py-2 px-2 md:py-4 md:px-4 lg:py-6 lg:px-6 text-left">
                    Net Amount
                  </th>
                  <th className="py-2 px-2 md:py-4 md:px-4 lg:py-6 lg:px-6 text-left">
                    Payment Mode
                  </th>
                </tr>
              </thead>
              <tbody className="text-center">
                {filteredBills.map((b, i) => (
                  <tr key={b._id}>
                    <td className="py-2 px-2 md:py-4 md:px-4 lg:py-6 lg:px-6">
                      {i + 1}
                    </td>
                    <td className="py-2 px-2 md:py-4 md:px-4 lg:py-6 lg:px-6">
                      {b?.cartItems?.map((c) => (
                        <p key={c._id}>{c.name}</p>
                      ))}
                    </td>
                    <td className="py-2 px-2 md:py-4 md:px-4 lg:py-6 lg:px-6">
                      {b.customerName}
                    </td>
                    <td className="py-2 px-2 md:py-4 md:px-4 lg:py-6 lg:px-6">
                      {b.customerNumber}
                    </td>
                    <td className="py-2 px-2 md:py-4 md:px-4 lg:py-6 lg:px-6">
                      ₹{b.totalAmount}
                    </td>
                    <td className="py-2 px-2 md:py-4 md:px-4 lg:py-6 lg:px-6">
                      ₹{b.tax}
                    </td>
                    <td className="py-2 px-2 md:py-4 md:px-4 lg:py-6 lg:px-6">
                      ₹{b.subTotal}
                    </td>
                    <td className="py-2 px-2 md:py-4 md:px-4 lg:py-6 lg:px-6">
                      {b.paymentMode}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Reports;
