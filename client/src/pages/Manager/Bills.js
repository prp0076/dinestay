import React, { useState, useEffect, useRef, Fragment } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import { useReactToPrint } from "react-to-print";
const Bills = () => {
  const componentRef = useRef();
  const cancelButtonRef = useRef(null);
  const [bills, setBills] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState("");

  const gru_id = localStorage.getItem("auth");
  const __id = JSON.parse(gru_id).user.branch;
  const getAllBills = async () => {
    try {
      const { data } = await axios.get(`/api/v1/bills/get-bills/${__id}`);
      setBills(data);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong in getting bills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllBills();
  }, []);

  const handleBill = (billsData) => {
    setSelectedBill(billsData);
    setOpen(true);
  };

  const handlePrint = useReactToPrint({
    content: () => {
      return componentRef.current;
    },
  });
  
  const formatDate = (d) => {
    const dateObject = new Date(selectedBill.date);

    // Format the date in a desired format
    const formattedDate = `${dateObject.getFullYear()}/${
      String(dateObject.getMonth() + 1).padStart(2, "0") // Months are zero-based
    }/${String(dateObject.getDate()).padStart(2, "0")} ${String(
      dateObject.getHours()
    ).padStart(2, "0")}:${String(dateObject.getMinutes()).padStart(
      2,
      "0"
    )}:${String(dateObject.getSeconds()).padStart(2, "0")}`;
    return formattedDate;
  };

  return (
    <div>
      <div className="container py-5" ref={componentRef}>
        <div className="overflow-y-scroll max-h-screen ">
          <table className="bg-white w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-left border-b">SNo.</th>
                <th className="py-3 px-4 text-left border-b">Items</th>
                <th className="py-3 px-4 text-left border-b">Customer Name</th>
                <th className="py-3 px-4 text-left border-b">
                  Customer Number
                </th>
                <th className="py-3 px-4 text-left border-b">Taxable Amount</th>
                <th className="py-3 px-4 text-left border-b">Tax</th>
                <th className="py-3 px-4 text-left border-b">Net Amount</th>
                <th className="py-3 px-4 text-left border-b">Payment Mode</th>
                <th className="py-3 px-4 text-left border-b">Action</th>
              </tr>
            </thead>
            {bills?.map((b, i) => (
              <tbody>
                <tr key={b.id}>
                  <td className="py-3 px-4 border-b">{i + 1}</td>
                  <td>
                    {b?.cartItems?.map((c) => (
                      <p>{c.name}</p>
                    ))}
                  </td>
                  {/* <td className="py-2 px-4">{b.cartItems}</td> */}
                  <td className="py-3 px-4 border-b">{b.customerName}</td>
                  <td className="py-3 px-4 border-b">{b.customerNumber}</td>
                  <td className="py-3 px-4 border-b">
                    {b.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 border-b">{b.tax}</td>
                  <td className="py-3 px-4 border-b">
                    {b.subTotal.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 border-b">{b.paymentMode}</td>
                  <button
                    className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 m-2"
                    onClick={() => handleBill(b)}
                  >
                    {" "}
                    Bill{" "}
                  </button>
                </tr>
              </tbody>
            ))}
          </table>

          {/* This component will be used for printing */}
        </div>
      </div>

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

                <div className="container mx-auto py-8">
                  <div
                    id="invoice-POS"
                    ref={componentRef}
                    className="bg-white p-8 shadow-lg rounded-lg"
                    style={{
                      width: "80%", // Adjust the width as needed
                      margin: "0 auto",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <div id="top" className="text-center mb-4">
                      <img
                        src="https://img.freepik.com/free-vector/detailed-chef-logo-template_23-2148987940.jpg"
                        className="logo bg-gray-200 w-16 h-16 rounded-full mx-auto"
                        alt="Logo"
                      />
                      <div className="info mt-2">
                        <h2 className="text-xl font-bold">
                          Restaurant Management
                        </h2>
                        <p>Contact: 123456 | Mumbai Maharashtra</p>
                      </div>
                    </div>

                    <div id="mid">
                      <table class="min-w-full bg-white border-collapse border border-red-600">
                        <thead class="bg-red-600 text-white">
                          <tr>
                            <th class="py-2 px-4 text-left" colspan="2">
                              Customer Details
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr class="border-b-2  border-red-500">
                            <td class="py-2 px-4 font-semibold">Id</td>
                            <td class="py-2 px-4">
                              <b>{selectedBill._id}</b>
                            </td>
                          </tr>
                          <tr class="border-b-2 border-red-500">
                            <td class="py-2 px-4 font-semibold whitespace-no-wrap">
                              Customer Name
                            </td>
                            <td class="py-2 px-4 whitespace-no-wrap">
                              <b>{selectedBill.customerName}</b>
                            </td>
                          </tr>
                          <tr class="border-b-2 border-red-500">
                            <td class="py-2 px-4 font-semibold whitespace-no-wrap">
                              Phone No
                            </td>
                            <td class="py-2 px-4 whitespace-no-wrap">
                              <b>{selectedBill.customerNumber}</b>
                            </td>
                          </tr>
                          <tr class="border-b-2 border-red-500">
                            <td class="py-2 px-4 font-semibold">Date</td>
                            <td class="py-2 px-4">
                              <b>{formatDate(selectedBill.date)}</b>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div id="bot">
                      <div id="table" className="mt-4">
                        <table className="w-full border  border-collapse">
                          <thead className="bg-red-600 text-white">
                            <tr className="tabletitle">
                              <th className="border border-black p-2 text-left">
                                Item Name
                              </th>
                              <th className="border border-black p-2 text-left">
                                Qty
                              </th>
                              <th className="border border-black p-2 text-left">
                                Price
                              </th>
                              <th className="border border-black p-2 text-left">
                                Total
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedBill?.cartItems?.map((c, index) => (
                              <tr key={index} className="border-t">
                                <td className="border border-red-500 p-2 text-left">
                                  {c.name}
                                </td>
                                <td className="border border-red-500 p-2 text-left">
                                  {c.customQuantity}
                                </td>
                                <td className="border border-red-500 p-2 text-left">
                                  ₹{c.price}
                                </td>
                                <td className="border border-red-500 p-2 text-left">
                                  ₹{c.customQuantity * c.price}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-4 border border-red-500 p-4 rounded-lg">
                        <table className="w-full border-collapse">
                          <tbody>
                            <tr className="tabletitle">
                              <td />
                              <td />
                              <td className="Rate text-left">Taxable Total</td>
                              <td className="payment text-left">
                                <b>₹{selectedBill.totalAmount}</b>
                              </td>
                            </tr>
                            <tr className="tabletitle">
                              <td />
                              <td />
                              <td className="Rate text-left">Tax</td>
                              <td className="payment text-left">
                                <b>₹{selectedBill.tax}</b>
                              </td>
                            </tr>
                            <tr className="tabletitle">
                              <td />
                              <td />
                              <td className="Rate text-left">Net Total</td>
                              <td className="payment text-left">
                                <b>₹{selectedBill.subTotal}</b>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div id="legalcopy" className="mt-4">
                        <p className="legal">
                          <strong>Thank you for your order!</strong>{" "}
                          {selectedBill.taxRate}% GST applies to the total
                          amount. Please note that this is a non-refundable
                          amount. For any assistance, please email{" "}
                          <b>help@mydomain.com</b>.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="bg-blue-500 text-white px-4 py-2 flex justify-end mt-4 mx-12 rounded hover:bg-blue-600"
                    >
                      Print Invoice
                    </button>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default Bills;
