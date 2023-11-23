import React, { useState, useEffect } from "react";
import { useCart } from "../context/cart";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "./../components/Layout/Layout";

const HomePage = () => {
  const [food, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useCart();

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

  return (
    <Layout title={"Restaurant "}>
      <div className="bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-evenly ">
            <div className=" rounded-lg shadow-md p-4 inline-block my-32 bg-white">
              <div className="text-center my-8">
                <p className="text-4xl md:text-7xl">
                  Simple And <br /> Tasty Recipes
                </p>
              </div>
              <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 py-16 px-4 space-x-11">
                <img src="./image/food.png" className="w-36 h-36" />
                <p className="text-center max-w-md">
                  {" "}
                  A restaurant is a business that prepares and serves <br />{" "}
                  food and drinks to customers. Meals are generally <br />{" "}
                  served and eaten on the premises
                </p>
                <img src="./image/food1.png" className="w-36 h-36" />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center mt-14 bg-gray-50 space-x-11">
            <p className="text-6xl md:text-8xl">
              Experience of <br />
              real recipes
            </p>
            <br />

            <img src="./image/food2.png" className="w-56 h-56" />
          </div>

          <div className="container h-80 col-span-6 overflow-y-auto mt-8">
            <h2 className="text-2xl font-semibold mt-8 mb-4">Foods</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="max-w-screen-2xl  mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {food.map((p) => (
                  <div
                    key={p._id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
                  >
                    <div className="px-4 py-2 flex items-center">
                      <img
                        src={`/api/v1/food/food-photo/${p._id}`}
                        className="w-20 h-25 md:w-30 md:h-35 lg:w-38 lg:h-20 xl:w-42 xl:h-30 rounded-full"
                        alt={p.name}
                      />
                      <h5 className="text-xl font-semibold ml-4">{p.name}</h5>
                    </div>
                    <div className="px-4 py-2">
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

          <div className="flex flex-row items-center justify-center mt-14">
            <p className="text-5xl">Our Categories</p>
          </div>

          <div className="flex justify-center md:justify-evenly rounded-full">
            <div className="flex flex-col md:flex-row mt-8 md:space-x-4">
              <img
                src="./image/food3.png"
                className="w-72 h-72 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-72 xl:h-72"
              />

              <img
                src="./image/food6.webp"
                className="w-72 h-72 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-72 xl:h-72"
              />
              <img
                src="./image/food8.png"
                className="w-72 h-72 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-72 xl:h-72"
              />
              <img
                src="./image/food4.png"
                className="w-72 h-72 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-72 xl:h-72"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center mt-14 space-x-11">
            <p className="flex items-center m-4">
              A restaurant is a business that prepares and serves <br /> food
              and drinks to customers. Meals are generally <br /> served and
              eaten on the premises
            </p>

            <img src="./image/food5.png" className="w-52 h-52 " />

            <span className="bg-black flex text-white rounded-full w-28 h-28 text-center items-center justify-center">
              {" "}
              Explore <br /> Now
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center mt-14 md:space-x-11"></div>
          <div className="flex flex-col md:flex-row items-center justify-center mt-14 md:space-x-52 overflow-y-auto bg-gray-50">
            <p className="flex items-center m-4 font-bold space-x-11">
              Indian
              <br />
              Chinese
              <br />
            </p>

            <img src="./image/food9.jpg" className="w-52 h-52 " />

            <p className="flex items-center m-4 font-bold space-x-11">
              Italian
              <br />
              Asian
              <br />
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center mt-14 md:space-x-14">
            {" "}
            <img src="./image/food6.png" className="w-32 h-32 " />
            <img src="./image/food8.png" className="w-72 h-72 " />
            <img src="./image/food7.png" className="w-32 h-32 " />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
