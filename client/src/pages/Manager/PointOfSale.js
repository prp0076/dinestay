import React, { useEffect, useState, Fragment, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";
import useCategory from "../../hooks/useCategory";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
function PointOfSale(props) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  const categories = useCategory();
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [food, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carts, setCart] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [customername, setCustomerName] = useState("");
  const [customernumber, setCustomerNumber] = useState("");
  const [paymentmode, setPaymentMode] = useState("");
  const [subtotal, setSubTotal] = useState("");
  const [tax, setTax] = useState({});
  const [taxRate, setTaxRate] = useState({});
  const [totalAmount, setTotalAmount] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("carts")) || [];
    setCart(storedCart);
  }, []);

  const addItemToCart = (food) => {
    const existingProductIndex = cartItems.findIndex(
      (item) => item._id === food._id
    );

    if (existingProductIndex !== -1) {
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingProductIndex].customQuantity += 1;
      setCartItems(updatedCartItems);
    } else {
      const newItem = { ...food, customQuantity: 1 };
      setCartItems([...cartItems, newItem]);
    }

    localStorage.setItem("carts", JSON.stringify(cartItems));
    updateTotalCost();
    toast.success("Item Added to cart");
  };

  const updateTotalCost = () => {
    const totalCost = calculateTotalPrice();
    setTotalCost(totalCost);
    setSubTotal(totalCost.toFixed(2));
  };
  const bru_id = localStorage.getItem("auth");
  const id = JSON.parse(bru_id).user.branch;

  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.customQuantity,
      0
    );
  };

  const handleCartClose = () => {
    setIsCartOpen(false);
  };

  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  const clearCart = () => {
    localStorage.removeItem("carts");
    setCart([]);
    setCartItems([]);
  };

  const handleUpdateClick = () => {
    setSelectedFood();
    setOpen(true);
  };
  const handleCloseModal = () => {
    setOpen(false);
  };

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      console.log(data);
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
      console.log(data);
      console.log(data.foods);
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

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const removeCartItem = (itemId) => {
    try {
      const updatedCart = cartItems.filter((item) => item._id !== itemId);
      setCartItems(updatedCart);
      localStorage.setItem("carts", JSON.stringify(updatedCart));
      updateTotalCost();
    } catch (error) {
      console.log(error);
    }
  };

  const increaseCustomQuantity = (itemId) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item._id === itemId) {
        return { ...item, customQuantity: item.customQuantity + 1 };
      }
      return item;
    });

    setCartItems(updatedCartItems, () => {
      updateTotalCost();
    });

    localStorage.setItem("carts", JSON.stringify(updatedCartItems));
  };

  const decreaseCustomQuantity = (itemId) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item._id === itemId && item.customQuantity > 1) {
        return { ...item, customQuantity: item.customQuantity - 1 };
      }
      return item;
    });

    setCartItems(updatedCartItems, () => {
      updateTotalCost();
    });

    localStorage.setItem("carts", JSON.stringify(updatedCartItems));
  };

  useEffect(() => {
    updateTotalCost();
  }, [cartItems]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const foodData = new FormData();
      foodData.append("customerName", customername); // Correct field name
      foodData.append("customerNumber", customernumber); // Correct field name
      foodData.append("subTotal", subtotal); // Correct field name
      foodData.append("totalAmount", totalAmount); // Correct field name and calculation
      foodData.append("tax", tax); // Correct field name
      foodData.append("taxRate", taxRate); // Correct field name
      foodData.append("paymentMode", paymentmode); // Correct field name
      // Convert cartItems array into a JSON string and append it to the FormData
      foodData.append("cartItems", JSON.stringify(cartItems));
      foodData.append("branch", id);
      const response = await axios.post("/api/v1/bills/add-bills", foodData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response?.data?.success) {
        toast.success("Bill Created Successfully");
        localStorage.removeItem("carts");
        navigate("/");
        // Redirect to a success page or perform any desired actions upon success.
      } else {
        toast.error(response.message);
      }
      localStorage.removeItem("carts");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong to generate bills");
    }
  };

  const handleTaxRateChange = (taxRate) => {
    let taxR = parseFloat(taxRate);
    setTaxRate(taxR);
    let subtotalvalue = calculateTotalPrice();
    let Tax = (subtotalvalue / (taxR + 100)) * taxR;
    let grandtotal = subtotalvalue - Tax;
    setTotalAmount(grandtotal.toFixed(2));
    setTax(Tax.toFixed(2));
  };

  return (
    <div>
      {/* Cart Open Button */}

      {!isCartOpen && (
        <button
          className="fixed top-5 right-5 z-10 px-4 py-2 flex items-center justify-center rounded-md border border-transparent bg-gray-600 text-white shadow-sm hover:bg-gray-400 sm:top-10 sm:right-10 md:top-16 md:right-16 transition-transform transform hover:scale-105"
          onClick={handleOpenCart}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
          {cartItems.length > 0 && (
            <span className="absolute top-0 right-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">
              {cartItems.length}
            </span>
          )}
        </button>
      )}

      <div className="col-span-3">
        <h2 className="text-2xl font-semibold mb-4">Categories</h2>
        <div className="flex flex-wrap justify-center gap-1">
          {category?.map((c) => (
            <div
              key={c._id}
              className={`w-md sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mt-5 mb-3 px-3 category ${
                selectedCategory === c._id ? "category-active" : ""
              }`}
              onClick={() => handleCategoryClick(c._id)}
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <Link
                  // to={`/category/${c.slug}`}
                  className="block p-4 transition duration-300 ease-in-out hover:bg-indigo-100"
                >
                  <span className="text-2xl">{c.name}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card  */}

      <div className="flex justify-center items-center h-screen flex-wrap">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 ">
            {food
              .filter((i) => i.category._id === selectedCategory)
              .map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden p-6 hover:shadow-lg transition duration-300 ease-in-out cursor-pointer"
                >
                  <div className="block">
                    <div className=" py-4">
                      <h5 className="text-xl font-semibold">{p.name}</h5>
                      <img
                        src={`/api/v1/food/food-photo/${p._id}`}
                        className="w-full h-40 object-cover rounded-lg"
                        alt={p.name}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <h5 className="text-xl font-semibold">
                      Price : ₹ {p.price}
                    </h5>
                    <button
                      onClick={() => addItemToCart(p)}
                      className="rounded-full bg-gray-700 text-white px-4 py-2 text-sm font-semibold hover:bg-gray-500 transition duration-200 ease-in-out"
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

      {isCartOpen && (
        <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-lg p-4 overflow-y-auto">
          <div className="flex justify-end">
            <button
              type="button"
              className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
              onClick={handleCartClose}
            >
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Close panel</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <h2 className="text-lg font-semibold mb-4">Shopping Cart</h2>
          <ul role="list" className="my-6 divide-y flex-center">
            {cartItems.map((item) => (
              <li key={item._id} className="py-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={`/api/v1/food/food-photo/${item._id}`} // Change this URL to the correct image URL
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-grow">
                    <p className="text-xl font-semibold">{item.name}</p>
                    <p className="text-base">
                      ${(item.price * item.customQuantity).toFixed(2)}
                    </p>
                    <div className="flex items-center mt-2">
                      <button
                        className="text-xl font-bold w-8 h-8 bg-gray-700 text-white rounded-full flex items-center justify-center"
                        onClick={() => {
                          decreaseCustomQuantity(item._id);
                          updateTotalCost();
                        }}
                      >
                        -
                      </button>
                      <p className="text-xl mx-2">
                        Quantity {item.customQuantity}
                      </p>
                      <button
                        className="text-xl font-bold w-8 h-8 bg-gray-700 text-white rounded-full flex items-center justify-center"
                        onClick={() => {
                          increaseCustomQuantity(item._id);
                          updateTotalCost();
                        }}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="mt-2 text-white bg-red-600 py-1  px-4 font-semibold shadow-sm rounded-md w-xl hover:bg-red-800"
                      onClick={() => removeCartItem(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-200 px-4 py-6">
            <div className="text-lg font-semibold">
              <p>Total: ${calculateTotalPrice().toFixed(2)}</p>
            </div>
            <button
              onClick={clearCart}
              className="block mt-4 px-4 py-2 w-full text-base font-semibold text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700"
            >
              Clear Cart
            </button>
            <button
              href="#"
              className="block mt-4 px-4 py-2 w-full text-base font-semibold text-white bg-green-700 border border-transparent rounded-md shadow-sm hover:bg-green-800"
              onClick={() => handleUpdateClick()}
            >
              Checkout
            </button>
          </div>
        </div>
      )}

      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          initialFocus={cancelButtonRef}
          onClose={() => setOpen(false)}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This is the modal */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                {/* From */}

                <form onClose={handleCloseModal} onSubmit={handleSubmit}>
                  <div className="space-y-12">
                    <div className="border-b  pb-5">
                      <h2 className="text-base mx-6 font-semibold leading-7 text-gray-900">
                        Create Invoice
                      </h2>

                      <div className="mt-10 mx-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-4">
                          <label
                            htmlFor="username"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Customer Name
                          </label>
                          <div className="mt-2">
                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                              <input
                                type="text"
                                name="customerName"
                                id="customername"
                                value={customername}
                                autoComplete="username"
                                onChange={(e) =>
                                  setCustomerName(e.target.value)
                                }
                                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>

                          <label
                            htmlFor="username"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Customer Number
                          </label>
                          <div className="mt-2">
                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                              <input
                                type="text"
                                name="customerNumber"
                                id="customernumber"
                                value={customernumber}
                                autoComplete="username"
                                onChange={(e) =>
                                  setCustomerNumber(e.target.value)
                                }
                                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-b pb-5">
                      <div className="grid grid-cols-1  gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label
                            htmlFor="country"
                            className="block text-sm font-medium leading-6 mx-6 text-gray-900"
                          >
                            Payment Method
                          </label>
                          <div className="mt-2">
                            <select
                              id="paymentMode"
                              name="paymentmode"
                              value={paymentmode}
                              autoComplete="country-name"
                              onChange={(e) => setPaymentMode(e.target.value)}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset  mx-6 focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            >
                              <option>Select payment mode</option>
                              <option value="cash">Cash</option>
                              <option value="cash">Card</option>
                              <option value="card">UPI</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mx-6 mt-4">
                    <div className="mt-2">
                      <h2>taxable Value : ₹{totalAmount}</h2>
                    </div>
                    <div className="mt-2">
                      <h2>Tax : ₹{tax.toString()}</h2>
                    </div>
                    <div className="mt-2 text-xs">
                      Tax Rate :
                      <select
                        className="form-select"
                        style={{ paddingRight: "1rem" }}
                        onChange={(e) => {
                          const selectedTaxRate = e.target.value;
                          handleTaxRateChange(selectedTaxRate);
                        }}
                      >
                        <option>Select tax rate</option>
                        <option value="0">0%SGST + 0%CGST</option>
                        <option value="3">1.5%SGST + 1.5%CGST</option>
                        <option value="5">2.5%SGST + 2.5%CGST</option>
                        <option value="18">9%SGST + 9%CGST</option>
                        <option value="28">14%SGST + 14%CGST</option>
                        <option value="0">Exempted</option>
                        <option value="0">Nil Rate</option>
                      </select>
                    </div>
                    <div className="mt-2">
                      <h2>Net Total : ₹{subtotal.toString()}</h2>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button
                      type="submit"
                      className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 m-6 focus-visible:outline-indigo-600"
                    >
                      Generate Bill
                    </button>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}

export default PointOfSale;
