import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../services/auth";
import { saveTokens } from "../utils/auth";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(formData);

      saveTokens(data);

      login(
        data.access,
        data.refresh
      );

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Login Failed");
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
        />

        <br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <br />

        <button type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;