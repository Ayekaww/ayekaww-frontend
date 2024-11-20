// src/components/Input.jsx
import React from 'react';
import { FiSearch } from 'react-icons/fi';

const Input = ({ label, type = 'text', placeholder, className = '', search = false, ...props }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className="block mb-1 font-medium text-gray-700">{label}</label>}
      <div className="relative">
        {search && (
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        )}
        <input
          type={type}
          placeholder={placeholder}
          className={`w-full text-background ${search ? 'pl-10' : 'pl-3'} py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
          {...props}
        />
      </div>
    </div>
  );
};

export default Input;
