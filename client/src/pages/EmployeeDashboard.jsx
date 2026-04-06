import { useEffect, useState } from "react";
import api from "../services/api";
import { loadAuth, saveAuth } from "../services/storage";
import TaskTable from "../components/TaskTable";

export default function EmployeeDashboard() {
  const auth = loadAuth();
  const employeeId = auth?.user?.id;
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadTasks() {
    setError("");
    setLoading(true);
    try {
      const res = await api.get(`/api/employee/tasks/${employeeId}`);
      setTasks(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function updateStatus(taskId, status) {
    setError("");
    const prev = tasks;
    setTasks((ts) => ts.map((t) => (t._id === taskId ? { ...t, status } : t)));
    try {
      await api.put(`/api/employee/task/${taskId}`, { status });
    } catch (err) {
      setTasks(prev);
      setError(err?.response?.data?.message || "Failed to update status");
    }
  }

  function refreshAuthFromStorage() {
    const latest = loadAuth();
    if (latest) saveAuth(latest);
  }

  useEffect(() => {
    refreshAuthFromStorage();
  }, []);

  return (
    <div className="container">
      <div className="grid">
        <div className="card">
          <h2 className="title">Employee Dashboard</h2>
          <div className="muted">Welcome, {auth?.user?.name}</div>
          {error ? <div className="error" style={{ marginTop: 10 }}>{error}</div> : null}
        </div>

        <div className="card">
          <h3 className="title">My Tasks</h3>
          {loading ? <div className="muted">Loading...</div> : null}
          <TaskTable tasks={tasks} onStatusChange={updateStatus} />
        </div>
      </div>
    </div>
  );
}

