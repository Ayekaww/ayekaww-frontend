// src/pages/Pricing.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    name: '50 Coins',
    fee: '9,999 Kyats',
    features: ['50 Coins to Watch Premium Movies'],
  },
  {
    name: '200 Coins',
    fee: '14,999 Kyats',
    features: ['200 Coins to Watch Premium Movies'],
  },
  {
    name: '500 Coins',
    fee: '24,999 Kyats',
    features: ['500 Coins to Watch Premium Movies'],
  },
];

const Pricing = () => {
  const navigate = useNavigate();

  const handleChoosePlan = (plan, fee) => {
    navigate(`/checkout?plan=${encodeURIComponent(plan)}&fee=${encodeURIComponent(fee)}`);
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-black min-h-screen p-8">
      <h1 className="text-3xl text-white font-bold mb-8 text-center">Purchase Coins</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="border border-accent p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-2xl font-semibold text-amber-300 mb-4">{plan.name}</h2>
              <p className="text-xl text-white font-bold mb-4">{plan.fee}/month</p>
              <ul className="text-gray-300 my-8 space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index}>• {feature}</li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => handleChoosePlan(plan.name, plan.fee)}
              className="mt-6 px-4 py-2 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-400 transition"
            >
              Purchase {plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
