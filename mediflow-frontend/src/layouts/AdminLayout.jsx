import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminLayout() {
  const { user, logout } = useAuth();

  const navigation = [
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
    <div className="mf-app-shell">

      <aside className="mf-sidebar">

        {/* =================================================
            BRAND
        ================================================= */}

        <div className="mf-brand">

          <div className="mf-brand-mark">
            M
          </div>

          <div>
            <strong>
              MediFlow
            </strong>

            <span>
              Care management
            </span>
          </div>

        </div>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <div className="mf-sidebar-section">

          <span className="mf-sidebar-label">
            WORKSPACE
          </span>

          <nav className="mf-nav">

            {navigation.map((item) => (

              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `mf-nav-item ${
                    isActive ? "active" : ""
                  }`
                }
              >

                <span className="mf-nav-icon">
                  {item.icon}
                </span>

                <span>
                  {item.label}
                </span>

              </NavLink>

            ))}

          </nav>

        </div>

        {/* =================================================
            USER + LOGOUT
        ================================================= */}

        <div className="mf-sidebar-bottom">

          <div className="mf-user-card">

            <div className="mf-user-avatar">

              {user?.fullName
                ?.charAt(0)
                ?.toUpperCase() || "A"}

            </div>

            <div className="mf-user-info">

              <strong>
                {user?.fullName ||
                  "MediFlow Admin"}
              </strong>

              <span>
                ADMIN
              </span>

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

      {/* ===================================================
          MAIN AREA
      =================================================== */}

      <main className="mf-main">

        <header className="mf-topbar">

          <div className="mf-topbar-title">

            <span>
              ADMINISTRATION
            </span>

            <strong>
              MediFlow
            </strong>

          </div>

          <div className="mf-topbar-profile">

            <div className="mf-user-avatar small">

              {user?.fullName
                ?.charAt(0)
                ?.toUpperCase() || "A"}

            </div>

            <div>

              <strong>
                {user?.fullName ||
                  "MediFlow Admin"}
              </strong>

              <span>
                Administrator
              </span>

            </div>

          </div>

        </header>

        <div className="mf-content">
          <Outlet />
        </div>

      </main>

    </div>
  );
}

export default AdminLayout;