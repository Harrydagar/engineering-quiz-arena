import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import { changePassword } from "../services/auth";

function ChangePassword() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    old_password: "",
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
      const data = await changePassword(
        formData.old_password,
        formData.password,
        formData.confirm_password
      );

      toast.success(data.detail);

      setTimeout(() => {
        navigate("/profile");
      }, 2000);

    } catch (err) {
      const message =
        err.response?.data?.old_password?.[0] ||
        err.response?.data?.password?.[0] ||
        err.response?.data?.confirm_password?.[0] ||
        err.response?.data?.detail ||
        "Unable to change password.";

      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-2">
          Change Password
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Update your password to keep your account secure.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="password"
            name="old_password"
            placeholder="Current Password"
            required
            value={formData.old_password}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

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
            placeholder="Confirm New Password"
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
              : "Change Password"}
          </button>

        </form>

        <p className="text-center mt-6 text-gray-600">
          <Link
            to="/profile"
            className="text-blue-600 font-medium hover:underline"
          >
            ← Back to Profile
          </Link>
        </p>

      </div>

    </div>
  );
}

export default ChangePassword;