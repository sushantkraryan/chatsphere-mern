import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-hero">
          <div className="auth-badge">Realtime chat • fresh vibes</div>
          <h1>Jump into a space that feels alive.</h1>
          <p>
            Open rooms, share quick thoughts, and enjoy a lively chat experience that feels warm,
            fast, and fun to use every day.
          </p>
          <ul className="auth-highlights">
            <li>Instant room-based conversations</li>
            <li>Live typing and presence cues</li>
            <li>A brighter, more playful interface</li>
          </ul>
        </div>

        <div className="auth-card">
          <h2>Welcome back</h2>
          <p>Sign in to continue your conversation.</p>
          <form onSubmit={handleSubmit} className="auth-form">
            {error && <p className="error">{error}</p>}
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
            />
            <button type="submit">Log in</button>
          </form>
          <p className="auth-link">
            Need an account? <Link to="/signup">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
