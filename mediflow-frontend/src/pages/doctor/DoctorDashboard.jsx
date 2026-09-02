import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function DoctorDashboard() {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const response = await api.get(
          "/api/doctor/appointments"
        );

        setAppointments(response.data);
      } catch (error) {
        console.error(
          "Failed to load doctor appointments:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  const pending = appointments.filter(
    (appointment) => appointment.status === "PENDING"
  ).length;

  const approved = appointments.filter(
    (appointment) => appointment.status === "APPROVED"
  ).length;

  const completed = appointments.filter(
    (appointment) => appointment.status === "COMPLETED"
  ).length;

  const cancelled = appointments.filter(
    (appointment) => appointment.status === "CANCELLED"
  ).length;

  const recentAppointments = [...appointments]
    .sort(
      (a, b) =>
        new Date(
          `${b.appointmentDate}T${b.appointmentTime}`
        ) -
        new Date(
          `${a.appointmentDate}T${a.appointmentTime}`
        )
    )
    .slice(0, 5);

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading your workspace...
      </div>
    );
  }

  return (
    <div className="doctor-dashboard">

      {/* Header */}
      <section className="dashboard-header">
        <div>
          <p className="eyebrow">DOCTOR WORKSPACE</p>

          <h1>
            Good morning,{" "}
            <span>{user?.fullName}</span>
          </h1>

          <p className="header-subtitle">
            Here's an overview of today's patient activity.
          </p>
        </div>

        <div className="profile-chip">
          <div className="avatar">
            {user?.fullName?.charAt(0)?.toUpperCase()}
          </div>

          <div>
            <strong>{user?.fullName}</strong>
            <span>Doctor</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon">AP</div>

          <div>
            <span>Total appointments</span>
            <strong>{appointments.length}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">PN</div>

          <div>
            <span>Pending</span>
            <strong>{pending}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">OK</div>

          <div>
            <span>Approved</span>
            <strong>{approved}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">CM</div>

          <div>
            <span>Completed</span>
            <strong>{completed}</strong>
          </div>
        </div>

      </section>

      {/* Main content */}
      <section className="dashboard-grid">

        {/* Appointments */}
        <div className="panel">

          <div className="panel-header">
            <div>
              <p className="eyebrow">PATIENT CARE</p>
              <h2>Recent appointments</h2>
            </div>

          <button
            className="text-button"
            onClick={() => navigate("/doctor/appointments")}
           >
           View appointments →
          </button>
          </div>

          {recentAppointments.length === 0 ? (
            <div className="empty-state">
              <h3>No appointments yet</h3>
              <p>
                New patient appointments will appear here.
              </p>
            </div>
          ) : (
            <div className="doctor-appointment-list">

              {recentAppointments.map((appointment) => (
                <div
                  className="doctor-appointment-row"
                  key={appointment.id}
                >

                  <div className="patient-avatar">
                    {appointment.patientName
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </div>

                  <div className="patient-summary">
                    <strong>
                      {appointment.patientName}
                    </strong>

                    <span>
                      {appointment.appointmentDate}
                      {" • "}
                      {appointment.appointmentTime}
                    </span>
                  </div>

                  <span
                    className={`doctor-status status-${appointment.status.toLowerCase()}`}
                  >
                    {appointment.status}
                  </span>

                </div>
              ))}

            </div>
          )}

        </div>

        {/* Today's summary */}
        <div className="panel">

          <div className="panel-header">
            <div>
              <p className="eyebrow">WORKLOAD</p>
              <h2>Appointment summary</h2>
            </div>
          </div>

          <div className="workload-list">

            <div className="workload-item">
              <span>Pending review</span>
              <strong>{pending}</strong>
            </div>

            <div className="workload-item">
              <span>Approved</span>
              <strong>{approved}</strong>
            </div>

            <div className="workload-item">
              <span>Completed</span>
              <strong>{completed}</strong>
            </div>

            <div className="workload-item">
              <span>Cancelled</span>
              <strong>{cancelled}</strong>
            </div>

          </div>

        </div>

      </section>

      {/* Clinical note */}
      <section className="doctor-note">

        <div>
          <span className="doctor-note-label">
            MEDIFLOW WORKSPACE
          </span>

          <h2>
            Keep patient care moving.
          </h2>

          <p>
            Review pending appointments and update their
            status as consultations progress.
          </p>
        </div>

        <div className="doctor-note-mark">
          {user?.fullName?.charAt(0)?.toUpperCase()}
        </div>

      </section>

    </div>
  );
}

export default DoctorDashboard;