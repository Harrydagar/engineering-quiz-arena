import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

function NotFoundPage() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-7xl font-bold text-blue-600 mb-4">
          404
        </h1>

        <h2 className="text-3xl font-semibold mb-4">
          Page Not Found
        </h2>

        <p className="text-gray-600 mb-8">
          The page you are looking for does not exist.
        </p>

        <Link
          to="/dashboard"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Back to Dashboard
        </Link>
      </div>
    </MainLayout>
  );
}

export default NotFoundPage;