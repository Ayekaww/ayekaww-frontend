import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios, { formToJSON } from "axios";
import { LoadingContext } from "../contexts/LoadingContext";
import { BASE_URL } from "../constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { FaHistory } from "react-icons/fa";

const paymentMethods = [
  { id: "kbzpay", name: "KBZ Pay", account: "0987654321\nKYAW KO KO TUN" },
  { id: "wavepay", name: "Wave Pay", account: "0912345678\nKYAW KO KO TUN" },
];

const Checkout = () => {
  const token = Cookies.get("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  });

  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0].id);
  const [plan, setPlan] = useState("");
  const [fee, setFee] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [preview, setPreview] = useState(null);
  const { setIsLoading } = useContext(LoadingContext);
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setPlan(searchParams.get("plan") || "Unknown Plan");
    setFee(searchParams.get("fee") || "0 Kyats");
  }, [location.search]);

  const handlePaymentMethodChange = (e) => {
    setSelectedMethod(e.target.value);
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    setScreenshot(file);
    setPreview(URL.createObjectURL(file));
  };

  const handlePayment = async () => {
    if (!screenshot) {
      toast.error("Please upload a screenshot before proceeding.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("plan", plan.split(" ")[0]);
    formData.append("order_details", `${selectedMethod} - ${fee} MMK`);
    formData.append("screenshot", screenshot);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/orders/create/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Payment successful!");
      navigate("/order-history");
    } catch (error) {
      toast.error("Failed to process payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-black min-h-screen p-8 text-white">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
      <Link to="/order-history" className="text-green-500 text-center hover:underline">
        See Order History <FaHistory className="inline"/>
      </Link>
      {/* Order Summary */}
      <section className="bg-gray-800 p-6 mt-4 rounded-lg shadow-lg mb-8 border border-accent">
        <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
        <div className="text-gray-300">
          <p>
            <span className="font-medium">Plan:</span> {plan}
          </p>
          <p>
            <span className="font-medium">Price:</span> {fee}
          </p>
        </div>
      </section>

      {/* Payment Method Selection */}
      <section className="bg-gray-900 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">Choose Payment Method</h2>
        <form className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center">
              <input
                type="radio"
                id={method.id}
                name="paymentMethod"
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={handlePaymentMethodChange}
                className="form-radio h-4 w-4 text-green-500 transition"
              />
              <label htmlFor={method.id} className="ml-3 text-gray-300">
                {method.name}
              </label>
            </div>
          ))}
        </form>
        <div className="mt-4 bg-gray-950 p-4 rounded-lg text-gray-400 whitespace-pre-wrap">
          <strong>Payment Account Details:</strong>
          <br />
          {
            paymentMethods.find((method) => method.id === selectedMethod)
              .account
          }
        </div>
      </section>

      {/* Screenshot Upload */}
      <section className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Upload Payment Screenshot
        </h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleScreenshotChange}
          className="bg-gray-900 w-full p-2 text-gray-300 rounded-lg"
        />
        {preview && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Preview:</h3>
            <img
              src={preview}
              alt="Screenshot Preview"
              className="w-full max-w-md rounded-lg"
            />
          </div>
        )}
      </section>

      {/* Confirm and Pay Button */}
      <div className="text-center">
        <button
          onClick={handlePayment}
          className="mt-6 px-6 py-3 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-400 transition"
        >
          Confirm and Pay
        </button>
      </div>
    </div>
  );
};

export default Checkout;
