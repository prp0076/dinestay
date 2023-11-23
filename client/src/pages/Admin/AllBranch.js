import React, { useState, Fragment, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";

const AllBranch = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [name, setName] = useState("");
  const [branch, setBranch] = useState([]);
  const [address, setAddress] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState(null); // Use selectedBranchId
  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);

  // Function to fetch a single branch's data
  const getSingleBranch = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/branch/get-branch/${params.slug}`
      );
      setName(data.name);
      setSelectedBranchId(data._id); // Use setSelectedBranchId to set the ID
      setAddress(data.address);
    } catch (error) {
      console.log(error);
    }
  };

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

  // Lifecycle method to fetch data when the component mounts
  useEffect(() => {
    getSingleBranch();
    getAllBranch(); // Fetch all branch data
  }, [params.slug]); // Trigger the effect when params.slug changes

  // Handle the click of the "Update" button
  const handleUpdateClick = (branchId) => {
    // Set the selected branch ID and open the modal
    setSelectedBranchId(branchId);
    setOpen(true);
  };
  // Handle the update of the branch
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const branchData = {
        name: name,
        address: address,
      };

      const { data } = await axios.put(
        `/api/v1/branch/update-branch/${selectedBranchId}`, // Use selectedBranchId
        branchData
      );
      if (data?.success) {
        toast.success("Branch Updated Successfully");
        navigate("/");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="row p-5  dashboard">
      <div className="col-md-8 ">
        <h1 className="text-center">All Branch</h1>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-2 px-3 text-left">Branch Name</th>
              <th className="py-2 px-3 text-left">Branch Address</th>
              <th className="py-2 px-3 text-left">Update Branch</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {branch?.map((b) => (
              <tr
                className="border-b  border-gray-200 hover:bg-gray-100"
                key={b.id}
              >
                <td className="py-3 px-3 ">{b.name}</td>
                <td className="py-3 px-3 ">{b.address}</td>
                <td className="py-2 px-4">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => handleUpdateClick(b._id)} // Pass b._id as the branch ID
                  >
                    Update
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
                    <label
                      htmlFor="name"
                      className="block text-gray-700 font-bold mb-2"
                    >
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
                    onClick={handleUpdate}
                  >
                    Update Branch
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

export default AllBranch;
