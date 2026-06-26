import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Register() {
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

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        email,
        password,
      });

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Registration failed."
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
            color: "#f5f5f5",
            marginBottom: 25,
          }}
        >
          Create your account 
          <br />
          Start organizing your daily tasks.
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
            position: "relative",
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
              fontSize: 18,
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
            ? "Creating Account..."
            : "Register"}
        </button>

        <p
          style={{
            marginTop: 22,
            textAlign: "center",
          }}
        >
          Already have an account?
          <br />

          <Link to="/">
            Login →
          </Link>
        </p>

      </form>

    </div>
  );
}

export default Register;