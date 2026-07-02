import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { resendVerification } from "../services/auth";

function ResendVerification() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const data = await resendVerification(email);

      toast.success(data.detail);

      setEmail("");

    } catch (err) {
      const message =
        err.response?.data?.detail ||
        "Unable to resend verification email.";

      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-2">
          Resend Verification
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Enter your email address to receive another verification link.
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
            className="w-full bg-blue-600 text-white rounded-lg p-3 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Sending..."
              : "Resend Verification"}
          </button>

        </form>

        <p className="text-center mt-6 text-gray-600">
          Back to{" "}
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

export default ResendVerification;