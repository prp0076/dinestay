// import React,{useEffect, useState} from "react";
// import toast from "react-hot-toast";
// import axios from "axios";
// const CategoryForm = ({ handleSubmit, value, setValue,setCat }) => {
//     const [parentCategory,setParentCategories]=useState([])
//     const getAllCategory = async () => {
//         try {
//           const { data } = await axios.get("/api/v1/roomcategory/get-room-category");
//           if (data?.success) {
//             setParentCategories(data?.category);
//           }
//         } catch (error) {
//           console.log(error);
//           toast.error("Something wwent wrong in getting catgeory");
//         }
//       };
//     useEffect(()=>{getAllCategory()},[]);
//   return (

//     <>
//       <form onSubmit={handleSubmit}>
//       <div className="mb-3">
//           <label htmlFor="categorySelect" className="block text-sm font-medium text-gray-700">
//             Select Category
//           </label>
//           <select
//             id="categorySelect"
//             name="category"
//             className="form-select mt-1 block w-full"
//             onChange={(e) => setCat(e.target.value)}
//           >
//             <option value="">Select a category</option>
//             {parentCategory.map((category) => (
//               <option key={category.id} value={category.id}>
//                 {category.name}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="mb-3">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Enter new category"
//             value={value}
//             onChange={(e) => setValue(e.target.value)}
//           />
//         </div>
//         <button
//           type="submit"
//           className="font-semibold bg-gradient-to-r from-blue-600 via-indigo-700 to-indigo-900 
//                         text-gray-100 rounded-full ring-2 ring-blue-200 px-6 py-2 
//                         hover:bg-white hover:text-gray-400 hover:ring-slate-300"
//         >
//           Submit
//         </button>
//       </form>
//     </>
//   );
// };

// export default CategoryForm;
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const RoomSubCategoryForm = ({ handleSubmit, value, setValue, setCat }) => {
  const [parentCategory, setParentCategories] = useState([]);

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/roomcategory/get-room-category");
      if (data?.success) {
        setParentCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting category");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="categorySelect" className="block text-sm font-medium text-gray-700">
            Select Category
          </label>
          <select
            id="categorySelect"
            name="category"
            className="form-select mt-1 block w-full"
            onChange={(e) => setCat(e.target.value)}
          >
            <option value="">Select a category</option>
            {parentCategory.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter new category"
            value={value}
            onChange={(e) => setValue(e.target.value)}
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
    </>
  );
};

export default RoomSubCategoryForm;
