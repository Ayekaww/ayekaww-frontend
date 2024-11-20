import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ScrollToTop from "./components/common/ScrollToTop";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Pricing from "./pages/Pricing";
import Checkout from "./pages/Checkout";
import Movie from "./pages/Movie";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import ResetPassword from "./pages/auth/ResetPassword";
import { UserProvider } from "./contexts/UserContext";
import { LoadingContext, LoadingProvider } from "./contexts/LoadingContext";
import LoadingSpinner from "./components/common/LoadingSpinner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrderHistory from "./pages/OrderHistory";

function App() {
  return (
    <UserProvider>
      <LoadingProvider>
        <LoadingIndicator />

        <Router>
          {/* Add ScrollToTop component here */}
          <ScrollToTop />

          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Public Routes */}
              <Route index element={<Home />} />
              <Route path="search" element={<Search />} />
              <Route path="movie/:id" element={<Movie />} />

              <Route path="profile" element={<Profile />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="order-history" element={<OrderHistory />} />

              {/* Authentication Routes */}
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<SignUp />} />
              <Route path="reset-password" element={<ResetPassword />} />
            </Route>
          </Routes>
        </Router>

        <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
      </LoadingProvider>
    </UserProvider>
  );
}

const LoadingIndicator = () => {
  const { isLoading } = useContext(LoadingContext);
  return isLoading ? <LoadingSpinner /> : null;
};

export default App;
