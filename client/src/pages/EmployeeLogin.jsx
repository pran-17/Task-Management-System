import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { saveAuth } from "../services/storage";

export default function EmployeeLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      if (res.data?.user?.role !== "employee") {
        setError("Not an employee account.");
        setLoading(false);
        return;
      }
      saveAuth(res.data);
      navigate("/employee/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 520, margin: "0 auto" }}>
        <h2 className="title">Employee Login</h2>
        {error ? <div className="error">{error}</div> : null}
        <form className="grid" onSubmit={onSubmit}>
          <div className="field">
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
            />
          </div>
          <button className="btn" disabled={loading} type="submit">
            {loading ? "Logging in..." : "Login"}
          </button>
          <div className="muted">If not approved, you’ll see “Waiting for admin approval”.</div>
        </form>
      </div>
    </div>
  );
}

