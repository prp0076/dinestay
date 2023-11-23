import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
const CreateBranch = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const handleBranchSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/v1/branch/create-branch", {
        name,
        address,
      });
      if (data?.success) {
        toast.success(data?.message);
        setName("");
        setAddress("");
        alert(data?.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      // toast.error("somthing went wrong in input form");
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <form onSubmit={handleBranchSubmit} className="w-full max-w-md p-4">
        <div className="mb-6">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            New Branch Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full rounded-full border border-gray-500 py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring focus:ring-indigo-600 focus:border-indigo-600"
            placeholder="Enter new branch name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="address"
            className="block text-gray-700 font-bold mb-2"
          >
            New Branch Address
          </label>
          <input
            type="text"
            id="address"
            className="w-full rounded-full border border-gray-500 py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring focus:ring-indigo-600 focus:border-indigo-600"
            placeholder="Enter new branch address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="font-semibold bg-gradient-to-r from-blue-600 via-indigo-700 to-indigo-900 
        text-gray-100 rounded-full ring-2 ring-blue-200 px-6 py-2 
        hover:bg-white hover:text-gray-400 hover:ring-slate-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateBranch;
