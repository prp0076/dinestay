import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateFood = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [photo, setPhoto] = useState("");

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

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const foodData = new FormData();
      foodData.append("name", name);
      foodData.append("price", price);
      foodData.append("photo", photo);
      foodData.append("category", category);
      const { data } = axios.post("/api/v1/food/create-food", foodData);
      if (data?.success) {
        toast.error(data?.message);
      } else {
        toast.success("food Created Successfully");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  };

  return (
    <div className="container mt-4">
      <div className="row dashboard">
        <div className="col-md-9">
          <h1 className="text-2xl font-semibold mb-4">Create Food</h1>
          <div className="m-1 w-75">
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

            <div className="mb-3">
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
            </div>

            <div className="mb-3">
              <input
                type="text"
                value={name}
                placeholder="Name"
                className="block w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <input
                type="number"
                value={price}
                placeholder="Price"
                className="block w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleCreate}
              >
                CREATE Food
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateFood;
