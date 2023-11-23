import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineCamera } from "react-icons/ai"; // Import the camera icon

const UpdateFood = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [photo, setPhoto] = useState("");
  const [id, setId] = useState("");

  const getSingleFood = async () => {
    try {
      const { data } = await axios.get(`/api/v1/food/get-food/${params.slug}`);
      setName(data.food.name);
      setId(data.food._id);
      setPrice(data.food.price);
      setCategory(data.food.category._id);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getSingleFood();
    //eslint-disable-next-line
  }, []);
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting catgeory");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const foodData = new FormData();
      foodData.append("name", name);
      foodData.append("price", price);
      photo && foodData.append("photo", photo);
      foodData.append("category", category);
      const { data } = await axios.put(
        `/api/v1/food/update-food/${id}`,
        foodData
      );
      if (data?.success) {
        toast.success("Food Updated Successfully");
        navigate("/");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  };

  // delete a product
  const handleDelete = async () => {
    try {
      let answer = window.prompt("Are You Sure want to delete this food ? ");
      if (!answer) return;
      // eslint-disable-next-line
      const { data } = await axios.delete(`/api/v1/food/delete-food/${id}`);
      toast.success("Food Deleted Successfully");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="container bg-gray-200 mx-auto mt-8 p-4">
      <div className="bg-white shadow-md rounded-lg p-8 mb-4">
        <h1 className="text-3xl font-semibold mb-6">Update Food</h1>
        <div className="w-3/4 mx-auto">
          <select
            className="block w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories?.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="mb-6">
            <label className="block w-full p-4 border-dashed border-2 border-gray-300 cursor-pointer text-center">
              <AiOutlineCamera className="w-8 h-8 mx-auto mb-2" />
              {photo ? photo.name : "Upload Photo"}
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files[0])}
                hidden
              />
            </label>
            {photo ? (
              <div className="text-center">
                <img
                  src={URL.createObjectURL(photo)}
                  alt="food_photo"
                  className="rounded-lg h-md w-md mx-auto"
                />
              </div>
            ) : (
              <div className="text-center mt-4 h-md w-md">
                <img
                  src={`/api/v1/food/food-photo/${id}`}
                  alt="food_photo"
                  className="rounded-lg  mx-auto"
                />
              </div>
            )}
          </div>
          <div className="mb-6">
            <input
              type="text"
              value={name}
              placeholder="Name"
              className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <input
              type="number"
              value={price}
              placeholder="Price"
              className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="mb-6 ">
            <button
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleUpdate}
            >
              UPDATE FOOD
            </button>
          </div>
          <div className="mb-4">
            <button
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={handleDelete}
            >
              DELETE FOOD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateFood;
