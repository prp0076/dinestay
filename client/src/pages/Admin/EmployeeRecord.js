import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";
const EmployeeRecord = () => {
  const [staff, setStaff] = useState([]);
  console.log(staff,"staff");
  // eslint-disable-next-line
  const [auth, setAuth] = useAuth();
  const [selectedbranchid, setSelectedBranchId] = useState("");
  const [branch, setBranch] = useState([]);
  //getall Staff
  const tokenn = JSON.parse(localStorage.getItem("auth"))?.token;
  const handleBranchSelect = (event) => {
    const selectedBranch = event.target.value;
    setSelectedBranchId(selectedBranch);
  };
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
      getAllBranch();
    }
  }, [auth?.token]);

  const getAllStaff = async () => {
    try {
      const axiosConfig = {
        headers: {
          Authorization: `${tokenn}`,
        },
      };
      const response = await axios.get(
        `/api/v1/auth/get-staff/${selectedbranchid}`,
        axiosConfig
      );
      console.log(response,"resdata");
      setStaff(response?.data);
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  //lifecycle method
  useEffect(() => {
    getAllStaff();
  }, [selectedbranchid]);

  const handleGoBack = () => {
    window.location.reload(); // This will navigate back one step in the history stack
  };

  return (
    <div className="p-5 dashboard">
      <div className="mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
          onClick={handleGoBack}
        >
          Back
        </button>
      </div>
      <div>
        <label>Select a branch:</label>
        <select
          value={selectedbranchid}
          onChange={handleBranchSelect}
          className="border rounded-md px-2 py-1 focus:outline-none focus:ring focus:border-blue-300"
        >
          {branch?.map((branchItem) => (
            <option key={branchItem._id} value={branchItem._id}>
              {branchItem.name}
            </option>
          ))}
        </select>
      </div>
      <div className="lg:col-span-8 mt-5">
        {" "}
        {/* Adjust column span for responsiveness */}
        <h1 className="text-center text-2xl lg:text-3xl mb-4">
          All Staff List
        </h1>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-xs lg:text-sm leading-normal">
                <th className="py-2 px-3 lg:px-4 text-left">Name</th>
                <th className="py-2 px-3 lg:px-4 text-left">Designation</th>
                <th className="py-2 px-3 lg:px-4 text-left">Email</th>
                <th className="py-2 px-3 lg:px-4 text-left">Phone</th>
                <th className="py-2 px-3 lg:px-4 text-left">Address</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-xs lg:text-sm font-light">
              {staff?.map((p) => (
                <tr className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-3 lg:px-4 text-left">{p.name}</td>
                  <td className="py-3 px-3 lg:px-4 text-left">
                    {p.role === 3 ? "Staff" : p.role === 2 ? "Manager" : ""}
                  </td>
                  <td className="py-3 px-3 lg:px-4 text-left">{p.email}</td>
                  <td className="py-3 px-3 lg:px-4 text-left">{p.phone}</td>
                  <td className="py-3 px-3 lg:px-4 text-left">{p.address}</td>
                  {/* Add more columns here if needed */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeRecord;
