import React, { useState } from "react";
import { FaTelegram } from "react-icons/fa";
import { FiHeadphones } from "react-icons/fi";

const FloatingSupportIcon = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      {/* Floating Headphone Icon */}
      <button
        onClick={toggleModal}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-500 transition z-50"
      >
        <FiHeadphones size={24} />
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-background text-white rounded-lg p-6 w-11/12 max-w-md shadow-lg text-center">
            <h2 className="text-lg font-semibold mb-4">Contact Us</h2>
            <p className="mb-4">
              ကြော်ငြာထည့်ချင်ပါက <br />
            </p>
            <p className="mb-4">
              အခက်ခဲတစ်ခုခုရှိပါက <br />
            </p>
            <p className="mb-4">
              Collaboration လုပ်ချင်ပါက <br />
<FaTelegram className="w-16 h-16 mt-8 mx-auto block text-blue-500 mb-2"/>
              <a
                href="https://t.me/nltsupporting"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 block underline hover:text-blue-800"
              >
                @nltsupporting
              </a>{" "}
              ကိုဆက်သွယ်ပါ
            </p>
            <button
              onClick={toggleModal}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingSupportIcon;
