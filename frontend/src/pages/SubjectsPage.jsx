import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSubjects } from "../services/quizService";

function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSubjects();
  }, []);

const fetchSubjects = async () => {
  console.log("Fetching subjects...");

  try {
    const data = await getSubjects();

    console.log("API Response:", data);

    setSubjects(data);
  } catch (error) {
    console.error("Failed to fetch subjects", error);

    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Data:", error.response.data);
    }
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      <h1>Subjects</h1>

      {subjects.map((subject) => (
        <div
          key={subject.id}
          onClick={() => navigate(`/subjects/${subject.id}`)}
          style={{
            border: "1px solid #ccc",
            padding: "12px",
            margin: "12px 0",
            cursor: "pointer",
          }}
        >
          <h3>{subject.name}</h3>
          <p>{subject.description}</p>
        </div>
      ))}
    </div>
  );
}

export default SubjectsPage;