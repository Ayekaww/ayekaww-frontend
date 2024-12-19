import React, { useState, useContext } from "react";
import { FaCoins } from "react-icons/fa";
import { FiPlay } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { UserContext } from "../../contexts/UserContext";

const MovieCard = ({ movie }) => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const navigate = useNavigate();
  const token = Cookies.get("token");

  const { user } = useContext(UserContext); // Access user context to get coins

  const handlePlay = async () => {
    if (!token) {
      toast.error("You must be logged in to play a movie.");
      return;
    }

    if (!movie.is_purchased) {
      // Check if the movie requires coins and if the user has enough
      if (movie.coins > 0 && user.coins < movie.coins) {
        toast.error("Insufficient coins to play this movie.");
        return;
      }

      // Prompt user for confirmation if coins are required
      if (movie.coins > 0) {
        const confirmPurchase = window.confirm(
          `This movie will cost ${movie.coins} coins. Do you want to purchase it?`
        );
        if (!confirmPurchase) return;
      }

      // Make a purchase request
      try {
        const response = await fetch(`/api/movies/purchase/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ movie_id: movie.id }),
        });

        if (!response.ok) {
          const data = await response.json();
          toast.error(data.error || "Failed to purchase the movie.");
          return;
        }

        toast.success("Movie purchased successfully!");
        movie.is_purchased = true; // Update movie state to reflect purchase
      } catch (error) {
        toast.error("An error occurred while purchasing the movie.");
        return;
      }
    }

    // Start fade-out animation
    setIsOverlayVisible(true);

    // Trigger navigation after animation completes
    setTimeout(() => {
      navigate(`/movie/${movie.id}`);
    }, 500); // Half of the animation duration
  };

  return (
    <>
      <div className="relative h-[300px] md:h-[400px] min-w-36 md:min-w-60 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
        <img
          src={movie.thumbnail}
          alt={movie.title}
          className="h-full w-full object-cover rounded-lg"
        />

        <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 hover:opacity-100 flex flex-col justify-end p-4 transition-opacity duration-300 rounded-lg">
          <h2 className="text-white text-sm md:text-lg font-bold">{movie.title}</h2>
          <p className="text-sm text-gray-400">
            {movie.year} • {movie.genre}
          </p>
          <div className="flex space-x-4 mt-4">
            <button
              onClick={handlePlay}
              className="bg-red-600 text-white py-1 px-3 rounded-full flex items-center hover:bg-red-700 transition"
            >
              <FiPlay className="mr-2" /> Play{" "}
              <span className="text-amber-200 text-[10px] md:text-base font-bold ms-4">
                {movie.coins > 0 ? movie.coins : "Free"} <FaCoins className="inline" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {isOverlayVisible && (
        <div className="fixed inset-0 bg-black opacity-0 animate-fade-in z-50"></div>
      )}
    </>
  );
};

export default MovieCard;
