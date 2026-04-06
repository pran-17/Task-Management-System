import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="hero">
      <div className="container">
        <div className="hero-header">
          <h1 className="hero-title">Smart Task Management Platform</h1>
          <p className="hero-subtitle">Choose your role to continue</p>
        </div>

        <div className="hero-cards">
          <div className="hero-card">
            <h3>Admin Access</h3>
            <p>Manage employees, approvals, and task assignment.</p>
            <ul>
              <li>Approve employee accounts</li>
              <li>Create employee accounts directly</li>
              <li>View all task statuses</li>
            </ul>
            <Link className="btn hero-btn" to="/admin/login">
              Access Admin Panel
            </Link>
          </div>

          <div className="hero-card">
            <h3>Employee Portal</h3>
            <p>Login to view assigned tasks and update progress.</p>
            <ul>
              <li>View assigned tasks</li>
              <li>Update task status</li>
              <li>Track your progress</li>
            </ul>
            <div className="row">
              <Link className="btn hero-btn-secondary" to="/employee/login">
                Login as Employee
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

