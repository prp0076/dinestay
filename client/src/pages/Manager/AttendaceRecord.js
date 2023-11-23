import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import moment from "moment";

const AttendanceRecord = () => {
  const [total, setTotal] = useState([]); // Initialize total as an empty array
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [staff, setStaff] = useState([]);

  const b_id = JSON.parse(localStorage.getItem("auth")).user.branch;
  const tokenn = JSON.parse(localStorage.getItem("auth")).token;

  const filterStaffPresentInBoth = (presentarray, presentstaffdata) => {
    return presentarray.map((presentItem) => {
      const staff = presentItem.staff.filter((staff) =>
        presentstaffdata.some((presentStaff) => presentStaff._id === staff._id)
      );

      return { ...presentItem, staff };
    });
  };
  const getPresent = async () => {
    try {
      const axiosConfig = {
        headers: {
          Authorization: `${tokenn}`,
        },
      };
      const result = await axios.get("/api/v1/at/get-pr");
      const allstDatafromusermodel = await axios.get(
        `/api/v1/auth/get-staff-manager/${b_id}`,
        axiosConfig
      );
      const filteredPresentArray = filterStaffPresentInBoth(
        result.data,
        allstDatafromusermodel.data
      );
      console.log(result.data, "getpresent");
      console.log(filteredPresentArray, "filterpokwfepoewk");
      console.log(allstDatafromusermodel.data, "getpresent");
      // console.log(filteredPresentArray,"filter");
      setTotal(filteredPresentArray);
    } catch (error) {
      console.error(error);
      toast.error("error to fetching data");
    }
  };
  useEffect(() => {
    getPresent();
  }, []);

  useEffect(() => {
    // Filter data based on start and end dates
    const filteredData = total.filter((item) =>
      moment(item.createdAt).isBetween(startDate, endDate, null, "[]")
    );
    setFilteredData(filteredData);
  }, [startDate, endDate, total]);

  return (
    <div className="row p-5 dashboard">
      <div className="col-md-8">
        <h1 className="text-center text-3xl font-bold pb-4 border-b-2 text-sky-800">
          All RECORD
        </h1>
        <div className="overflow-x-auto ">
          <div className="mb-4 md:flex md:justify-between">
            <div className="mb-2 md:mb-0">
              <label className="mr-2">Start Date:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded-md px-2 py-1 focus:outline-none focus:ring focus:border-blue-300 sm:w-20 md:w-auto"
              />
            </div>
            <div className="mb-2 md:mb-0">
              <label className="mr-2">End Date:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded-md px-2 py-1 focus:outline-none focus:ring focus:border-blue-300 sm:w-20 md:w-auto"
              />
            </div>
          </div>

          {/* this is next table */}
          {Array.isArray(filteredData) &&
            filteredData.map((item, index) => {
              const { staff, presentData } = item;
              console.log(presentData, "prprprpr");
              return (
                <div key={index}>
                  <table className="min-w-full table-auto">
                    <thead>
                      <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal text-blue-700">
                        <th className="py-2 px-3 text-left">S.no</th>
                        <th className="py-2 px-3 text-center">Name</th>
                        <th className="py-2 px-3 text-center">Email</th>
                        <th className="py-2 px-3 text-center">Phone</th>

                        <th className="py-2 px-3 text-left">Days</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staff?.map((p, staffIndex) => (
                        <tr
                          className="border-b border-gray-200 hover:bg-gray-100 map-row"
                          key={p.id}
                        >
                          <td className="py-3 px-3 text-left text-teal-950">
                            {staffIndex + 1}
                          </td>
                          <td className="py-3 px-3 text-center text-teal-950">
                            {p.name}
                          </td>
                          <td className="py-3 px-3 text-center text-teal-950">
                            {p.email}
                          </td>
                          <td className="py-3 px-3 text-center text-teal-950">
                            {p.phone}
                          </td>
                          <td className="py-3 px-3 text-left">
                            {presentData[p._id]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default AttendanceRecord;