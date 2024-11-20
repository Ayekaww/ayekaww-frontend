import React, { useContext, useState } from "react";
import { FaCoins } from "react-icons/fa";
import { FiPlay, FiPlus, FiMinus } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../../constants";
import Cookies from "js-cookie";
import { LoadingContext } from "../../contexts/LoadingContext";
import { UserContext } from "../../contexts/UserContext";

const MovieCard = ({ movie }) => {
  const [isWatchlisted, setIsWatchlisted] = useState(
    movie.is_watchlisted || false
  );
  const { setIsLoading } = useContext(LoadingContext);
  const { user, setUser } = useContext(UserContext); // Access user and setter from context
  const token = Cookies.get("token");
  const navigate = useNavigate()

  const handleWatchlistToggle = async () => {
    setIsLoading(true);

    if (!token) {
      toast.error("You must be logged in to manage your watchlist.");
      setIsLoading(false);

      return;
    }

    try {
      if (isWatchlisted) {
        // Remove from watchlist
        await axios.delete(
          `${BASE_URL}/api/movies/watchlist/remove/${movie.id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(`${movie.title} removed from watchlist!`);
      } else {
        // Add to watchlist
        await axios.post(
          `${BASE_URL}/api/movies/watchlist/`,
          { movie_id: movie.id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(`${movie.title} added to watchlist!`);
      }
      setIsWatchlisted(!isWatchlisted); // Toggle the watchlist state
    } catch (error) {
      console.error("Failed to update watchlist:", error);
      toast.error("Something went wrong. Please try again.");
    }

    setIsLoading(false);
  };

  const handlePlay = async () => {
    if (!token) {
      toast.error("You must be logged in to play a movie.");
      return;
    }

    if (movie.coins > 0) {
      // Movie requires coins
      if (user.coins < movie.coins) {
        toast.error("Insufficient coins to play this movie.");
        return;
      }

      // Prompt user for confirmation
      const confirmPlay = window.confirm(
        `This movie will cost ${movie.coins} coins. Do you want to proceed?`
      );
      if (!confirmPlay) return;
      navigate(`/movie/${movie.id}`)

    }
      else{
        navigate(`/movie/${movie.id}`)

      
    }
  };

  return (
    <div className="relative h-[300px] md:h-[400px] min-w-36 md:min-w-60 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Movie Poster */}
      <img
        src={
          movie.thumbnail.startsWith("http")
            ? movie.thumbnail
            : `${BASE_URL}${movie.thumbnail}`
        }
        alt={movie.title}
        className="h-full w-full object-cover rounded-lg"
      />

      {/* Overlay for Movie Info */}
      <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 hover:opacity-100 flex flex-col justify-end p-4 transition-opacity duration-300 rounded-lg">
        <h2 className="text-white text-sm md:text-lg font-bold">
          {movie.title}
        </h2>
        <p className="text-sm text-gray-400">
          {movie.year} • {movie.genre}
        </p>

        {/* Buttons */}
        <div className="flex flex-col text-sm md:flex-row mt-4 gap-2">
          <button
            onClick={handlePlay}
            className="bg-red-600 text-white py-1 px-3 rounded-full flex items-center hover:bg-red-700 transition"
          >
            <FiPlay className="mr-2" /> Play{" "}
            <span className="text-amber-200 text-[10px] md:text-base font-bold ms-4">
              {movie.coins > 0 ? movie.coins : "Free"} <FaCoins className="inline" />
            </span>
          </button>
          <button
            onClick={handleWatchlistToggle}
            className={`py-1 px-3 w-fit rounded-full flex items-center ${
              isWatchlisted
                ? "bg-gray-800 text-white hover:bg-gray-900"
                : "bg-gray-700 text-white hover:bg-gray-800"
            } transition`}
          >
            {isWatchlisted ? (
              <>
                <FiMinus className="mr-2" /> Remove Watchlist
              </>
            ) : (
              <>
                <FiPlus className="mr-2" /> Watchlist
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
