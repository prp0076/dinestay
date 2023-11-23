import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router-dom";

const AllFood = () => {
  const [food, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleGoBack = () => {
    window.location.reload(); // This will navigate back one step in the history stack
  };

  return (
    <div className="container mx-auto mt-8 px-4">
      <div className="mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
          onClick={handleGoBack}
        >
          Back
        </button>
      </div>
      <h1 className="text-3xl font-semibold mb-4">All Food Items</h1>
      {loading ? (
        <p className="text-center text-xl font-semibold">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {food.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <Link to={`/dashboard/manager/food/${p.slug}`}>
                <div className="p-4">
                  <img
                    src={`/api/v1/food/food-photo/${p._id}`}
                    className="w-full h-40 object-cover rounded-lg mb-2"
                    alt={p.name}
                  />
                  <h5 className="text-lg font-semibold mb-2">{p.name}</h5>
                  <p className="text-gray-600">{p.description}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllFood;
