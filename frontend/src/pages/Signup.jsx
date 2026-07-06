import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signup(name, email, password);
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-hero">
          <div className="auth-badge">Realtime chat • fresh vibes</div>
          <h1>Make chatting feel a little more exciting.</h1>
          <p>
            Create an account and step into rooms designed to feel energetic, easy to browse, and
            genuinely fun to talk in.
          </p>
          <ul className="auth-highlights">
            <li>Instant message delivery</li>
            <li>Organized rooms for each topic</li>
            <li>A more colorful, playful experience</li>
          </ul>
        </div>

        <div className="auth-card">
          <h2>Create your account</h2>
          <p>Start chatting with a brighter, more lively feel.</p>
          <form onSubmit={handleSubmit} className="auth-form">
            {error && <p className="error">{error}</p>}
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <button type="submit">Create account</button>
          </form>
          <p className="auth-link">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
