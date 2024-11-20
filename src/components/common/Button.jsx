// src/components/Button.jsx
import React from 'react';

const Button = ({ variant = 'primary', children, onClick, ...props }) => {
  const baseStyles = 'px-4 py-2 rounded font-semibold text-center';
  const variants = {
    primary: `${baseStyles} bg-green-500 text-white hover:bg-green-600`,
    danger: `${baseStyles} bg-red-500 text-white hover:bg-red-600`,
    secondary: `${baseStyles} bg-gray-500 text-white hover:bg-gray-600`,
  };

  return (
    <button
      className={variants[variant] || variants.primary}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
