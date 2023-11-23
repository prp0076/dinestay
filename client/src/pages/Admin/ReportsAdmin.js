import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import moment from "moment/moment";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/auth";
const ReportsAdmin = () => {
  let [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  // eslint-disable-next-line
  const [auth, setAuth] = useAuth();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState("");
  const [selectedbranchid, setSelectedBranchId] = useState("");
  const [branch, setBranch] = useState([]);

  const getBills = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/bills/get-bills/${selectedbranchid}`
      );
      setBills(data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleBranchSelect = (event) => {
    const selectedBranch = event.target.value;
    setSelectedBranchId(selectedBranch);
  };
  useEffect(() => {
    getBills();
  }, [selectedbranchid]);
  const getAllBranch = async () => {
    try {
      const { data } = await axios.get("/api/v1/branch/get-all-branch");
      setBranch(data);
    } catch (error) {
      console.error(error);
      toast.error("Something Went Wrong");
    }
  };
  useEffect(() => {
    if (auth?.token) {
      getBills();
      getAllBranch();
    }
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

  return (
    <div className="container mx-auto bg-white rounded-lg p-4 lg:p-8">
      <h1 className="text-2xl lg:text-3xl font-semibold text-center mb-4">
        All Bills
      </h1>

      <div className="lg:flex lg:justify-between lg:items-center mb-4">
        <div className="mb-4 lg:mb-0 lg:flex lg:items-center">
          <label className="mr-2">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded-md px-2 py-1 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div className="mb-4 lg:mb-0 lg:ml-4 lg:flex lg:items-center">
          <label>Select a branch:</label>
          <select
            value={selectedbranchid}
            onChange={handleBranchSelect}
            className="ml-2 border rounded-md px-2 py-1 focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="">All Branch</option>
            {branch.map((branchItem) => (
              <option key={branchItem._id} value={branchItem._id}>
                {branchItem.name}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:flex lg:items-center">
          <label className="mr-2">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded-md px-2 py-1 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
      </div>

      <div className="bg-blue-100 p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-xl font-semibold mb-2">
          Total Amount for Selected Date Range: ₹{totalAmount.toFixed(2)}
        </h2>
      </div>

      <div className="h-screen overflow-x-auto">
        <table className="table-auto w-full">
          <thead className="bg-gray-200 text-gray-800 sticky top-0">
            <tr>
              <th className="py-2 px-4 text-left">SNo.</th>
              <th className="py-2 px-4 text-left">Items</th>
              <th className="py-2 px-4 text-left">Customer Name</th>
              <th className="py-2 px-4 text-left">Customer Number</th>
              <th className="py-2 px-4 text-left">Taxable Amount</th>
              <th className="py-2 px-4 text-left">Tax</th>
              <th className="py-2 px-4 text-left">Net Amount</th>
              <th className="py-2 px-4 text-left">Payment Mode</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredBills.map((b, i) => (
              <tr key={b._id}>
                <td className="py-2 px-4">{i + 1}</td>
                <td>
                  {b?.cartItems?.map((c, j) => (
                    <p key={j}>{c.name}</p>
                  ))}
                </td>
                <td className="py-2 px-4">{b.customerName}</td>
                <td className="py-2 px-4">{b.customerNumber}</td>
                <td className="py-2 px-4">${b.totalAmount}</td>
                <td className="py-2 px-4">${b.tax}</td>
                <td className="py-2 px-4">${b.subTotal}</td>
                <td className="py-2 px-4">{b.paymentMode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ReportsAdmin;
