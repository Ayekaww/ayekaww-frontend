import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { BASE_URL } from "../constants";
import MovieCard from "../components/specific/MovieCard";

const Movie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = Cookies.get("token");

  const [movie, setMovie] = useState(null);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [isFadeComplete, setIsFadeComplete] = useState(false); // Track animation

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }

    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/movies/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMovie(response.data);
        setRecommendedMovies(response.data.recommended_movies || []);
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
        navigate("/");
      }
    };

    // Fetch movie details and wait for animation
    fetchMovieDetails();
    setTimeout(() => setIsFadeComplete(true), 500); // Half of the animation duration
  }, [id, token, navigate]);

  if (!isFadeComplete) {
    return (
      <div className="fixed inset-0 bg-black opacity-100 animate-fade-out z-50"></div>
    );
  }

  if (!movie) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="bg-black min-h-screen p-8 text-white">
      {/* Video Player Section */}
      <div className="w-full mb-8">
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
