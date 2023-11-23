import React, { useState, Fragment, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";

const AllStaff = () => {
  const cancelButtonRef = useRef(null);

  const [staff, setStaff] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState(null); // Use selectedBranchId
  const [open, setOpen] = useState(false);
  //getall Staff
  const bid = localStorage.getItem("auth");
  const auth_b_id = JSON.parse(bid);
  const b_id = auth_b_id?.user?.branch;
  const tokenn = JSON.parse(localStorage.getItem("auth")).token;
  console.log(b_id, "idididididid");
  const getAllStaff = async () => {
    try {
      const axiosConfig = {
        headers: {
          Authorization: `${tokenn}`,
        },
      };
      const { data } = await axios.get(
        `/api/v1/auth/get-staff-manager/${b_id}`,
        axiosConfig
      );
      setStaff(data);
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  //lifecycle method
  useEffect(() => {
    getAllStaff();
  }, []);
  const handleGoBack = () => {
    window.location.reload(); // This will navigate back one step in the history stack
  };

  const handleUpdateClick = (staffId) => {
    // Find the selected branch by its ID
    const selectedStaff = staff.find((b) => b._id === staffId);

    // Populate the name and address fields with the selected branch data
    if (selectedStaff) {
      setName(selectedStaff.name);
      setEmail(selectedStaff.email);
      setPhone(selectedStaff.phone);
      setAddress(selectedStaff.address);
    }

    setSelectedStaffId(staffId);
    setOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `/api/v1/auth/update-staff/${selectedStaffId}`, // Use selectedBranchId
        { name, email, phone, address }
      );
      if (data?.success) {
        toast.success("Staff Updated Successfully");
        getAllStaff();
        // navigate("/");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };


  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      // let answer = window.prompt("Are You Sure want to delete this staff ? ");
      // if (!answer) return;
      // eslint-disable-next-line
      const { data } = await axios.delete(`/api/v1/auth/delete-staff/${selectedStaffId}`);
       if(data.success){
      toast.success("Staff Deleted Successfully");
       getAllStaff();
       setOpen(false)
      //  navigate("/");
       }
      
      
    } catch (error) {
      console.log(error); 
      toast.error("Something went wrong"); 
    }
  };


  return (
    <div className="container mx-auto mt-8">
      <div className="mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
          onClick={handleGoBack}
        >
          Back
        </button>
      </div>
      <h1 className="text-3xl font-semibold text-center mb-6 text-blue-600">
        All Staff List
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-blue-500  text-white uppercase text-sm leading-normal">
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Phone</th>
              <th className="py-3 px-4 text-left">Address</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {staff?.map((p, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-100"
                } hover:bg-gray-200 transition duration-300 ease-in-out`}
              >
                <td className="py-3 px-4 whitespace-nowrap ">{p.name}</td>
                <td className="py-3 px-4">{p.email}</td>
                <td className="py-3 px-4">{p.phone}</td>
                <td className="py-3 px-4">{p.address}</td>
                {/* Add more columns here if needed */}
                <td className="py-2 px-4">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => handleUpdateClick(p._id)} // Pass b._id as the branch ID
                  >
                    Update Staff
                  </button>

               
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          initialFocus={cancelButtonRef}
          onClose={() => setOpen(false)}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This is the modal */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <form className="w-full max-w-md p-4">
                  <div className="mb-6">
                    <input
                      type="text"
                      id="name"
                      className="w-full rounded-full border border-gray-500 py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring focus:ring-indigo-600 focus:border-indigo-600"
                      placeholder="Enter new staff name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="mb-6">
                    <input
                      type="text"
                      id="email"
                      className="w-full rounded-full border border-gray-500 py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring focus:ring-indigo-600 focus:border-indigo-600"
                      placeholder="Enter new staff name"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="mb-6">
                    <input
                      type="text"
                      id="phone"
                      className="w-full rounded-full border border-gray-500 py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring focus:ring-indigo-600 focus:border-indigo-600"
                      placeholder="Enter new staff name"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="mb-6">
                    <input
                      type="text"
                      id="address"
                      className="w-full rounded-full border border-gray-500 py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring focus:ring-indigo-600 focus:border-indigo-600"
                      placeholder="Enter new address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="font-semibold bg-gradient-to-r from-blue-600 via-indigo-700 to-indigo-900
              text-gray-100 rounded-full ring-2 ring-blue-200 px-6 py-2
              hover:bg-white hover:text-gray-400 hover:ring-slate-300 m-2"
                    onClick={handleUpdate}
                  >
                    Update Staff
                  </button>

            <button
              className="bg-red-500 font-semibold 
              text-gray-100 rounded-full ring-2 ring-blue-200 px-6 py-2
              hover:bg-white hover:text-gray-400 hover:ring-slate-300"
              onClick={handleDelete}
            >
              DELETE Staff
            </button>


                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default AllStaff;