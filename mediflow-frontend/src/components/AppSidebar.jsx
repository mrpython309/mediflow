import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AppSidebar() {
  const { user, logout } = useAuth();

  const navigation =
    user?.role === "PATIENT"
      ? [
          {
            label: "Overview",
            path: "/patient/dashboard",
            icon: "OV",
          },
          {
            label: "Find doctors",
            path: "/patient/doctors",
            icon: "DR",
          },
          {
            label: "Appointments",
            path: "/patient/appointments",
            icon: "AP",
          },
          {
            label: "MediFlow AI",
            path: "/patient/ai-assistant",
            icon: "AI",
          },
        ]
      : user?.role === "DOCTOR"
        ? [
            {
              label: "Overview",
              path: "/doctor/dashboard",
              icon: "OV",
            },
            {
              label: "Appointments",
              path: "/doctor/appointments",
              icon: "AP",
            },
          ]
        : [
            {
              label: "Overview",
              path: "/admin/dashboard",
              icon: "OV",
            },
            {
              label: "Patients",
              path: "/admin/patients",
              icon: "PT",
            },
            {
              label: "Doctors",
              path: "/admin/doctors",
              icon: "DR",
            },
            {
              label: "Specialists",
              path: "/admin/specialists",
              icon: "SP",
            },
            {
              label: "Appointments",
              path: "/admin/appointments",
              icon: "AP",
            },
          ];

  return (
    <aside className="mf-sidebar">
      <div className="mf-brand">
        <div className="mf-brand-mark">M</div>

        <div>
          <strong>MediFlow</strong>
          <span>Care management</span>
        </div>
      </div>

      <div className="mf-sidebar-section">
        <span className="mf-sidebar-label">WORKSPACE</span>

        <nav className="mf-nav">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `mf-nav-item ${isActive ? "active" : ""}`
              }
            >
              <span className="mf-nav-icon">{item.icon}</span>

              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mf-sidebar-bottom">
        <div className="mf-user-card">
          <div className="mf-user-avatar">
            {user?.fullName?.charAt(0)?.toUpperCase()}
          </div>

          <div className="mf-user-info">
            <strong>{user?.fullName}</strong>
            <span>{user?.role}</span>
          </div>
        </div>

        <button
          type="button"
          className="mf-logout"
          onClick={logout}
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}

export default AppSidebar;