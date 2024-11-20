// src/pages/auth/ResetPassword.jsx
import React, { useState, useContext } from 'react';
import { resetPassword, confirmResetPassword } from '../../services/authService';
import { LoadingContext } from '../../contexts/LoadingContext';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const { setIsLoading } = useContext(LoadingContext); // Access setIsLoading from context

  const handleSendOtp = async () => {
    setIsLoading(true);
    try {
      await resetPassword(email);
      setOtpSent(true);
      setError(null);
      toast.success("OTP code has been sent to " + email)
    } catch (error) {
      setError('Failed to send OTP. Please check the email address.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await confirmResetPassword(email, otp, newPassword);
      setSuccessMessage('Password reset successfully. You can now log in.');
      setError(null);
    } catch (error) {
      setError('Failed to reset password. Please check the OTP code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Reset Password</h1>
        {error && <p className="text-red-500">{error}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-2 bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              disabled={otpSent} // Disable email input once OTP is sent
            />
          </div>
          {!otpSent && (
            <button
              type="button"
              onClick={handleSendOtp}
              className="w-full p-3 mt-4 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-400 transition"
            >
              Send OTP
            </button>
          )}
          {otpSent && (
            <>
              <div>
                <label htmlFor="otp" className="block text-sm font-medium">OTP Code</label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-3 mt-2 bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium">New Password</label>
                <input
                  type="password"
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 mt-2 bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full p-3 mt-6 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-400 transition"
              >
                Reset Password
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
