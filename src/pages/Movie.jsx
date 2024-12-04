import React, { useContext, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import MovieCard from "../components/specific/MovieCard";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { BASE_URL } from "../constants";
import { LoadingContext } from "../contexts/LoadingContext";
import { UserContext } from "../contexts/UserContext";

const Movie = () => {
  const { id } = useParams(); // Get the movie ID from the URL
  const navigate = useNavigate();
  const token = Cookies.get("token");

  const {setIsLoading} = useContext(LoadingContext)
  const {fetchUser} = useContext(UserContext)

  const [movie, setMovie] = useState(null);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [isWatchlisted, setIsWatchlisted] = useState(false); // Track watchlist status

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(`${BASE_URL}/api/movies/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMovie(response.data);
        setRecommendedMovies(response.data.recommended_movies || []);
        setIsWatchlisted(response.data.is_watchlisted); // Set watchlist state
      } catch (error) {
        toast.error("Failed to fetch movie details.");
        console.error("Error fetching movie details:", error);
        navigate("/"); // Redirect to home on failure
      }
      fetchUser()
      setIsLoading(false)
    };

    fetchMovieDetails();
  }, [id, token, navigate]);

  const handleWatchlistToggle = async () => {
    setIsLoading(true)

    try {
      if (isWatchlisted) {
        // Remove from watchlist
        await axios.delete(`${BASE_URL}/api/movies/watchlist/remove/${movie.id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success(`${movie.title} has been removed from your watchlist.`);
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
        toast.success(`${movie.title} has been added to your watchlist.`);
      }
      setIsWatchlisted(!isWatchlisted); // Toggle watchlist state
    } catch (error) {
      toast.error("Failed to update watchlist.");
      console.error("Error updating watchlist:", error);
    }
    setIsLoading(false)

  };

  if (!movie) {
    return <></>;
  }

  return (
    <div className="bg-black min-h-screen p-8 text-white">
      {/* Video Player Section */}
      <div className="w-full mb-8">
        {/* <ReactPlayer
          url="https://www.youtube.com/watch?v=YoHD9XEInc0" // Hardcoded YouTube trailer URL
          controls
          width="100%"
          height="400px"
          className="rounded-lg overflow-hidden shadow-lg"
        /> */}
        <div dangerouslySetInnerHTML={{ __html: movie.embedded }} />
      </div>

      {/* Movie Details Section */}
      <div className="flex flex-col md:flex-row items-start md:space-x-8 mb-8">
        <div className="flex flex-col space-y-4 mt-4 md:mt-0">
          <h1 className="text-4xl font-bold">{movie.title}</h1>
          <p className="text-gray-400">
            {movie.year} • {movie.genre} • Directed by {movie.director || "Unknown"}
          </p>
          <p className="text-gray-300">{movie.description}</p>
          <div className="flex space-x-4 mt-4">
            <button
              onClick={handleWatchlistToggle}
              className={`px-4 py-2 font-semibold rounded-lg transition ${
                isWatchlisted
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
            >
              {isWatchlisted ? "- Remove from Watchlist" : "+ Add to Watchlist"}
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Movies Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Recommended Movies</h2>
        <div className="flex space-x-4 overflow-x-scroll scrollbar-hide">
          {recommendedMovies.map((recommendedMovie) => (
            <MovieCard key={recommendedMovie.id} movie={recommendedMovie} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Movie;
