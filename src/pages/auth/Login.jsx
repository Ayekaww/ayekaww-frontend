// src/pages/auth/Login.jsx
import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../services/authService";
import { UserContext } from "../../contexts/UserContext";
import { LoadingContext } from "../../contexts/LoadingContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { loginToken } = useContext(UserContext);
  const { setIsLoading } = useContext(LoadingContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const data = await login(email, password);
      loginToken(data.access);
      navigate("/"); // Redirect to home after login
    } catch (error) {
      console.log(error);
      setError("Invalid email or password");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-2 bg-gray-900 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-2 bg-gray-900 rounded-lg"
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full p-3 mt-6 bg-green-500 rounded-lg"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-4 text-gray-400">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-green-500 hover:underline">
            Sign Up
          </Link>
        </p>

        <p className="text-center mt-4">
          <Link to="/signup" className="text-green-500 hover:underline">
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
