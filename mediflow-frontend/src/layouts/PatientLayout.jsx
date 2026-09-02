import { Outlet } from "react-router-dom";
import AppSidebar from "../components/AppSidebar";
import Topbar from "../components/Topbar";

function PatientLayout() {
  return (
    <div className="mf-app-shell">
      <AppSidebar />

      <div className="mf-main">
        <Topbar />

        <main className="mf-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default PatientLayout;