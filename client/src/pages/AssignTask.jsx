import { useState } from "react";
import api from "../services/api";

export default function AssignTask({ employees, onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await api.post("/api/admin/task", { title, description, assignedTo });
      setSuccess("Task assigned.");
      setTitle("");
      setDescription("");
      setAssignedTo("");
      onCreated?.();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to assign task");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3 className="title">Assign Task</h3>
      {error ? <div className="error">{error}</div> : null}
      {success ? <div className="success">{success}</div> : null}
      <form className="grid" onSubmit={onSubmit}>
        <div className="field">
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" />
        </div>
        <div className="field">
          <label>Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task description"
          />
        </div>
        <div className="field">
          <label>Assign To (approved employees)</label>
          <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
            <option value="">Select employee</option>
            {employees.map((e) => (
              <option key={e._id} value={e._id}>
                {e.name} ({e.email})
              </option>
            ))}
          </select>
        </div>
        <button className="btn" disabled={loading || employees.length === 0} type="submit">
          {loading ? "Assigning..." : "Assign"}
        </button>
        {employees.length === 0 ? <div className="muted">No approved employees yet.</div> : null}
      </form>
    </div>
  );
}

