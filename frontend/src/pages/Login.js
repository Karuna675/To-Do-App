import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      navigate("/tasks");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">

      <form onSubmit={submit}>

        <h2>📝 To-Do List</h2>

        <p
          style={{
            textAlign: "center",
            marginBottom: 25,
            color: "#f5f5f5"
          }}
        >
          Welcome back 👋
          <br />
          Sign in to manage your tasks.
        </p>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="📧 Email Address"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <div
          style={{
            position: "relative"
          }}
        >
          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="🔒 Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <span
            onClick={() =>
              setShowPassword(!showPassword)
            }
            style={{
              position: "absolute",
              right: 15,
              top: 15,
              cursor: "pointer",
              userSelect: "none",
              fontSize: 18
            }}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Signing In..."
            : "Login"}
        </button>

        <p
          style={{
            marginTop: 22,
            textAlign: "center"
          }}
        >
          Don't have an account?
          <br />

          <Link to="/register">
            Create one →
          </Link>
        </p>

      </form>

    </div>
  );
}

export default Login;