import React, { Fragment, useRef, useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import CategoryForm from "../../components/Form/CategoryForm";
import RoomSubCategoryForm from "../../components/Form/RoomSubCategoryForm";
import { Dialog, Transition } from "@headlessui/react";
// import { useNavigate } from "react-router-dom";

const CreateRoomSubCategory = () => {
  const [categories, setCategories] = useState([]);
  const [parentcategories, setParentCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [updateCategory, setUpdateCategory] = useState("");
//   const navigate = useNavigate();
  const cancelButtonRef = useRef(null);
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/roomcategory/get-room-category");
      if (data?.success) {
        setParentCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something wwent wrong in getting catgeory");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/v1/roomsubcategory/create-sub-category", {
        name,
        parentCategory:category
        //here we need to send parentcategory also
      });
      if (data?.success) {
        toast.success(`${name} is created`);
        getAllSubcategory();
        setName("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllSubcategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/roomsubcategory/get-sub-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting catgeory");
    }
  };

  useEffect(() => {
    getAllSubcategory();
    getAllCategory();
  }, []);
 console.log(selected?._id,"parentcat");
  const handleUpdate = async (e) => {
    try {
        
      const { data } = await axios.put(
        `/api/v1/roomsubcategory/update-subcategory/${selected._id}`,
        { name: updatedName,
         parentCategory:updateCategory }
        //parentcategory
      );
      if (data?.success) {
        toast.success(`${updatedName} is updated`);
        setSelected(null);
        setUpdatedName("");
        setVisible(false);
        getAllSubcategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
// const handleUpdate = async (id, name, category) => {
//     try {
//       const { data } = await axios.put(
//         `/api/v1/roomsubcategory/update-subcategory/${id}`,
//         { name, category }
//       );
//       if (data?.success) {
//         toast.success(`${name} is updated`);
//         setSelected(null);
//         setUpdatedName("");
//         setVisible(false);
//         getAllSubcategory();
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };
  const handleDelete = async (pId) => {
    try {
      const { data } = await axios.delete(
        `/api/v1/roomsubcategory/delete-subcategory/${pId}`
      );
      if (data.success) {
        toast.success(`category is deleted`);

        getAllSubcategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="container mt-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <h1 className="text-2xl font-semibold mb-4">Manage Sub Category</h1>

          <div className="p-3 w-1/2">
            <RoomSubCategoryForm
              handleSubmit={handleSubmit}
              value={name}
              setValue={setName}
              setCat={setCategory}
            />
          </div>
          <div className="w-15">
            <table className="w-full table-auto border-collapse">
              <tbody>
                {categories?.map((c) => (
                  <tr key={c._id} className="border-t">
                    <td className="py-2 px-4">{c.name}</td>
                    <td className="py-2 px-4 space-x-2">
                      <button
                        className="font-semibold bg-gradient-to-r from-blue-600 via-indigo-700 to-indigo-900 
                        text-gray-100 rounded-full ring-2 ring-blue-200 px-6 py-2 
                        hover:bg-white hover:text-gray-400 hover:ring-slate-300"
                        onClick={() => {
                          setVisible(true);
                          setUpdatedName(c.name);
                           setSelected(c);
                          setOpen(true); // Open the modal
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={() => {
                          handleDelete(c._id);
                        }}
                      >
                        Delete
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
              className="relative z-10"
              initialFocus={cancelButtonRef}
              onClose={setOpen}
            >
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
              </Transition.Child>

              <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  >
                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                      <div className="p-3 w-50">
                      <RoomSubCategoryForm
                        value={updatedName}
                        setValue={setUpdatedName}
                        setCat={setUpdateCategory}
                        handleSubmit={() => handleUpdate(selected._id, updatedName, updateCategory)}
                        />
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition.Root>
        </div>
      </div>
    </div>
  );
};

export default CreateRoomSubCategory;
