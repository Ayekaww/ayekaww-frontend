import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { LoadingContext } from '../contexts/LoadingContext';
import { BASE_URL } from '../constants';
import Cookies from 'js-cookie';

const OrderHistory = () => {
  const token = Cookies.get('token');
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const { setIsLoading } = useContext(LoadingContext);

  useEffect(() => {
    const fetchOrders = async () => {
      setErrorMessage('');
      setIsLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/api/orders/history/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
      } catch (error) {
        setErrorMessage('Failed to fetch order history.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [setIsLoading]);

  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-black min-h-screen py-10 px-8 text-white">
      <h1 className="text-3xl font-extrabold mb-10 text-center">Order History</h1>

      {errorMessage && (
        <div className="text-center text-red-500 mb-6">
          {errorMessage}
        </div>
      )}

      <section className="border border-accent bg-gray-800 p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
        {orders.length === 0 ? (
          <p className="text-gray-400 text-center">No orders found. Start purchasing plans to see them here!</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between bg-gray-900 p-6 rounded-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-left space-y-2 text-sm md:text-base">
                  <p className="text-lg">
                    <strong className="text-green-400">Plan:</strong> {order.plan} Coins
                  </p>
                  <p className="text-gray-400">
                    <strong className="text-blue-400">Status:</strong>{' '}
                    <span
                      className={`font-semibold ${
                        order.status === 'confirmed'
                          ? 'text-green-500'
                          : order.status === 'pending'
                          ? 'text-yellow-500'
                          : 'text-red-500'
                      }`}
                    >
                      {order.status}
                    </span>
                  </p>
                  <p className="text-gray-400">
                    <strong className="text-purple-400">Date:</strong>{' '}
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                {/* <div className="text-right">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 transition"
                    onClick={() => alert(`Order ID: ${order.id}`)}
                  >
                    View Details
                  </button>
                </div> */}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default OrderHistory;
