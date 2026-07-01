import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTopics } from "../services/quizService";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";

function TopicsPage() {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [topics, setTopics] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchTopics();
  }, [subjectId]);

  const fetchTopics = async () => {
    try {
      const data =
        await getTopics(subjectId);

      setTopics(data);
    } catch (error) {
      console.error(
        "Failed to fetch topics",
        error
      );
    } finally {
      setLoading(false);
    }
  };

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
            Topics
          </h1>

          <p className="text-gray-500 mt-2">
            Select a topic to begin
            your quiz.
          </p>

        </div>

        {topics.length === 0 ? (
          <div className="bg-white rounded-xl shadow border p-8 text-center">

            <h2 className="text-xl font-semibold mb-2">
              No Topics Available
            </h2>

            <p className="text-gray-500">
              This subject doesn't
              have any topics yet.
            </p>

          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {topics.map((topic) => (
              <div
                key={topic.id}
                onClick={() =>
                  navigate(
                    `/start-quiz?subject=${subjectId}&topic=${topic.id}`
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
                  {topic.name}
                </h3>

                <p className="text-gray-500 mb-6">
                  Practice questions
                  and improve your
                  understanding.
                </p>

                <button
                  className="
                    bg-green-600
                    text-white
                    px-4
                    py-2
                    rounded-lg
                  "
                >
                  Start Quiz
                </button>

              </div>
            ))}
          </div>
        )}

      </div>
    </>
  );
}

export default TopicsPage;