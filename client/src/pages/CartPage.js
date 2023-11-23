import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const CartPage = () => {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [setOtp_gen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false); // To control the visibility of OTP input
  const [varified, setVerified] = useState(false);
  const [branch, setBranch] = useState([]);
  const [selectedbranch, setSelectedBranch] = useState("");
  const navigate = useNavigate();
  const tokenn = JSON.parse(localStorage.getItem("auth"))?.token;

  const getAllBranch = async () => {
    try {
      const axiosConfig = {
        headers: {
          Authorization: `${tokenn}`,
        },
      };
      const { data } = await axios.get(
        "/api/v1/branch/get-all-branch",
        axiosConfig
      );
      setBranch(data);
    } catch (error) {
      console.error(error);
      toast.error("Something Went Wrong");
    }
  };
  useEffect(() => {
    if(tokenn){
      getAllBranch();
    }
    // eslint-disable-next-line
  }, [tokenn]);
  useEffect(()=>{
   if(orderId){
    fetchOrderId();
   }
  },[orderId])
  const handleBranchSelect = (event) => {
    const selectedBranch = event.target.value;
    setSelectedBranch(selectedBranch);
  };
  function generateUniqueId(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let id = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      id += characters.charAt(randomIndex);
    }

    return id;
  }

  //for uuid
  async function fetchOrderId() {
    try {
      const orderid = "order_CD" + generateUniqueId(12);
      setOrderId(orderid);
    } catch (error) {
      console.error("Error fetching order ID:", error);
    }
  }

  const totalPrice = () => {
    try {
      let amount = 0;

      cart?.forEach((item) => {
        const itemTotal = Math.round(item.price * item.customQuantity);
        amount += itemTotal;
      });

      if (amount <= 499) {
        amount += 0;
      } else if (amount >= 500 && amount <= 999) {
        amount += 30;
      } else if (amount >= 1000) {
        amount += 60;
      }

      localStorage.setItem("amount", JSON.stringify(amount));

      return amount;
    } catch (error) {
      console.log(error);
    }
  };
  const parsedValue = localStorage.getItem("amount")
    ? JSON.parse(localStorage.getItem("amount"))
    : 0;

  function loadRazorpay() {
    if (selectedbranch === "") {
      alert("Please select a branch before proceeding");
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onerror = () => {
      alert("Razorpay SDK failed to load. Are you online?");
    };
    script.onload = async () => {
      try {
        setLoading(true);
        const result = await axios.post("/api/v1/payment/create-order", {
          cart,
          amount: parsedValue * 100,
        });
        const { amount, id: order_id, currency } = result.data;
        const {
          data: { key: razorpayKey },
        } = await axios.get("/api/v1/payment/get-razorpay-key");
        // console.log(cart);
        const options = {
          key: razorpayKey,
          amount: amount,
          currency: currency,
          name: "manasvi technologies",
          description: "transction to manasvi",
          order_id: order_id,
          handler: async function (response) {
            // eslint-disable-next-line
            const result = await axios.post("/api/v1/payment/pay-order", {
              paymentMode: true,
              amount: amount, 
              products: cart, 
              razorpay: {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              },
              buyer: auth?.user?._id,
              branch: selectedbranch,
            });
            localStorage.removeItem("cart");
            setCart([]);
            navigate(`/dashboard/user/orders`);
            toast.success("Payment Completed Successfully ");
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

  //another cod method

  // Cash on delivery testing
  let phone = "+91" + auth?.user?.phone;
  // Cash on delivery testing

  const cash_data = async () => {
    try {
      setLoading(true);
      //below code for otp
      const apiKey = "d85e660e-4d4d-11ee-addf-0200cd936042";
      const mobileNumber = phone;

      const min = 100000;
      const max = 999999;
      OTP1 = Math.floor(Math.random() * (max - min + 1)) + min;
      localStorage.setItem("OTP", JSON.stringify(OTP1));
      // console.log(OTP1);
      const url = `https://2factor.in/API/V1/${apiKey}/SMS/${mobileNumber}/${OTP1}`;
      toast.success("OTP send successfully! ");
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: url,
        headers: {},
      };

      axios(config)
        .then(function (response) {
          if (response.data.Status) {
            setOtp_gen(true);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      setLoading(false);
      //end
    } catch (err) {
      alert(err);
      setLoading(false);
    }
  }; 

  var OTP1 = 0;

  const handleCashOnDelivery = () => {
    if (selectedbranch === "") {
      alert("Please select a branch before proceeding");
      return;
    }
    setShowOtpInput(true);
    cash_data();
  };

  // For OTP input form
  const handleSubmit = async () => {
    const otp_local = localStorage.getItem("OTP");

    if (otp_local === inputValue) {
      localStorage.removeItem("OTP");
      setVerified(true); // OTP verified successfully
      toast.success("OTP verified Successfully!");
      try {
        const result = await axios.post("/api/v1/payment/create-order-COD", {
          isPaid: true,
          paymentMode: false,
          amount: parsedValue,
          products: cart,
          buyer: auth?.user?._id,
          razorpay: {
            orderId: orderId,
          },
          branch: selectedbranch,
        });
        if (result.data.success) {
          localStorage.removeItem("cart");
          setCart([]);
          navigate(`/dashboard/user/orders`);
          toast.success("Order Placed Successfully!");
        } else {
          toast.error("Failed to place the order.");
        }
      } catch (error) {
        console.error("Error placing order:", error);
        toast.error("Failed to place the order.");
      }
    } else {
      toast.error("Incorrect OTP entered.");
    }
  };

  //detele item
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  //  handle quanityt
  const increaseCustomQuantity = (product) => {
    const updatedCart = cart.map((item) => {
      if (item._id === product._id) {
        return { ...item, customQuantity: item.customQuantity + 1 };
      }
      return item;
    });

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.location.reload();
  };
  const decreaseCustomQuantity = (product) => {
    const updatedCart = cart.map((item) => {
      if (item._id === product._id && item.customQuantity > 1) {
        return { ...item, customQuantity: item.customQuantity - 1 };
      }
      return item;
    });

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.location.reload();
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-semibold text-center mb-4">
          {!auth?.user
            ? "Hello Guest"
            : `Hello  ${auth?.token && auth?.user?.name}`}
        </h1>
        <p className="text-center">
          {cart?.length
            ? `You Have ${cart.length} items in your cart ${
                auth?.token ? "" : "please login to checkout !"
              }`
            : " Your Cart Is Empty"}
        </p>
        <div className="flex flex-col lg:flex-row justify-between mt-8">
          <div className="lg:w-2/3 p-4">
            {cart?.map((p) => (
              <div
                className="flex items-center mb-4 border-b border-gray-200"
                key={p._id}
              >
                <div className="w-20 h-20 mr-4">
                  <img
                    src={`/api/v1/food/food-photo/${p._id}`}
                    className="w-full h-full object-cover"
                    alt={p.name}
                  />
                </div>
                <div className="flex-grow">
                  <p className="text-lg font-semibold">{p.name}</p>
                  <p>Price: ₹{Math.round(p.price * p.customQuantity)}</p>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center mt-2">
                    <button
                      className="text-xl font-bold w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center"
                      onClick={() => decreaseCustomQuantity(p)}
                    >
                      -
                    </button>
                    <p className="text-xl mx-2">Quantity {p.customQuantity}</p>
                    <button
                      className="text-xl font-bold w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center"
                      onClick={() => increaseCustomQuantity(p)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="mt-2  text-red-600 hover:text-red-800"
                    onClick={() => removeCartItem(p._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center lg:w-1/3 p-4">
            <h2 className="text-2xl font-semibold">Cart Summary</h2>
            <p>Total | Checkout | Payment</p>
            <hr className="my-4" />
            <label>Select a branch:</label>
            <select value={selectedbranch} onChange={handleBranchSelect}>
              <option>Select a branch</option>
              {branch.map((branchItem) => (
                <option key={branchItem._id} value={branchItem._id}>
                  {branchItem.name}
                </option>
              ))}
            </select>
            <h4>Total Payable amount: ₹{totalPrice()}</h4>
            {auth?.user?.address ? (
              <>
                <div className="mb-3">
                  <h5>Current Address</h5>
                  <h5>{auth?.user?.address}</h5>
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                </div>
              </>
            ) : (
              <div className="mb-3">
                {auth?.token ? (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                ) : (
                  <button
                    className="bg-gray-900  text-white px-4 py-2 m-5 hover:scale-105 w-60 rounded-3xl"
                    onClick={() =>
                      navigate("/login", {
                        state: "/cart",
                      })
                    }
                  >
                    Please Login to checkout
                  </button>
                )}
              </div>
            )}
            <div className="mt-2">
              {!auth?.token || !cart?.length ? (
                ""
              ) : (
                <>
                  <button
                    className="bg-gray-900  text-white px-4 py-2 m-5 hover:scale-105 w-30 rounded-3xl"
                    onClick={loadRazorpay}
                    disabled={loading || !auth?.user?.address}
                  >
                    {loading ? "Processing ...." : "Pay Online"}
                  </button>
                  <button
                    className="bg-gray-900  text-white px-4 py-2 m-5 hover:scale-105 w-40 rounded-3xl"
                    onClick={handleCashOnDelivery}
                    disabled={!auth?.user?.address || showOtpInput}
                  >
                    Cash On Delivery
                  </button>
                  {showOtpInput && (
                    <div className="mt-4">
                      <input
                        type="text"
                        className="border border-gray-400 px-3 py-2 rounded-md"
                        placeholder="Enter OTP"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                      />
                      <button
                        className="bg-gray-900 text-white px-4 py-2 mt-2 rounded-md"
                        onClick={handleSubmit}
                      >
                        Verify OTP
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
