import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSubjects } from "../services/quizService";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";

function SubjectsPage() {
  const [subjects, setSubjects] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects =
      async () => {
        try {
          const data =
            await getSubjects();

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

      <div className="max-w-6xl mx-auto p-6">

        <div className="mb-8">

          <h1 className="text-4xl font-bold">
            Subjects
          </h1>

          <p className="text-gray-500 mt-2">
            Choose a subject to start
            practicing.
          </p>

        </div>

        {subjects.length === 0 ? (
          <div className="bg-white rounded-xl shadow border p-8 text-center">

            <h2 className="text-xl font-semibold mb-2">
              No Subjects Available
            </h2>

            <p className="text-gray-500">
              Please add subjects to
              begin.
            </p>

          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {subjects.map(
              (subject) => (
                <div
                  key={subject.id}
                  onClick={() =>
                    navigate(
                      `/subjects/${subject.id}`
                    )
                  }
                  className="
                    bg-white
                    rounded-xl
                    border
                    shadow-sm
                    p-6
                    cursor-pointer
                    hover:shadow-lg
                    transition
                  "
                >

                  <h3 className="text-2xl font-bold mb-3">
                    {subject.name}
                  </h3>

                  <p className="text-gray-500 mb-6">
                    Start quizzes and
                    improve your skills.
                  </p>

                  <button
                    className="
                      bg-blue-600
                      text-white
                      px-4
                      py-2
                      rounded-lg
                    "
                  >
                    View Topics
                  </button>

                </div>
              )
            )}

          </div>
        )}

      </div>
    </>
  );
}

export default SubjectsPage;