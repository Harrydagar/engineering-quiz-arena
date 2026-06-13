import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSubjects } from "../services/quizService";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";

function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getSubjects();
        setSubjects(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSubjects();
  }, []);

  return (
    <>
      <Navbar />
      <div>
        <h1>Subjects</h1>

        {subjects.map((subject) => (
          <div
            key={subject.id}
            onClick={() => navigate(`/subjects/${subject.id}`)}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              margin: "10px",
              cursor: "pointer",
            }}
          >
            <h3>{subject.name}</h3>
          </div>
        ))}
      </div>
    </>
  
  );
}

export default SubjectsPage;