import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/auth";

const AllInvoice = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderIdFromUrl = queryParams.get("orderId");
  const [searchResult, setSearchResult] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedTaxType, setSelectedTaxType] = useState(" ");
  const [selectedTaxRate, setSelectedTaxRate] = useState({});
  const [orderIdInput, setOrderIdInput] = useState(orderIdFromUrl || ""); // Set the default value from the URL or an empty string
  const [printButtonVisible, setPrintButtonVisible] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [auth] = useAuth();
  const [invoiceNumber, setInvoiceNumber] = useState("");

  useEffect(() => {
    const generatedInvoiceNumber = generateRandomInvoiceNumber();
    setInvoiceNumber(generatedInvoiceNumber);
  }, []); // Empty dependency array ensures this effect runs only once, on mount
  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/all-orders");

      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  useEffect(() => {
    if (orderIdInput !== "") {
      const filtered = orders.filter(
        (o) => o?.razorpay?.orderId === orderIdInput
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders([]); // If orderIdInput is empty, clear the filteredOrders
    }
  }, [orderIdInput, orders]);

  const generateRandomInvoiceNumber = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const length = 8;
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };
  const handlePrint = () => {
    setPrintButtonVisible(false);
    window.print();
  };
  const handleUser = (userId, userdatabase) => {
    for (let i = 0; i < userdatabase.length; i++) {
      if (userdatabase[i]._id === userId) {
        return [userdatabase[i].name, userdatabase[i].address];
      }
    }
    return null;
  };

  const handleTaxRateChange = (productId, taxRate) => {
    setSelectedTaxRate((prevTaxRates) => ({
      ...prevTaxRates,
      [productId]: taxRate,
    }));
  };

  const handleSearch = async () => {
    try {
      // Fetch all the necessary data in parallel using Promise.all
      const [orderResponse, usersResponse, productsResponse] =
        await Promise.all([
          fetch(`/api/v1/food/searchOrder/${orderIdInput}`).then((response) =>
            response.json()
          ),
          axios.get("/api/v1/auth/all-users").then((response) => response.data),
          fetch(`/api/v1/food/get-food`).then((response) => response.json()),
        ]);

      const userNameFilter = handleUser(orderResponse?.buyer, usersResponse);
      const searchData = {
        ...orderResponse,
        buyerName: userNameFilter[0],
        buyerAddress: userNameFilter[1],
      };

      setFilteredProducts(searchData.products);
      setSearchResult(searchData);
    } catch (error) {
      console.error(error);
      setSearchResult(null);
    }
  };

  useEffect(() => {
    if (orderIdInput) {
      handleSearch();
    }
  });

  useEffect(() => {
    const handleBeforePrint = () => {
      const printButton = document.getElementById("printButton");
      if (printButton) {
        printButton.style.display = "none";
      }
    };

    const handleAfterPrint = () => {
      const printButton = document.getElementById("printButton");
      if (printButton) {
        printButton.style.display = "block";
      }
    };

    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  let totalProductQuantity = 0;
  let totalPrice = 0;

  if (filteredProducts && filteredProducts.length > 0) {
    // Only iterate if filteredProducts is defined and not empty
    filteredProducts.forEach((p) => {
      totalProductQuantity += p.customQuantity;
      totalPrice += Math.round(p.price) * p.customQuantity;
    });
  }
  return (
    <div>
      <h5 className="text-center text-lg font-semibold">
        Tax Invoice / Bill of Supply / Cash Memo <br /> (Original for Recipient)
      </h5>

      {searchResult && (
        <div>
          <table className="table-auto border border-collapse w-full">
            <tbody>
              <tr>
                <td className="p-2 border">
                  Sold By: Manasvi technologies (opc) pvt. ltd.
                </td>
                <td className="p-2 border">
                  Billing To: {searchResult?.buyerName}
                </td>
              </tr>
              <tr>
                <td className="p-2 border">Address: ABC Private Limited</td>
                <td className="p-2 border">
                  Shipping to: {searchResult?.buyerAddress}
                </td>
              </tr>
              <tr>
                <td className="p-2 border">Pan no.: bjhhh2944</td>
                <td className="p-2 border">Invoice No: {invoiceNumber}</td>
              </tr>
              <tr>
                <td className="p-2 border">GST-IN: 132942389</td>
                <td className="p-2 border">
                  Order Date :{" "}
                  {searchResult?.createdAt && (
                    <>
                      {new Date(searchResult.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )}
                    </>
                  )}
                </td>
              </tr>
              <tr>
                <td className="p-2 border">
                  Select State :{" "}
                  <select
                    className="border rounded p-1"
                    value={selectedTaxType}
                    onChange={(e) => setSelectedTaxType(e.target.value)}
                  >
                    <option>Inter-State</option>
                    <option>Intra-State</option>
                  </select>
                </td>
                <td className="p-2 border">
                  <form>
                    Order ID :{" "}
                    <input
                      type="text"
                      className="border rounded p-1 col-5"
                      value={orderIdInput}
                      onChange={(e) => setOrderIdInput(e.target.value)}
                      placeholder="Enter Order ID"
                    />
                  </form>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {searchResult && (
        <div>
          <h2 className="text-2xl font-semibold mt-4">Search Result</h2>

          <table className="table-auto border border-collapse w-full">
            <thead>
              <tr>
                <th className="p-2 border">S.no</th>
                <th className="p-2 border">Product Name</th>
                <th className="p-2 border">Qty</th>
                <th className="p-2 border">Rate/Unit</th>
                <th className="p-2 border">Taxable Value</th>
                <th className="p-2 border">
                  Tax Type
                  <br />
                  (CGST/SGST/IGST)
                </th>
                <th className="p-2 border">Tax Rate</th>
                <th className="p-2 border">Tax Amount</th>
                <th className="p-2 border">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p, j) => (
                <tr key={j}>
                  <td className="p-2 border">{j + 1}</td>
                  <td className="p-2 border col-span-2">{p.name}</td>
                  <td className="p-2 border">{p.customQuantity}</td>
                  <td className="p-2 border">{Math.round(p.price)}</td>
                  <td className="p-2 border">
                    {(
                      Math.round(p.price) * p.customQuantity -
                      ((p.customQuantity * Math.round(p.price)) /
                        (parseFloat(selectedTaxRate[p._id]) + 100)) *
                        parseFloat(selectedTaxRate[p._id])
                    ).toFixed(2)}
                  </td>
                  <td className="p-2 border">
                    {selectedTaxType === "Intra-State" ? (
                      <>SGST/CGST</>
                    ) : (
                      <>IGST</>
                    )}
                  </td>
                  <td className="p-2 border">
                    {selectedTaxType === "Intra-State" ? (
                      <select
                        key={p._id}
                        className="border rounded p-1"
                        onChange={(e) => {
                          const selectedTaxRate = e.target.value;
                          handleTaxRateChange(p._id, selectedTaxRate);
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
                    ) : (
                      <select
                        key={p._id}
                        className="border rounded p-1"
                        onChange={(e) => {
                          const selectedTaxRate = e.target.value;
                          handleTaxRateChange(p._id, selectedTaxRate);
                        }}
                      >
                        <option>Select tax rate</option>
                        <option value="0">0%</option>
                        <option value="3">3%</option>
                        <option value="5">5%</option>
                        <option value="18">18%</option>
                        <option value="28">28%</option>
                        <option value="0">Exempted</option>
                        <option value="0">Nil Rate</option>
                      </select>
                    )}
                  </td>
                  <td className="p-2 border">
                    {selectedTaxRate[p._id] === "0"
                      ? 0
                      : (
                          ((p.customQuantity * Math.round(p.price)) /
                            (parseFloat(selectedTaxRate[p._id]) + 100)) *
                          parseFloat(selectedTaxRate[p._id])
                        ).toFixed(2)}
                  </td>
                  <td className="p-2 border">
                    {p.customQuantity * Math.round(p.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <table className="table-auto border border-collapse w-full mt-4">
            <tbody>
              <tr>
                <th className="p-2 border col-span-6">
                  Total Product Quantity: {totalProductQuantity}
                </th>
                <th className="p-2 border col-span-6 text-right">
                  Total Price:{" "}
                  {totalPrice.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}
                </th>
              </tr>
            </tbody>
          </table>
          <div
            className={`text-center mt-4 ${printButtonVisible ? "" : "hidden"}`}
          >
            <button
              id="printButton"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full"
              onClick={handlePrint}
            >
              Print
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllInvoice;
