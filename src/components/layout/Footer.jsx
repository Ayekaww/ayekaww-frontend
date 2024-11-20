// src/components/layout/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-white p-4">
      <div className="container mx-auto text-center">
        &copy; {new Date().getFullYear()} AyeKawww. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
