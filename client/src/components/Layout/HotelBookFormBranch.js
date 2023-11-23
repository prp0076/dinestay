import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";
import moment from "moment";
const HotelBookFormBranch = () => {
  const [fullName, setFullName] = useState("");
  const [idProof, setIdProof] = useState("");
  const [phone, setPhone] = useState("");
  const [roomCount, setRoomCount] = useState("0");
  const [adult, setAdult] = useState("0");
  const [child, setChild] = useState("0");
  const [auth] = useAuth();
  const [Subcategory, setSubcategory] = useState([]);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [SubCategorytId, setSubCategoryId] = useState("");
  const [CheckForAvalityAndPrice, setCheckForAvalityAndPrice] = useState({});
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [parentCategory,setParentCategory]=useState([]);
  const [parentCategoryId,setParentCategoryId]=useState("");
  const [formResponse, setFormResponse] = useState({});
  const [calculateAmount, setCalculateAmount] = useState(1);
  const { branchId } = useParams();
  const navigate = useNavigate();
//   console.log(calculateAmount, "amount");
const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        "/api/v1/roomcategory/get-room-category"
      );
      if (data?.success) {
        setParentCategory(data.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting category");
    }
  };
  const getRoomBySubCat = async () => {
    try {
      const { data } = await axios.get("/api/v1/rooms/get-rooms-subcat", {
        params: {
          Subcategory: SubCategorytId,
        },
      });
      if (data.success) {
        setCheckForAvalityAndPrice(data?.room[0]);
        console.log(CheckForAvalityAndPrice, "datacheck");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getRoomQuantBySubCat = async () => {
    try {
      console.log(CheckForAvalityAndPrice.quantity,"checkfoquantity");
      console.log(roomCount,"checkfoquantity");
      let updatedQuantity = CheckForAvalityAndPrice.quantity - roomCount;
      if(updatedQuantity<=0){
        updatedQuantity=0;
      }
      console.log(updatedQuantity,"updateQuantity");
      const { data } = await axios.get("/api/v1/rooms/get-rooms-subcat-quant", {
        params: {
          Subcategory: SubCategorytId,
          quantity: updatedQuantity,
        },
      });
      if (data.success) {
        console.log(data,"dataupdatequantity");
        // getRoomBySubCat();
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (SubCategorytId) {
      getRoomBySubCat();
    }
  }, [SubCategorytId]);
  function loadRazorpay() {
    // console.log(formResponse,"responseform");
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onerror = () => {
      alert("Razorpay SDK failed to load. Are you online?");
    };
    script.onload = async () => {
      try {
        setLoading(true);
        console.log(formResponse, "responseform");
        const result = await axios.post("/api/v1/payment/create-order-hotel", {
          OrderData: formResponse,
          amount: calculateAmount * 100,
        });
        const { amount, id: order_id, currency } = result.data;
        const {
          data: { key: razorpayKey },
        } = await axios.get("/api/v1/payment/get-razorpay-key");
        const options = {
          key: razorpayKey,
          amount: amount,
          currency: currency,
          name: "manasvi technologies",
          description: "transction to manasvi",
          order_id: order_id,
          handler: async function (response) {
            // eslint-disable-next-line
            const result = await axios.post("/api/v1/payment/hotel-pay-order", {
              paymentMode: true,
              amount: amount,
              OrderData: formResponse,
              razorpay: {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              },
              buyer: auth?.user?._id,
              branch: branchId,
            });
            console.log(result,"paymentresilt");
            if(result?.data?.success){
            toast.success("Payment Completed Successfully ");
            if(auth?.user?.role===2){
            navigate(`/dashboard/manager/h_orders-list`);
            }else if(auth?.user?.role===3){
              navigate(`/dashboard/admin/h_orders-list`)
            }else if(auth?.user?.role===1){
              navigate(`/dashboard/staff/h_orders-list`);
            }else if(auth?.user?.role===0){
              navigate(`/dashboard/user/h_orders-list`)
            }
            }else{
              toast.error("Something Went wrong during payment");
              navigate(`/`);
            }
          },
          prefill: {
            name: "Manasvi technologies",
            email: "manasvi@gmail.com",
            contact: "1111111111",
          },
          notes: {
            address: "30, minaal residency bhopal",
          },
          theme: {
            color: "#80c0f0",
          },
        };

        setLoading(false);
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (err) {
        alert(err);
        setLoading(false);
      }
    };
    document.body.appendChild(script);
  }
  const getCatWiseSubCat = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/roomsubcategory/get-sub-category/${parentCategoryId}`
      );
      console.log(data, "data");
      if (data.success) {
        setSubcategory(data?.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  
  useEffect(() => {
   if(parentCategoryId){
    getCatWiseSubCat();
   }
  }, [parentCategoryId]);
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!fullName ) {
      toast.error("full name is required");
      return;
    }
    if ( !idProof) {
      toast.error("ID Proof is required");
      return;
    }
    if (  !phone   ) {
      toast.error("phone number is required");
      return;
    }
    if (!checkInDate  ) {
      toast.error("please select checkin date ");
      return;
    }
    if (!checkOutDate ) {
      toast.error("please select checkout date");
      return;
    }
    if (!roomCount ) {
      toast.error("please enter roomcount");
      return;
    }
    
    // Check if room count is zero
    if (roomCount === 0) {
      toast.error("Room count should not be zero.");
      return;
    }
    try {
      
      const response = await axios.post("/api/v1/hotel/book-a-room", {
        name: fullName,
        idProof,
        phone,
        roomCount,
        adult,
        children: child,
        checkin: checkInDate,
        checkout: checkOutDate,
        address,
        branch: branchId,
        parentCategory: parentCategoryId,
        parentSubCategory: SubCategorytId,
      });
      setFormResponse(response?.data?.Room);

      // Reset the form after successful submission
      setFullName("");
      setIdProof("");
      setPhone("");
      // setRoomCount(1);
      setAdult(1);
      setChild(1);
      setCheckInDate("");
      setCheckOutDate("");
      setAddress("");
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };
  useEffect(() => {
    if (formResponse?.name) {
      getRoomQuantBySubCat();
      loadRazorpay();
    }
  }, [formResponse]);
  //room count and price amount calculation
  useEffect(() => {
    if (
      roomCount !== undefined &&
      CheckForAvalityAndPrice?.price !== undefined
    ) {
      const price = Number(CheckForAvalityAndPrice?.price);
      const roomCountValue = Number(roomCount);

      if (!isNaN(price) && !isNaN(roomCountValue)) {
        setCalculateAmount(price * roomCountValue);
      } else {
        console.error("Invalid price or roomCount format");
      }
    }
  }, [roomCount, CheckForAvalityAndPrice]);
  useEffect(() => {
    if (CheckForAvalityAndPrice?.quantity === 0) {
      const alertMessage =
        "Rooms are not available for this category. Redirecting to home page...";
      if (window.confirm(alertMessage)) {
        navigate("/");
      }
    }
  }, [CheckForAvalityAndPrice]);
  useEffect(()=>{
    getAllCategory();
    const today = moment().format("YYYY-MM-DD");

    // Set the minimum date for the input field to today
    document.getElementById("checkInDate").min = today;
  },[])

  const handleCheckInDateChange = (e) => {
    const selectedCheckInDate = e.target.value;
    setCheckInDate(selectedCheckInDate);
    
    // Calculate the minimum allowed checkout date based on the selected check-in date
    const minCheckoutDate = new Date(selectedCheckInDate);
    minCheckoutDate.setDate(minCheckoutDate.getDate() + 1); // Assuming check-out should be at least one day after check-in
    
    // Format the minimum checkout date in "YYYY-MM-DD" format
    const formattedMinCheckoutDate = minCheckoutDate.toISOString().split("T")[0];
    
    // Set the minimum date for the checkout input
    document.getElementById("checkOutDate").min = formattedMinCheckoutDate;
  };
  return (
    <Layout>
    <div className="min-h-screen flex items-center justify-center my-20">
  <div className="bg-white p-6 md:p-8 lg:p-12 shadow-md rounded-lg">
  <form onSubmit={handleFormSubmit} className="space-y-4">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label htmlFor="fullName" className="block font-medium text-gray-700">
        Full Name:
      </label>
      <input
        type="text"
        id="fullName"
        name="fullName"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
      />
    </div>
    <div>
      <label htmlFor="idProof" className="block font-medium text-gray-700">
        ID Proof:
      </label>
      <input
        type="text"
        id="idProof"
        name="idProof"
        value={idProof}
        onChange={(e) => setIdProof(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
      />
    </div>

    <div>
      <label htmlFor="branchId" className="block font-medium text-gray-700">
        Room Category :
      </label>
      <select
        className="w-full px-4 py-2 mb-3 border rounded focus:outline-none focus:ring focus:border-blue-300"
        value={parentCategoryId}
        onChange={(e) => {
          setParentCategoryId(e.target.value);
        }}
      >
        <option value="">Select a Room Category</option>
        {parentCategory?.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>

    
    <div>
      <label htmlFor="branchId" className="block font-medium text-gray-700">
        Sub Category :
      </label>
      <select
            className="block w-full px-4 py-2 mb-3 border rounded focus:outline-none focus:ring focus:border-blue-300"
            value={SubCategorytId}
            onChange={(e) => {
              setSubCategoryId(e.target.value);
            }}
          >
            <option value="">Select a Bed type</option>
            {Subcategory?.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          </div>

    <div>
      <label htmlFor="phone" className="block font-medium text-gray-700">
        Phone:
      </label>
      <input
        type="text"
        id="phone"
        name="phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
      />
    </div>

    <div>
      <label htmlFor="roomCount" className="block font-medium text-gray-700">
        Room Count:
      </label>
      <input
        type="number"
        id="roomCount"
        name="roomCount"
        value={roomCount}
        onChange={(e) => setRoomCount(e.target.valueAsNumber)}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
      />
      {CheckForAvalityAndPrice?.quantity > 0 && (
        <p className="text-red-500 mt-2">
          Hurry Up! Only {CheckForAvalityAndPrice.quantity} rooms available.
        </p>
      )}
    </div>

    <div>
      <label htmlFor="adult" className="block font-medium text-gray-700">
        Adult:
      </label>
      <input
        type="number"
        id="adult"
        name="adult"
        value={adult}
        onChange={(e) => setAdult(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
      />
    </div>

    <div>
      <label htmlFor="child" className="block font-medium text-gray-700">
        Child:
      </label>
      <input
        type="text"
        id="child"
        name="child"
        value={child}
        onChange={(e) => setChild(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
      />
    </div>

    <div>
      <label htmlFor="checkInDate" className="block font-medium text-gray-700">
        Check-in Date:
      </label>
      <input
        type="date"
        id="checkInDate"
        name="checkInDate"
        value={checkInDate}
        onChange={handleCheckInDateChange}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
      />
    </div>

    <div>
      <label htmlFor="checkOutDate" className="block font-medium text-gray-700">
        Check-out Date:
      </label>
      <input
        type="date"
        id="checkOutDate"
        name="checkOutDate"
        value={checkOutDate}
        onChange={(e) => setCheckOutDate(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
      />
    </div>

  </div>

  <div>
  <label htmlFor="address" className="block font-medium text-gray-700">
    Address:
  </label>
  <input
    type="text"
    id="address"
    name="address"
    value={address}
    onChange={(e) => setAddress(e.target.value)}
    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
  />
</div>
   <div>
      <button
        type="submit"
        className="w-full bg-indigo-500 text-white rounded-md py-2 px-4 hover:bg-indigo-600 transition duration-300"
      >
        Book Now
      </button>
    </div>
</form>

  </div>
</div>

    </Layout>
  );
};

export default HotelBookFormBranch;