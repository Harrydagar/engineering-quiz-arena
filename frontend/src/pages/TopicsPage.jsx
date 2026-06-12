import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTopics } from "../services/quizService";


function TopicsPage() {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopics();
  }, [subjectId]);

  const fetchTopics = async () => {
    try {
      const data = await getTopics(subjectId);

      console.log("Topics:", data);

      setTopics(data);
    } catch (error) {
      console.error("Failed to fetch topics", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      <h1>Topics</h1>

      {topics.map((topic) => (
        <div
          key={topic.id}
          onClick={() =>
            navigate(
              `/start-quiz?subject=${subjectId}&topic=${topic.id}`
            )
          }
          style={{
            border: "1px solid #ccc",
            padding: "12px",
            margin: "12px 0",
            cursor: "pointer",
          }}
        >
          <h3>{topic.name}</h3>
        </div>
      ))}
    </div>
  );
}

export default TopicsPage;