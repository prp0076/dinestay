import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
const AllManager = () => {
  const [branch, setBranch] = useState([]);
  const [manager, setManager] = useState([]);

  // Function to fetch all branch data
  const getAllBranch = async () => {
    try {
      const { data } = await axios.get("/api/v1/branch/get-all-branch");
      setBranch(data);
    } catch (error) {
      console.error(error);
      toast.error("Something Went Wrong");
    }
  };

  const getAllManager = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/get-manager");
      setManager(data);
    } catch (error) {
      console.error(error);
      toast.error("Something Went Wrong");
    }
  };

  // Lifecycle method to fetch data when the component mounts
  useEffect(() => {
    getAllBranch();
    getAllManager();
  }, []);

  // Function to filter manager data by matching IDs
  const getManagerById = (branchId) => {
    return branch.find((b) => b._id === branchId);
  };
  return (
    <div className="row p-5  dashboard">
      <div className="col-md-3" style={{ width: "378px", marginLeft: "22px" }}>
        {/* <AdminMenu /> */}
      </div>
      <div className="col-md-8 ">
        <h1 className="text-center">All manager List</h1>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-2 px-3 text-left">Name</th>
              <th className="py-2 px-3 text-left">Email</th>
              <th className="py-2 px-3 text-left">Phone</th>
              <th className="py-2 px-3 text-left">Address</th>
              <th className="py-2 px-3 text-left">Branch Name</th>
              <th className="py-2 px-3 text-left">Branch address</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {manager?.map(
              (b) =>
                b.branch &&
                getManagerById(b.branch) && (
                  <tr className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-3 text-left">{b.name}</td>
                    <td className="py-3 px-3 text-left">{b.email}</td>
                    <td className="py-3 px-3 text-left">{b.phone}</td>
                    <td className="py-3 px-3 text-left">{b.address}</td>
                    <td className="py-3 px-3 ">
                      {getManagerById(b.branch).name}
                    </td>
                    <td className="py-3 px-3 ">
                      {getManagerById(b.branch).address}
                    </td>
                    {/* Add more columns here if needed */}
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllManager;
