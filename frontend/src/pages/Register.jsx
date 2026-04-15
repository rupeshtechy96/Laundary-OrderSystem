import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await API.post("/auth/register", form);
      setSuccess("Registration successful. You can login now.");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="hero-badge">Quick Registration</div>
        <h1>Start using our laundry platform in just a few steps.</h1>
        <p>
          Create your customer account, view prices, place orders, and enjoy a
          first order discount on eligible bookings.
        </p>

        <div className="feature-list">
          <div className="feature-item">✔ Clean and simple ordering experience</div>
          <div className="feature-item">✔ Track progress from pending to delivered</div>
          <div className="feature-item">✔ View timings and service schedule</div>
          <div className="feature-item">✔ Transparent billing and extra charges</div>
        </div>
      </div>

      <div className="auth-card">
        <h2>Register</h2>
        <p className="auth-text">Create your customer account.</p>

        <form onSubmit={submit} className="auth-form">
          <input
            type="text"
            name="name"
            placeholder="Enter full name"
            value={form.name}
            onChange={handleChange}
            required
          />

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
            placeholder="Create password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="switch-auth">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;