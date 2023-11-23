import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/auth/login", {
        email,
        password,
      });
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });
        // console.log(auth);
        localStorage.setItem("auth", JSON.stringify(res.data));
        let dd = localStorage.getItem("auth");
        let d = JSON.parse(dd);
        if (d.token) {
          const data = await axios.get(
            `/api/v1/cart/get-cart-item/${d?.user?._id}`,
            {
              headers: {
                Authorization: `${d?.token}`,
              },
            }
          );
          if (data?.data?.getItems?.cartItems) {
            const existingCart = JSON.parse(localStorage.getItem("cart"));
            const newCartItems = data.data.getItems.cartItems;

            if (existingCart && Array.isArray(existingCart)) {
              newCartItems.forEach((newCartItem) => {
                const existingItemIndex = existingCart.findIndex(
                  (existingItem) => existingItem._id === newCartItem._id
                );
                if (existingItemIndex !== -1) {
                  existingCart[existingItemIndex].customQuantity +=
                    newCartItem.customQuantity;
                } else {
                  existingCart.push(newCartItem);
                }
              });
              localStorage.setItem("cart", JSON.stringify(existingCart));
            } else {
              localStorage.setItem(
                "cart",
                JSON.stringify(data.data.getItems.cartItems)
              );
            }
          } else {
            console.log("error in data");
          }
        }
        navigate(location.state || "/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // Set a timeout to hide the password after 2 seconds
  useEffect(() => {
    if (showPassword) {
      const timeout = setTimeout(() => {
        setShowPassword(false);
      }, 1000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [showPassword]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setShowPassword(true);
  };

  return (
    <Layout title="Register - Ecommer App">
      <div
        className="flex min-h-full flex-1 flex-col justify-center px-6 py-12   lg:px-8"
        style={{
          backgroundImage: `url("./image/Login.jpeg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container bg-gray-800 bg-opacity-70 w-full sm:w-11/12 md:w-3/4 lg:w-1/2 xl:w-2/5 mt-10 sm:mx-auto sm:max-w-sm rounded-xl shadow-lg">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-20 w-auto py-3"
              src="https://img.freepik.com/premium-vector/spoon-fork-restaurant-logo-vintage-vector-illustration-template-icon-design-symbol-sign_530080-371.jpg?w=2000"
              alt="Your Company"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-500">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={handleSubmit} method="POST">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-500"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-500"
                  >
                    Password
                  </label>
                  <div className="text-sm">
                    <Link
                      to="/forgot-password"
                      className="font-semibold text-indigo-300 hover:text-gray-200"
                    >
                      Forgot password?
                    </Link>
                  </div>{" "}
                </div>
                <div className=" mt-2">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    autoComplete="current-password"
                    required
                    className="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-3xl bg-gray-900 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:scale-90 "
                >
                  Sign in
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-200">
              Not a member?{" "}
              <Link
                to="/register"
                className="font-semibold leading-6 text-indigo-400 hover:text-gray-200"
              >
                Register Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
