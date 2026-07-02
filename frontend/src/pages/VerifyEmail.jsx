import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { verifyEmail } from "../services/auth";

function VerifyEmail() {
  const { uidb64, token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const data = await verifyEmail(uidb64, token);

        setSuccess(true);
        setMessage(data.detail);

        setTimeout(() => {
          navigate("/login");
        }, 3000);

      } catch (error) {
        setSuccess(false);

        setMessage(
          error.response?.data?.detail ||
          "Verification link is invalid or has expired."
        );
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [uidb64, token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">

        {loading ? (
          <>
            <h1 className="text-2xl font-bold mb-4">
              Verifying...
            </h1>

            <p className="text-gray-500">
              Please wait while we verify your account.
            </p>
          </>
        ) : success ? (
          <>
            <h1 className="text-3xl font-bold text-green-600 mb-4">
              Email Verified
            </h1>

            <p className="text-gray-600 mb-6">
              {message}
            </p>

            <p className="text-sm text-gray-500">
              Redirecting to login...
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-red-600 mb-4">
              Verification Failed
            </h1>

            <p className="text-gray-600 mb-6">
              {message}
            </p>

            <Link
              to="/resend-verification"
              className="text-blue-600 font-medium"
            >
              Resend Verification Email
            </Link>
          </>
        )}

      </div>

    </div>
  );
}

export default VerifyEmail;