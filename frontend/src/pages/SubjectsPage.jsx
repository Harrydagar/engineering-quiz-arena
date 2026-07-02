import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSubjects } from "../services/quizService";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";

function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getSubjects();
        setSubjects(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <LoadingSpinner />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Subjects
          </h1>

          <p className="mt-2 text-lg text-gray-600">
            Choose a subject and start practicing to improve your skills.
          </p>
        </div>

        {subjects.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900">
              No Subjects Available
            </h2>

            <p className="mt-3 text-gray-500">
              Subjects will appear here once they are added.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {subjects.map((subject) => (
              <div
                key={subject.id}
                onClick={() =>
                  navigate(`/subjects/${subject.id}`)
                }
                className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                  📘
                </div>

                <h2 className="text-2xl font-bold text-gray-900">
                  {subject.name}
                </h2>

                <p className="mt-3 text-gray-600">
                  Practice quizzes, strengthen concepts, and improve your overall performance.
                </p>

                <button
                  className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition-colors duration-200 hover:bg-blue-700"
                >
                  View Topics
                </button>
              </div>
            ))}

          </div>
        )}

      </div>
    </>
  );
}

export default SubjectsPage;