import React, { useState,useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
function CreateRoom(props) {
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  // const [photo, setPhoto] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  // const [photo, setPhoto] = useState("");
  const [subcategory, setSubCategory] = useState("");
  const [subcategories, setSubCategories] = useState([]);


//  console.log(photo,"oijoijoijoj");
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/roomcategory/get-room-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting category");
    }
  };

  const getAllSubCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/roomsubcategory/get-sub-category");
      if (data?.success) {
        setSubCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting category");
    }
  };


  
  useEffect(() => {
    getAllCategory();
    getAllSubCategory()
  }, []);


 

//  console.log(photo,"pooioijoijoj");
  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/v1/rooms/create-rooms", {
        price,
        category,
        subcategory,
        quantity,
        description,
        // photo
      });
      // console.log(photo,"photo");

      if (data?.success) {
        toast.success(data?.message);
        setPrice("");
        setQuantity("");
        setDescription("")
        setCategory("")
        setSubCategory("")
        alert(data?.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      // toast.error("something went wrong in input form");
    }
  };

  
     
  return (
    <>
          <div className="container mx-auto p-4">
          <h2>Create Room</h2>
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleRoomSubmit} encType="multipart/form-data">

      <select
              className="block w-full px-4 py-2 mb-3 border rounded focus:outline-none focus:ring focus:border-blue-300"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
            >
              <option value="">Select a category</option>
              {categories?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>


            <select
              className="block w-full px-4 py-2 mb-3 border rounded focus:outline-none focus:ring focus:border-blue-300"
              value={subcategory}
              onChange={(e) => {
                setSubCategory(e.target.value);
              }}
            >
              <option value="">Select Sub category</option>
              {subcategories?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>


            {/* <div className="mb-3">
              <label className="block w-full p-4 border-dashed border-2 border-gray-300 cursor-pointer">
                {photo ? photo.name : "Upload Photo"}
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files)}
                  hidden
                />
              </label>
            </div>

            <div className="mb-3">
              {photo && (
                <div className="text-center">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="food_photo"
                    className="block mx-auto max-h-40"
                  />
                </div>
              )}
            </div> */}


      {/* <div className="mb-3">
              <label className="block w-full p-4 border-dashed border-2 border-gray-300 cursor-pointer">
                {photo ? photo.name : "Upload Photo"}
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files[0])}
                  hidden
                />
              </label>
            </div>

            <div className="mb-3">
              {photo && (
                <div className="text-center">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="food_photo"
                    className="block mx-auto max-h-40"
                  />
                </div>
              )}
            </div> */}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
            Price
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="price"
            type="text"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
            Quantity
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="quantity"
            type="number"
            placeholder="Enter quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            type="text"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            
          >
            Create Room
          </button>
        </div>
      </form>
    </div>
    </>
  
  );
}
export default CreateRoom;