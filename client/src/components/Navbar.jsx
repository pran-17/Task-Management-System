import { Link, useNavigate } from "react-router-dom";
import { clearAuth, loadAuth } from "../services/storage";

export default function Navbar() {
  const navigate = useNavigate();
  const auth = loadAuth();

  function logout() {
    clearAuth();
    navigate("/");
  }

  return (
    <div className="nav">
      <div className="row">
        <Link to="/" style={{ color: "#fff", textDecoration: "none", fontWeight: 700 }}>
          Task Portal
        </Link>
        <span className="muted" style={{ color: "#9ca3af" }}>
          {auth?.user?.role ? `(${auth.user.role})` : ""}
        </span>
      </div>
      <div className="row">
        <Link to="/">Home</Link>
        {auth?.token ? (
          <button className="btn light" onClick={logout} type="button">
            Logout
          </button>
        ) : null}
      </div>
    </div>
  );
}

