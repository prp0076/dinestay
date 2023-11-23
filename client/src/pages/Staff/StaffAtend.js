import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const StaffAtend = () => {
  const [staff, setStaff] = useState("");
  const [presentData, setAtendData] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState(""); // Change the state name to selectedStaffId

  const handleSelectStaff = () => {
    try {
      const authData = JSON.parse(localStorage.getItem("auth"));
      const userId = authData?.user?._id;
      setSelectedStaffId(userId);
    } catch (error) {
      console.error(error);
      toast.error("Something Went Wrong");
    }
  };

  const getSingleStaff = async () => {
    try {
      const response = await axios.get(
        `/api/v1/at/single-stf/${selectedStaffId}`
      );
      const singleStaffData = response.data;

      setStaff(singleStaffData);
    } catch (error) {
      console.error(error);
      toast.error("Something Went Wrong");
    }
  };
  const getSingleAtend = async () => {
    try {
      const response = await axios.get(
        `/api/v1/at/single-at/${selectedStaffId}`
      );
      const singleAtendData = response.data.atend;

      setAtendData(singleAtendData);
    } catch (error) {
      console.error(error);
      toast.error("Something Went Wrong");
    }
  };

  useEffect(() => {
    handleSelectStaff();
  }, []);

  useEffect(() => {
    if (selectedStaffId) {
      getSingleAtend();
      getSingleStaff();
    }
  }, [selectedStaffId]);

  return (
    <>
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal text-blue-700">
            <th className="py-2 px-3 text-left">Name</th>
            <th className="py-2 px-3 text-center">Email</th>
            <th className="py-2 px-3 text-center">Contact</th>
            <th className="py-2 px-3 text-center">Current Attendance</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-200 hover:bg-gray-100 map-row">
            <td className="py-3 px-3 text-left text-teal-950">{staff.name}</td>
            <td className="py-3 px-3 text-center text-teal-950">
              {staff.email}
            </td>
            <td className="py-3 px-3 text-center text-teal-950">
              {staff.phone}
            </td>
            <td className="py-3 px-3 text-center text-teal-950">
              {presentData}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default StaffAtend;
