import React, { useEffect, useState, Fragment, useRef } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import UpdateFood from "./UpdateFood";
const Items = () => {
  const [food, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFood, setSelectedFood] = useState(null);
  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  const getAllFood = async () => {
    try {
      const { data } = await axios.get("/api/v1/food/get-food");
      console.log(data);
      if (data?.success) {
        setFoods(data.foods);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting food");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllFood();
  }, []);

  const handleUpdateClick = (foodData) => {
    console.log(foodData.slug);
    setSelectedFood(foodData.slug);
    setOpen(true);
  };
  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-4">All Food</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Image</th>
              <th className="py-2 px-4 text-left">Price</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {food.map((p) => (
              <tr key={p._id} className="border-b">
                <td className="py-2 px-4">{p.name}</td>

                <td className="py-2 px-4">
                  <img
                    src={`/api/v1/food/food-photo/${p._id}`}
                    className="w-20 h-auto"
                    alt={p.name}
                  />
                </td>
                <td className="py-2 px-4">{p.price}</td>

                <td className="py-2 px-4">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => handleUpdateClick(p)}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
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
                <UpdateFood
                  foodData={selectedFood}
                  onClose={handleCloseModal}
                />
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default Items;
