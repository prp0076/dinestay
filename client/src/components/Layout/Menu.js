import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useCart } from "../../context/cart";
import Layout from "./../../components/Layout/Layout.js";
import { Link } from "react-router-dom";
import useCategory from "../../hooks/useCategory";

const Menu = () => {
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [food, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useCart();
  //get all cat
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategory(data.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something wwent wrong in getting catgeory");
    }
  };
  useEffect(() => {
    getAllCategory();
  }, []);
  const getAllFood = async () => {
    try {
      const { data } = await axios.get("/api/v1/food/get-food");
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

  const handleAddToCart = (food) => {
    // Implement your logic for adding the food item to the cart here
    // You can use a state variable to manage the cart items
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProductIndex = storedCart.findIndex(
      (item) => item._id === food._id
    );
    if (existingProductIndex !== -1) {
      storedCart[existingProductIndex].customQuantity += 1;
    } else {
      storedCart.push({ ...food, customQuantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(storedCart));
    setCart(storedCart);
    toast.success("Item Added to cart");
  };
  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };
  return (
    <Layout title={"Menu"}>
      <div className="flex justify-center items-center h-auto flex-wrap mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-1 gap-4">
          {/* Categories Section */}
          <div className="col-span-3">
          <h2 className="text-2xl font-semibold mb-4 mt-20">Categories</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {category?.map((c) => (
                <div
                  key={c._id}
                  className={`col-md-4 mt-5 mb-3 gx-3 gy-3 category ${
                    selectedCategory === c._id ? "category-active" : ""
                  }`}
                  onClick={() => handleCategoryClick(c._id)}
                >
                  <div className="card bg-light bg-gradient">
                    <Link
                      // to={`/category/${c.slug}`}
                      className="btn p-4"
                      style={{
                        background: "#fff",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        transition: "background 0.3s, box-shadow 0.3s",
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.background = "#99aab5")
                      }
                      onMouseOut={(e) => (e.target.style.background = "#fff")}
                    >
                      {c.name}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Foods Section */}
          <div className="col-span-3 ">
            <h2 className="text-2xl font-semibold mt-8 mb-4">Foods</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {food
                  .filter((i) => i.category._id === selectedCategory)
                  .map((p) => (
                    <div
                      key={p._id}
                      className="bg-white rounded-xl shadow-md overflow-hidden"
                    >
                      <div className="px-6 py-4">
                        <h5 className="text-xl font-semibold">{p.name}</h5>
                        <img
                          src={`/api/v1/food/food-photo/${p._id}`}
                          className="w-40 h-32 md:h-48"
                          alt={p.name}
                        />
                      </div>
                      <div className="px-6 py-4">
                        <button
                          className="w-md sm-w-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                          onClick={() => {
                            handleAddToCart(p);
                          }}
                          id={p._id}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Menu;
