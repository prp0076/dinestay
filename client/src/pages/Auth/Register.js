import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import zxcvbn from "zxcvbn";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();

  // form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/auth/register", {
        name,
        email,
        password,
        phone,
        address,
        answer,
      });
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        localStorage.setItem("auth", JSON.stringify(res?.data?.user?._id));

        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  function getPasswordStrengthText(score) {
    const strengthLevels = [
      "Very Weak",
      "Weak",
      "Moderate",
      "Strong",
      "Very Strong",
    ];
    return strengthLevels[score];
  }

  useEffect(() => {
    if (showPassword) {
      const timeout = setTimeout(() => {
        setShowPassword(false);
      }, 2000);

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
        className="flex  flex-1 flex-col justify-center px-6 py-12  mt-6 lg:px-8"
        style={{
          backgroundImage: `url("./image/Signup.jpeg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container bg-gray-800 bg-opacity-50 w-full sm:w-11/12 md:w-3/4 lg:w-1/2 xl:w-2/5 mt-10 sm:mx-auto sm:max-w-sm rounded-xl shadow-lg">
          <div className="sm:mx-auto sm:w-full ">
            <img
              className="mx-auto mt-2 h-20 w-auto"
              src="https://img.freepik.com/premium-vector/spoon-fork-restaurant-logo-vintage-vector-illustration-template-icon-design-symbol-sign_530080-371.jpg?w=2000"
              alt="Your Company"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-teal-500">
              New User Register
            </h2>
          </div>

          <div className=" sm:mx-auto sm:w-full sm:max-w-sm grid grid-row-1">
            <form
              className="space-y-6 p-10 content-center"
              onSubmit={handleSubmit}
              method="POST"
            >
              <div className="">
                <div className="">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-6  text-teal-500"
                  >
                    Name
                  </label>
                  <div className=" ">
                    <input
                      id="name"
                      name="name"
                      value={name}
                      onChange={(e) => {
                        const newName = e.target.value.slice(0, 50); // Limit input to 50 characters
                        setName(newName);
                      }}
                      type="text"
                      autoComplete="name"
                      required
                      className="block  p-2 w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-teal-500"
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
                    className="block p-2 w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-teal-500"
                >
                  Password
                </label>
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
                <div className="password-strength">
                  {password && (
                    <>
                      <p>
                        Password Strength:{" "}
                        {getPasswordStrengthText(zxcvbn(password).score)}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="number"
                  className="block text-sm font-medium leading-6 text-teal-500"
                >
                  Phone Number
                </label>
                <div className="mt-2">
                  <input
                    id="number"
                    name="number"
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => {
                      const enteredValue = e.target.value;
                      const validPhone = /^\d+$/.test(enteredValue); // Only digits are allowed

                      if (validPhone || enteredValue === "") {
                        setPhone(enteredValue);
                      }
                    }}
                    required
                    className="block w-full p-2 rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium leading-6 text-teal-500"
                >
                  Address
                </label>
                <div className="mt-2">
                  <input
                    id="address"
                    name="address"
                    value={address}
                    onChange={(e) => {
                      const newAddress = e.target.value.slice(0, 100); // Limit input to 100 characters
                      setAddress(newAddress);
                    }}
                    type="text"
                    autoComplete="address"
                    required
                    className="block w-full p-2 rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="answer"
                  className="block text-sm font-medium text-teal-500 leading-6 "
                >
                  Answer
                </label>
                <div className="mt-2">
                  <input
                    id="address"
                    name="address"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    type="text"
                    autoComplete="answer"
                    required
                    className="block w-full p-2 rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-3xl bg-teal-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:scale-90"
                >
                  Sign up
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-200">
              Existing User ? &nbsp;
              <a
                href="#"
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                <Link to="/login">Log in</Link>
              </a>
            </p>
            <p className="mt-10 text-center text-sm text-gray-200">
              Welcome to our website{" "}
              <a
                href="#"
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Enjoy your meal!
              </a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
