import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMenu, FiX } from "react-icons/fi";
import { UserContext } from "../../contexts/UserContext";
import logo from "../../assets/logo.jpg";
import Input from "../common/Input";
import { FaCoins } from "react-icons/fa";

const Nav = () => {
  const { isLoggedIn, user } = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchKey, setSearchKey] = useState(""); // State for search input
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearchKeyPress = (event) => {
    if (event.key === "Enter" && searchKey.trim()) {
      navigate(`/search?key=${encodeURIComponent(searchKey.trim())}`);
    }
  };

  return (
    <nav className="bg-black/80 sticky top-0 text-white p-4 z-[50]">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="h-16 w-16 md:h-20 md:w-20" />
          </Link>
        </div>

        {/* Search Bar - Visible on both mobile and desktop */}
        <div className="flex-grow -mb-4 mx-4">
          <Input
            type="text"
            placeholder="Search movies..."
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            className="w-full"
            search
          />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          {user && (
            <Link to="/pricing" className="hover:underline text-amber-300">
              {user.coins}{" "}
              <span>
                <FaCoins className="inline"></FaCoins>
              </span>
            </Link>
          )}

          {isLoggedIn ? (
            <Link to="/profile" className="hover:underline flex items-center">
              <FiUser className="h-6 w-6 text-accent" />
            </Link>
          ) : (
            <Link to="/login" className="hover:underline">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-white focus:outline-none"
        >
          {isMenuOpen ? (
            <FiX className="h-8 w-8" />
          ) : (
            <FiMenu className="h-8 w-8" />
          )}
        </button>
      </div>

      {/* Mobile Side Menu */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-black text-white transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="p-4 flex flex-col space-y-4">
          {/* Close Button and Logo */}
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="Logo" className="h-12 w-12" />
              <span className="text-2xl font-bold">AyeKaww</span>
            </Link>
          </div>

          {/* Mobile Links */}
          <Link to="/" className="hover:underline" onClick={toggleMenu}>
            Home
          </Link>
          {user && (
            <Link
              to="/pricing"
              onClick={toggleMenu}
              className="hover:underline text-amber-300"
            >
              {user.coins}{" "}
              <span>
                <FaCoins className="inline"></FaCoins>
              </span>
            </Link>
          )}
          {isLoggedIn ? (
            <Link
              to="/profile"
              className="hover:underline flex items-center"
              onClick={toggleMenu}
            >
              <FiUser className="h-6 w-6 mr-2 text-accent" />
              Profile
            </Link>
          ) : (
            <Link to="/login" className="hover:underline" onClick={toggleMenu}>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
