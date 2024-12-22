import React, { useState, useEffect, useContext } from "react";
import Slider from "react-slick";
import MovieCard from "../components/specific/MovieCard";
import axios from "axios";
import { BASE_URL } from "../constants";
import { LoadingContext } from "../contexts/LoadingContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const PreviousArrow = ({ onClick }) => (
  <button
    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-75 transition"
    onClick={onClick}
  >
    <FiChevronLeft size={24} />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-75 transition"
    onClick={onClick}
  >
    <FiChevronRight size={24} />
  </button>
);

const Home = () => {
  const [movieData, setMovieData] = useState({});
  const { setIsLoading } = useContext(LoadingContext);
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true); // Set loading to true
      try {
        const response = await axios.get(`${BASE_URL}/api/movies/home/`, {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        });
        setMovieData(response.data);
      } catch (error) {
        toast.error("Failed to fetch movies. Please try again.");
        console.error("Error fetching movies:", error);
      } finally {
        setIsLoading(false); // Set loading to false
      }
    };

    fetchMovies();
  }, [setIsLoading]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PreviousArrow />,
  };

  const renderOtherCategories = () => {
    return Object.keys(movieData)
      .filter((category) => category !== "Hot Movies")
      .map((category, index) => (
        <section key={index} className="space-y-4">
          <h2 className="text-2xl font-semibold">{category}</h2>
          <div className="flex space-x-4 overflow-x-scroll scrollbar-hide">
            {movieData[category].map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      ));
  };

  return (
    <div className="bg-black text-white min-h-screen p-4 space-y-8">

<section className="bg-gray-800 text-center py-4 rounded-lg border border-gray-600">
        <p className="text-lg font-medium">
          Place your ads here!{" "} Contact telegram 
          <a
            href="https://t.me/nltsupporting"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 ms-2 underline hover:text-blue-600"
          >
          @nltsupporting
          </a>{" "}
          for details.
        </p>
      </section>
      {/* Hot Movies Section */}
      {movieData["Hot Movies"] && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Hot Movies</h2>
          <Slider {...settings} className="relative">
            {movieData["Hot Movies"].map((movie) => (
              <div key={movie.id} className="px-2">
                <MovieCard movie={movie} />
              </div>
            ))}
          </Slider>
        </section>
      )}

      {/* Ads Banner */}
      <section className="bg-gray-800 text-center py-4 rounded-lg border border-gray-600">
        <p className="text-lg font-medium">
          Place your ads here!{" "} Contact telegram 
          <a
            href="https://t.me/nltsupporting"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 ms-2 underline hover:text-blue-600"
          >
          @nltsupporting
          </a>{" "}
          for details.
        </p>
      </section>

      {/* Other Categories */}
      {renderOtherCategories()}

      <section className="bg-gray-800 text-center py-4 rounded-lg border border-gray-600">
        <p className="text-lg font-medium">
          Place your ads here!{" "} Contact telegram 
          <a
            href="https://t.me/nltsupporting"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 ms-2 underline hover:text-blue-600"
          >
          @nltsupporting
          </a>{" "}
          for details.
        </p>
      </section>
    </div>
  );
};

export default Home;
