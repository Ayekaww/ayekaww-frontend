import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const location = useLocation(); // React Router hook to get current location

  useEffect(() => {
    // Scrolls to the top of the page on every route change
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Optional: Add smooth scroll effect
    });
  }, [location.pathname]); // Dependency on the pathname ensures this runs on route change

  return null; // This component does not render anything
};

export default ScrollToTop;
