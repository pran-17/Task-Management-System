import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import AssignTask from "./AssignTask";
import TaskList from "./TaskList";

export default function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [newEmpName, setNewEmpName] = useState("");
  const [newEmpEmail, setNewEmpEmail] = useState("");
  const [newEmpPassword, setNewEmpPassword] = useState("");
  const [createEmpLoading, setCreateEmpLoading] = useState(false);
  const [createEmpMessage, setCreateEmpMessage] = useState("");

  const approvedEmployees = useMemo(() => employees.filter((e) => e.isApproved), [employees]);

  async function loadAll() {
    setError("");
    setLoading(true);
    try {
      const [empRes, taskRes] = await Promise.all([api.get("/api/admin/employees"), api.get("/api/admin/tasks")]);
      setEmployees(empRes.data || []);
      setTasks(taskRes.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  async function approve(id) {
    setError("");
    try {
      await api.put(`/api/admin/approve/${id}`);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setError(err?.response?.data?.message || "Approval failed");
    }
  }

  async function createEmployee(e) {
    e.preventDefault();
    setError("");
    setCreateEmpMessage("");
    setCreateEmpLoading(true);
    try {
      await api.post("/api/admin/employee", {
        name: newEmpName,
        email: newEmpEmail,
        password: newEmpPassword
      });
      setCreateEmpMessage("Employee created and approved successfully. Employee can login now.");
      setNewEmpName("");
      setNewEmpEmail("");
      setNewEmpPassword("");
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setError(err?.response?.data?.message || "Employee creation failed");
    } finally {
      setCreateEmpLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="grid">
        <div className="card">
          <h2 className="title">Admin Dashboard</h2>
          {error ? <div className="error">{error}</div> : null}
          {loading ? <div className="muted">Loading...</div> : null}
        </div>

        <div className="grid grid-2">
          <div className="card">
            <h3 className="title">Employees</h3>
            {createEmpMessage ? <div className="success" style={{ marginBottom: 10 }}>{createEmpMessage}</div> : null}
            <form className="grid" onSubmit={createEmployee} style={{ marginBottom: 14 }}>
              <div className="field">
                <label>Create Employee (Admin)</label>
                <input
                  value={newEmpName}
                  onChange={(e) => setNewEmpName(e.target.value)}
                  placeholder="Employee name"
                />
              </div>
              <div className="field">
                <input
                  value={newEmpEmail}
                  onChange={(e) => setNewEmpEmail(e.target.value)}
                  type="email"
                  placeholder="Employee email"
                />
              </div>
              <div className="field">
                <input
                  value={newEmpPassword}
                  onChange={(e) => setNewEmpPassword(e.target.value)}
                  type="password"
                  placeholder="Employee password"
                />
              </div>
              <button className="btn" disabled={createEmpLoading} type="submit">
                {createEmpLoading ? "Creating..." : "Create Employee"}
              </button>
            </form>

            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Approved</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((e) => (
                  <tr key={e._id}>
                    <td>{e.name}</td>
                    <td>{e.email}</td>
                    <td>{e.isApproved ? "Yes" : "No"}</td>
                    <td>
                      {!e.isApproved ? (
                        <button className="btn" onClick={() => approve(e._id)} type="button">
                          Approve
                        </button>
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="muted">
                      No employees registered.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="card">
            <AssignTask employees={approvedEmployees} onCreated={() => setRefreshKey((k) => k + 1)} />
          </div>
        </div>

        <div className="card">
          <TaskList tasks={tasks} />
        </div>
      </div>
    </div>
  );
}

