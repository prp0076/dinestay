import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import zxcvbn from "zxcvbn";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const CreateManager = () => {
  const [auth, setAuth] = useAuth();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [branch, setBranch] = useState("");
  const [branches, setBranches] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [answer, setAnswer] = useState("");

  //getall Staff
  const getAllManager = async () => {
    try {
      const { data } = await axios.get("/api/v1/branch/get-all-branch");
      setBranches(data);
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  //lifecycle method
  useEffect(() => {
    getAllManager();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/auth/manager-register", {
        name,
        email,
        password,
        phone,
        address,
        answer,
        branch,
      });
      console.log(res);
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        localStorage.setItem("auth", JSON.stringify(res?.data?.user?._id));
        setName("");
        setEmail("");
        setPassword("");
        setPhone("");
        setAnswer("");
        setBranch([]);
        setAddress("");
        alert(res.data.message);
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Create Manager</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="branch"
              className="block font-semibold text-gray-600"
            >
              Select Branch
            </label>
            <select
              className="w-full py-2 px-3 border rounded-lg focus:outline-none focus:border-indigo-500"
              value={branch}
              onChange={(e) => {
                setBranch(e.target.value);
              }}
            >
              <option value="">Select a Branch</option>
              {branches?.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="name" className="block font-semibold text-gray-600">
              Name
            </label>
            <input
              id="name"
              name="name"
              value={name}
              onChange={(e) => {
                const newName = e.target.value.slice(0, 50);
                setName(newName);
              }}
              type="text"
              autoComplete="name"
              required
              className="w-full py-2 px-3 border rounded-lg focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block font-semibold text-gray-600"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              required
              className="w-full py-2 px-3 border rounded-lg focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block font-semibold text-gray-600"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full py-2 px-3 border rounded-lg focus:outline-none focus:border-indigo-500"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? (
                  <AiOutlineEye className="h-5 w-5 text-gray-500" />
                ) : (
                  <AiOutlineEyeInvisible className="h-5 w-5 text-gray-500" />
                )}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Password Strength:{" "}
              {password && (
                <span className="text-red-500">
                  {getPasswordStrengthText(zxcvbn(password).score)}
                </span>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="number"
              className="block font-semibold text-gray-600"
            >
              Phone Number
            </label>
            <input
              id="number"
              name="number"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => {
                const enteredValue = e.target.value;
                const validPhone = /^\d+$/.test(enteredValue);
                if (validPhone || enteredValue === "") {
                  setPhone(enteredValue);
                }
              }}
              required
              className="w-full py-2 px-3 border rounded-lg focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="address"
              className="block font-semibold text-gray-600"
            >
              Address
            </label>
            <input
              id="address"
              name="address"
              value={address}
              onChange={(e) => {
                const newAddress = e.target.value.slice(0, 100);
                setAddress(newAddress);
              }}
              type="text"
              autoComplete="address"
              required
              className="w-full py-2 px-3 border rounded-lg focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="answer"
              className="block font-semibold text-gray-600"
            >
              Answer
            </label>
            <input
              id="answer"
              name="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              type="text"
              autoComplete="answer"
              required
              className="w-full py-2 px-3 border rounded-lg focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="font-semibold bg-gradient-to-r from-blue-600 via-indigo-700 to-indigo-900 
                    text-gray-100 rounded-full ring-2 ring-blue-200 px-6 py-2 
                    hover:bg-white hover:text-gray-400 hover:ring-slate-300"
            >
              Register Manager
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateManager;
