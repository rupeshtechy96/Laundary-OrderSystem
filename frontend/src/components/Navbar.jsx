import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

 let user = null;

try {
  user = JSON.parse(localStorage.getItem("user"));
} catch (error) {
  user = null;
}
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="brand-section">
          <div className="brand-logo">🧺</div>
          <div>
            <h2 className="brand-title">Laundry System</h2>
            <p className="brand-subtitle">Fast, clean and reliable service</p>
          </div>
        </div>

        {token && user && (
          <div className="nav-right">
            <div className="nav-links">
              <Link
                to="/dashboard"
                className={isActive("/dashboard") ? "nav-link active-link" : "nav-link"}
              >
                Dashboard
              </Link>
              <Link
                to="/orders"
                className={isActive("/orders") ? "nav-link active-link" : "nav-link"}
              >
                Orders
              </Link>
              <Link
                to="/pricing"
                className={isActive("/pricing") ? "nav-link active-link" : "nav-link"}
              >
                Pricing
              </Link>
              <Link
                to="/schedule"
                className={isActive("/schedule") ? "nav-link active-link" : "nav-link"}
              >
                Schedule
              </Link>
            </div>

            <div className="user-box">
              <span className="user-role">
                {user.role === "admin" ? "Admin" : "Customer"}
              </span>
              <span className="user-name">{user.name}</span>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;