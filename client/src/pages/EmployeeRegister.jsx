import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function EmployeeRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await api.post("/api/auth/register", { name, email, password });
      setSuccess(res.data?.message || "Registered. Waiting for admin approval.");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 560, margin: "0 auto" }}>
        <h2 className="title">Employee Registration</h2>
        {error ? <div className="error">{error}</div> : null}
        {success ? (
          <div className="success">
            {success} <div className="muted">You can login after admin approval.</div>
          </div>
        ) : null}
        <form className="grid" onSubmit={onSubmit}>
          <div className="field">
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
          </div>
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
            {loading ? "Creating..." : "Register"}
          </button>
          <div className="muted">
            Already approved? <Link to="/employee/login">Employee Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

