import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function DashboardLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-layout">

      <aside className="sidebar">
        <h2>MediFlow</h2>

        <nav>
          <NavLink to="/dashboard">
            Dashboard
          </NavLink>

          <NavLink to="/appointments">
            Appointments
          </NavLink>

          <NavLink to="/doctors">
            Doctors
          </NavLink>
        </nav>

        <div>
          <p>{user?.fullName}</p>
          <p>{user?.role}</p>

          <button onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>

    </div>
  );
}

export default DashboardLayout;