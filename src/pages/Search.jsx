import React, { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import MovieCard from "../components/specific/MovieCard";
import axios from "axios";
import { BASE_URL } from "../constants";
import { toast } from "react-toastify";
import { LoadingContext } from "../contexts/LoadingContext";

const Search = () => {
  const [searchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState([]);
  const { setIsLoading } = useContext(LoadingContext);
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1); // Total pages

  const searchTerm = searchParams.get("key");

  useEffect(() => {
    if (!searchTerm) return;

    const fetchSearchResults = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/api/movies/search/`, {
          params: { search: searchTerm, page },
        });
        setSearchResults(response.data.results); // API uses `results` key for paginated data
        setTotalPages(Math.ceil(response.data.count / 20)); // `count` contains total items
      } catch (error) {
        toast.error("Failed to fetch search results. Please try again.");
        console.error("Error fetching search results:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchTerm, page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">
        Search Results for "{searchTerm}"
      </h1>

      <>
        {searchResults.length > 0 ? (
          <section className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {searchResults.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </section>
        ) : (
          <p className="text-gray-300">No results found.</p>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg ${
              page === 1
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gray-700 text-white hover:bg-gray-600"
            } transition`}
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className={`px-4 py-2 rounded-lg ${
              page === totalPages
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gray-700 text-white hover:bg-gray-600"
            } transition`}
          >
            Next
          </button>
        </div>
      </>
    </div>
  );
};

export default Search;
