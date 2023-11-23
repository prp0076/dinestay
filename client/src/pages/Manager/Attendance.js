import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "antd";

const Attendance = () => {
  const [staff, setStaff] = useState([]);
  const [presentData, setAt] = useState({});
  const [disabledButtons, setDisabledButtons] = useState({});
  const b_id = JSON.parse(localStorage.getItem("auth")).user.branch;
  const tokenn = JSON.parse(localStorage.getItem("auth")).token;
  console.log(tokenn, "tokeokeokeok");

  const getAllStaff = async () => {
    try {
      const axiosConfig = {
        headers: {
          Authorization: `${tokenn}`,
        },
      };
      const { data } = await axios.get("/api/v1/at/get-stf");
      const allstDatafromusermodel = await axios.get(
        `/api/v1/auth/get-staff-manager/${b_id}`,
        axiosConfig
      );
      setStaff(allstDatafromusermodel.data);
    } catch (error) {
      console.error(error);
      toast.error("Something Went Wrong");
    }
  };
  const getAtend = async () => {
    try {
      const response = await axios.get("/api/v1/at/get-at");
      console.log(response, "getatend");
      const atendData = response.data.reduce((acc, cur) => {
        acc[cur.staff] = cur.atend;
        return acc;
      }, {});
      setAt(atendData);
    } catch (error) {
      console.error(error);
      toast.error("Something Went Wrong");
    }
  };

  const resultZero = async () => {
    const result = prompt(
      "Are you sure to reset all Attendance to 0 then type YES "
    );
    if (result === "yes" || result === "YES") {
      try {
        await axios.put("/api/v1/at/zero-at");
        toast.success("Attendance recorded successfully");
        const updatedPresentData = {};

        for (const p of staff) {
          updatedPresentData[p._id] = 0;
        }

        setAt(updatedPresentData);
      } catch (error) {
        console.error(error);
        toast.error("Failed to create attendance");
      }
    }
  };

  const savePresent = async () => {
    try {
      await axios.post("/api/v1/at/create-pr", {
        staff,
        presentData,
      });

      const updatedPresentData = {};

      for (const p of staff) {
        updatedPresentData[p._id] = 0;
      }

      setAt(updatedPresentData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save attendance");
    }
  };

  const handleButtonClick = async (_id, atendValue) => {
    if (!disabledButtons[_id]) {
      try {
        await axios.post("/api/v1/at/create-at", {
          atend: atendValue,
          staff: _id,
        });

        const buttonTimestampKey = `${atendValue}ButtonTimestamp_${_id}`;

        localStorage.setItem(
          buttonTimestampKey,
          JSON.stringify({
            timestamp: new Date().getTime(),
          })
        );

        setDisabledButtons({ ...disabledButtons, [_id]: true });
        getAtend(); // Call getAtend to update attendance after button click
      } catch (error) {
        console.error(error);
        toast.error("Failed to create attendance");
      }
    }
  };

  useEffect(() => {
    getAllStaff();
    getAtend(); // Fetch initial attendance data

    const now = new Date().getTime();
    const updatedDisabledButtons = {};

    for (const p of staff) {
      for (const atendValue of [1, 0, 0.5]) {
        const buttonTimestampKey = `${atendValue}ButtonTimestamp_${p._id}`;
        const buttonTimestamp = JSON.parse(
          localStorage.getItem(buttonTimestampKey)
        );

        if (
          buttonTimestamp &&
          now - buttonTimestamp.timestamp < 8 * 60 * 60 * 1000
        ) {
          updatedDisabledButtons[p._id] = true;
        }
      }
    }
    setDisabledButtons(updatedDisabledButtons);
  }, []);

  return (
    <div className="row p-5 dashboard">
      <div className="col-md-8">
        <h1 className="text-center text-3xl font-bold pb-4 border-b-2 text-sky-800 ">
          Attendance System
        </h1>
        <div className="overflow-x-auto">
          <Button
            className="font-cursive bg-teal-950 text-white mr-3 text-white pb-10px m-1"
            onClick={() => {
              savePresent();
              resultZero();
            }}
          >
            Save and Reset
          </Button>
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal text-blue-700">
                <th className="py-2 px-3 text-left">S.no</th>
                <th className="py-2 px-3 text-center">Name</th>
                <th className="py-2 px-3 text-center">Email</th>
                <th className="py-2 px-3 text-center">Phone</th>
                <th className="py-2 px-3 text-center">Attendance</th>
                <th className="py-2 px-3 text-left">Days</th>
              </tr>
            </thead>
            <tbody>
              {staff?.map((p, index) => (
                <tr
                  className="border-b border-gray-200 hover:bg-gray-100 map-row"
                  key={p._id}
                >
                  <td className="py-3 px-3 text-left text-teal-950">
                    {index + 1}
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
                  <td className="py-3 px-3 text-center">
                    <Button
                      className="font-cursive bg-green-400 text-white mr-3 pb-10px"
                      onClick={() => {
                        handleButtonClick(p._id, 1);
                      }}
                      disabled={disabledButtons[p._id]}
                    >
                      P
                    </Button>
                    <Button
                      className="font-cursive bg-rose-500 text-white mr-3 pb-10px"
                      onClick={() => {
                        handleButtonClick(p._id, 0);
                      }}
                      disabled={disabledButtons[p._id]}
                    >
                      A
                    </Button>
                    <Button
                      className="font-cursive bg-fuchsia-500 text-white mr-3 pb-10px"
                      onClick={() => {
                        handleButtonClick(p._id, 0.5);
                      }}
                      disabled={disabledButtons[p._id]}
                    >
                      HP
                    </Button>
                  </td>
                  <td className="py-3 px-3 text-left">
                    {presentData && presentData[p._id] !== undefined && (
                      <div className="display-flex">
                        <div className="py-3 px-3 text-left text-teal-950">
                          {presentData[p._id]}
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
