import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="hero-badge">Trusted Laundry Care</div>
        <h1>Manage laundry orders in a smarter and cleaner way.</h1>
        <p>
          Track orders, check pricing, choose self drop or pickup service, and
          manage status updates from one place.
        </p>

        <div className="feature-list">
          <div className="feature-item">✔ Easy customer order placement</div>
          <div className="feature-item">✔ Pickup and self-drop options</div>
          <div className="feature-item">✔ Transparent pricing</div>
          <div className="feature-item">✔ First order discount benefit</div>
        </div>
      </div>

      <div className="auth-card">
        <h2>Login</h2>
        <p className="auth-text">Welcome back. Please enter your details.</p>

        <form onSubmit={submit} className="auth-form">
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="switch-auth">
          New user? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;