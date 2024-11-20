import React, { useContext, useEffect, useState } from "react";
import MovieCard from "../components/specific/MovieCard";
import axios from "axios";
import { BASE_URL } from "../constants";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { logout } from "../services/authService";
import { UserContext } from "../contexts/UserContext";
import { toast } from "react-toastify";
import { LoadingContext } from "../contexts/LoadingContext";
import { FaSignOutAlt } from "react-icons/fa";

const profilePictureUrl = "https://img.freepik.com/premium-photo/3d-avatar-boy-character_914455-603.jpg";

const Profile = () => {
  const token = Cookies.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  });

  const [userData, setUserData] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const { setIsLoading } = useContext(LoadingContext);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal for editing profile
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // Modal for confirming logout
  const [newName, setNewName] = useState(""); // Editable name
  const { logoutToken } = useContext(UserContext);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/api/auth/token/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
        setNewName(response.data.username); // Set initial name
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchWatchlist = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/api/movies/watchlist/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWatchlist(response.data); // Assuming API returns a list of movies
      } catch (error) {
        toast.error("Failed to fetch watchlist. Please try again.");
        console.error("Failed to fetch watchlist:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
    fetchWatchlist();
  }, [setIsLoading]);

  const handleLogout = () => {
    logout();
    logoutToken();
    navigate("/login");
  };

  const handleSaveProfile = async () => {
    try {
      await axios.put(
        `${BASE_URL}/api/profile/update/`, // Replace with the correct API endpoint
        { username: newName },
        { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
      );
      setUserData({ ...userData, username: newName });
      setIsEditModalOpen(false);
      toast.success("Successfully Saved");
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-950 via-gray-900 to-black min-h-screen p-8 text-white">
      <div className="flex flex-col md:flex-row items-center mb-8 space-y-6 md:space-y-0 md:space-x-8">
        {/* Profile Picture */}
        <div className="relative">
          <img
            src={profilePictureUrl}
            alt="Profile"
            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-gray-700 shadow-md"
          />
        </div>

        {/* Profile Details */}
        <div className="border border-accent p-6 rounded-lg text-sm md:text-base shadow-lg w-full md:w-2/3">
          <h2 className="text-xl md:text-3xl font-semibold mb-4">
            {userData?.username || "User Name"}
          </h2>
          <p className="text-gray-300 mb-2">
            <span className="font-medium">Email:</span>{" "}
            {userData?.email || "Email not available"}
          </p>

          <Link to="/pricing">
            <button className="w-full rounded-xl my-4 text-left px-4 py-2 bg-gray-700 border border-amber-300 hover:bg-gray-600 transition text-gray-300">
              Buy Coins <p className="text-sm text-amber-300">You have {userData?.coins} coins</p>
            </button>
          </Link>

          <div className="flex flex-col gap-2 mt-4">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-4 py-2 w-full bg-green-500 text-black font-semibold rounded-lg hover:bg-green-400 transition"
            >
              Edit Profile
            </button>

            <Link to="/reset-password">
              <button className="w-full text-center px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition text-gray-300">
                Change Password
              </button>
            </Link>

            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="px-4 py-2 w-full mt-6 bg-danger text-white font-semibold rounded-lg hover:bg-red-500 transition"
            >
              Logout <FaSignOutAlt className="inline" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Edit Profile
            </h2>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full p-3 bg-gray-900 rounded-lg mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-400 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Confirm Logout
            </h2>
            <p className="text-gray-300 mb-6 text-center">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-danger text-white font-semibold rounded-lg hover:bg-red-500 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Watchlist Section */}
      <section className="p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Watchlist</h2>
        {watchlist.length === 0 ? (
          <p className="text-gray-300">Your watchlist is empty.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {watchlist.map((watchlist) => (
              <MovieCard key={watchlist.movie.id} movie={watchlist.movie} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;
