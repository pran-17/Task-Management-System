export default function TaskTable({ tasks, onStatusChange, showAssignee }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          {showAssignee ? <th>Assigned To</th> : null}
          <th>Status</th>
          {onStatusChange ? <th>Update</th> : null}
        </tr>
      </thead>
      <tbody>
        {tasks.map((t) => (
          <tr key={t._id}>
            <td>{t.title}</td>
            <td>{t.description || <span className="muted">—</span>}</td>
            {showAssignee ? (
              <td>
                {t.assignedTo?.name || "—"}
                <div className="muted">{t.assignedTo?.email || ""}</div>
              </td>
            ) : null}
            <td>
              <span className="badge">{t.status}</span>
            </td>
            {onStatusChange ? (
              <td style={{ minWidth: 210 }}>
                <select value={t.status} onChange={(e) => onStatusChange(t._id, e.target.value)}>
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </td>
            ) : null}
          </tr>
        ))}
        {tasks.length === 0 ? (
          <tr>
            <td colSpan={onStatusChange ? (showAssignee ? 5 : 4) : showAssignee ? 4 : 3} className="muted">
              No tasks found.
            </td>
          </tr>
        ) : null}
      </tbody>
    </table>
  );
}

