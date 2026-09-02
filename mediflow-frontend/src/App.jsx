import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/Login";

import PatientDashboard from "./pages/patient/PatientDashboard";
import Doctors from "./pages/patient/Doctors";
import BookAppointment from "./pages/patient/BookAppointment";
import MyAppointments from "./pages/patient/MyAppointments";
import AIAssistant from "./pages/patient/AIAssistant";

import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPatients from "./pages/admin/AdminPatients";
import AdminDoctors from "./pages/admin/AdminDoctors";
import AdminSpecialists from "./pages/admin/AdminSpecialists";
import AdminAppointments from "./pages/admin/AdminAppointments";

import PatientLayout from "./layouts/PatientLayout";
import DoctorLayout from "./layouts/DoctorLayout";
import AdminLayout from "./layouts/AdminLayout";

/* =========================================================
   AUTHENTICATION GUARD
   ========================================================= */

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

/* =========================================================
   ROLE GUARD
   ========================================================= */

function RequireRole({ roles, children }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!user?.role || !roles.includes(user.role)) {
    if (user?.role === "PATIENT") {
      return (
        <Navigate
          to="/patient/dashboard"
          replace
        />
      );
    }

    if (user?.role === "DOCTOR") {
      return (
        <Navigate
          to="/doctor/dashboard"
          replace
        />
      );
    }

    if (user?.role === "ADMIN") {
      return (
        <Navigate
          to="/admin/dashboard"
          replace
        />
      );
    }

    return <Navigate to="/" replace />;
  }

  return children;
}

/* =========================================================
   PUBLIC LOGIN ROUTE
   ========================================================= */

function PublicLogin() {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    if (user?.role === "PATIENT") {
      return (
        <Navigate
          to="/patient/dashboard"
          replace
        />
      );
    }

    if (user?.role === "DOCTOR") {
      return (
        <Navigate
          to="/doctor/dashboard"
          replace
        />
      );
    }

    if (user?.role === "ADMIN") {
      return (
        <Navigate
          to="/admin/dashboard"
          replace
        />
      );
    }
  }

  return <Login />;
}

/* =========================================================
   APPLICATION
   ========================================================= */

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>

        <Routes>

          {/* =================================================
              PUBLIC
          ================================================= */}

          <Route
            path="/"
            element={<PublicLogin />}
          />

          {/* =================================================
              PATIENT
          ================================================= */}

          <Route
            element={
              <RequireRole roles={["PATIENT"]}>
                <PatientLayout />
              </RequireRole>
            }
          >

            <Route
              path="/patient/dashboard"
              element={<PatientDashboard />}
            />

            <Route
              path="/patient/doctors"
              element={<Doctors />}
            />

            <Route
              path="/patient/doctors/:doctorId/book"
              element={<BookAppointment />}
            />

            <Route
              path="/patient/appointments"
              element={<MyAppointments />}
            />

            <Route
              path="/patient/ai-assistant"
              element={<AIAssistant />}
            />

          </Route>

          {/* =================================================
              DOCTOR
          ================================================= */}

          <Route
            element={
              <RequireRole roles={["DOCTOR"]}>
                <DoctorLayout />
              </RequireRole>
            }
          >

            <Route
              path="/doctor/dashboard"
              element={<DoctorDashboard />}
            />

            <Route
              path="/doctor/appointments"
              element={<DoctorAppointments />}
            />

          </Route>

         {/* =================================================
    ADMIN
================================================= */}

<Route
  element={
    <RequireRole roles={["ADMIN"]}>
      <AdminLayout />
    </RequireRole>
  }
>
  <Route
    path="/admin/dashboard"
    element={<AdminDashboard />}
  />

  <Route
    path="/admin/patients"
    element={<AdminPatients />}
  />

  <Route
    path="/admin/doctors"
    element={<AdminDoctors />}
  />

  <Route
    path="/admin/specialists"
    element={<AdminSpecialists />}
  />

  <Route
    path="/admin/appointments"
    element={<AdminAppointments />}
  />
</Route>

          {/* =================================================
              UNKNOWN ROUTES
          ================================================= */}

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>

      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;