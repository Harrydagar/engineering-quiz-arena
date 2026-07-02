import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";

import { resetPassword } from "../services/auth";

function ResetPassword() {
  const { uidb64, token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const data = await resetPassword(
        uidb64,
        token,
        formData.password,
        formData.confirm_password
      );

      toast.success(data.detail);

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      const message =
        err.response?.data?.confirm_password?.[0] ||
        err.response?.data?.password?.[0] ||
        err.response?.data?.detail ||
        "Unable to reset password.";

      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-2">
          Reset Password
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Choose a new password for your account.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="password"
            name="password"
            placeholder="New Password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
            required
            value={formData.confirm_password}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-lg p-3 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Updating..."
              : "Reset Password"}
          </button>

        </form>

        <p className="text-center mt-6 text-gray-600">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Back to Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default ResetPassword;