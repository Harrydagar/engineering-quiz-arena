import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { forgotPassword } from "../services/auth";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const data = await forgotPassword(email);

      toast.success(data.detail);

      setEmail("");

    } catch (err) {
      toast.error(
        err.response?.data?.detail ||
        "Unable to send password reset email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-2">
          Forgot Password
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Enter your email address and we'll send you a password reset link.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-lg p-3 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Sending..."
              : "Send Reset Link"}
          </button>

        </form>

        <p className="text-center mt-6 text-gray-600">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default ForgotPassword;