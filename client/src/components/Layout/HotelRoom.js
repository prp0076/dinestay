import React, { useState, Fragment, useRef, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Layout from "./Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

function HotelRoom() {
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [roomType, setRoomType] = useState("");
  const [roomTypeAc, setRoomTypeAc] = useState("");
  const [roomCount, setRoomCount] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [idProof, setIdProof] = useState("");
  const [adult, setAdult] = useState("");
  const [child, setChild] = useState("");
  const [proof, setProof] = useState("");
  const [open, setOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [branch, setBranch] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const cancelButtonRef = useRef(null);
  const navigate = useNavigate();
 

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        "/api/v1/roomcategory/get-room-category"
      );
      if (data?.success) {
        setCategory(data.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting category");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const getAllBranch = async () => {
    try {
      const { data } = await axios.get("/api/v1/branch/get-all-branch");
      console.log(data, "branchdata");
      setBranch(data);
    } catch (error) {
      console.error(error);
      navigate("/");
      // toast.error("Something Went Wrong");
    }
  };
  useEffect(() => {
    getAllBranch();
  }, []);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleExploreClick = (categoryId) => {
    const isLoggedIn = JSON.parse(localStorage.getItem("auth"))?.success;
    // const check=isLoggedIn.success;

    console.log("called");
    if (isLoggedIn) {
      // console.log(categoryId,"id")
      navigate(`/hotelBookForm/${categoryId}`);
    } else {
      console.log("login ");
      navigate("/login");
    }
  };
  const handleExploreOutletClick = (branchId) => {
    const isLoggedIn = JSON.parse(localStorage.getItem("auth"))?.success;
    // const check=isLoggedIn.success;

    console.log("called");
    if (isLoggedIn) {
      // console.log(categoryId,"id")
      navigate(`/hotelBookFormBranch/${branchId}`);
    } else {
      // console.log("login ");
      navigate("/login");
    }
  };

  return (
    <Layout>
      {/*  */}
      {/* Categories Section */}
      <div className="col-span-3">
        <h2 className="text-2xl font-semibold mb-4  mt-20 text-center">Categories</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {category?.map((c) => (
            <div
              key={c._id}
              className={`col-md-4 mt-5 mb-3 gx-3 gy-3 category bg-gradient-to-b from-pink-200 to-white ${
                selectedCategory === c._id ? "category-active" : ""
              }`}
              onClick={() => handleCategoryClick(c._id)}
            >
              <div className="max-w-sm rounded overflow-hidden shadow-lg">
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2">{c.name}</div>
                </div>
                <div className="px-6 py-4">
                  <span className="nline-block font-bold px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                    #Category
                  </span>
                  {/* You can add more details here if needed */}
                </div>
                <div className="p-4">
                <button
                      className="bg-gradient-to-r from-pink-500 to-pink-500 hover:from-pink-600 hover:to-pink-900 text-white font-bold py-2 px-4 rounded-full mt-4"
                      onClick={() => handleExploreClick(c._id)}
                    >
                      Explore
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/*  */}
      <div className="my-20 flex flex-col items-center">
        <h1 className="text-3xl font-semibold mb-6">
          Explore Our Other Outlet
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {branch.map((h) => (
            <div key={h._id} className="bg-white shadow-lg rounded-lg p-4">
              <div className="p-4">
                <p className="text-gray-600 mb-4">{h.name}</p>
                <button
                   className="bg-gradient-to-r  from-pink-500 to-pink-500 text-white rounded-md py-2 px-4 hover:from-pink-600 hover:to-pink-900 transition duration-300"
                  onClick={() => handleExploreOutletClick(h._id)}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
export default HotelRoom;