import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Stethoscope,
  Users,
  UserRound,
  XCircle,
} from "lucide-react";

import api from "../../services/api";

function AdminDashboard() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [specialists, setSpecialists] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          patientsResponse,
          doctorsResponse,
          specialistsResponse,
          appointmentsResponse,
        ] = await Promise.all([
          api.get("/api/admin/patients"),
          api.get("/api/admin/doctors"),
          api.get("/api/specialists"),
          api.get("/api/admin/appointments"),
        ]);

        setPatients(patientsResponse.data || []);
        setDoctors(doctorsResponse.data || []);
        setSpecialists(specialistsResponse.data || []);
        setAppointments(
          appointmentsResponse.data || []
        );
      } catch (err) {
        console.error(
          "Failed to load admin dashboard:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const appointmentStats = useMemo(() => {
    return {
      total: appointments.length,

      pending: appointments.filter(
        (appointment) =>
          appointment.status === "PENDING"
      ).length,

      approved: appointments.filter(
        (appointment) =>
          appointment.status === "APPROVED"
      ).length,

      completed: appointments.filter(
        (appointment) =>
          appointment.status === "COMPLETED"
      ).length,

      cancelled: appointments.filter(
        (appointment) =>
          appointment.status === "CANCELLED"
      ).length,
    };
  }, [appointments]);

  const recentAppointments = useMemo(() => {
    return [...appointments]
      .sort((a, b) => b.id - a.id)
      .slice(0, 5);
  }, [appointments]);

  const formatDate = (date) => {
    if (!date) {
      return "Date not available";
    }

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) {
      return "Time not available";
    }

    return new Date(
      `1970-01-01T${time}`
    ).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getInitial = (name) => {
    return (
      name?.trim()?.charAt(0)?.toUpperCase() ||
      "P"
    );
  };

  if (loading) {
    return (
      <div className="admin-dashboard-state">
        Loading MediFlow overview...
      </div>
    );
  }

  return (
    <div className="admin-dashboard">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="dashboard-header">

        <div>
          <span className="eyebrow">
            ADMINISTRATION
          </span>

          <h1>
            MediFlow overview
          </h1>

          <p className="header-subtitle">
            A quick view of patients, doctors and
            appointment activity.
          </p>
        </div>

      </section>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="doctors-page-error">
          {error}
        </div>
      )}

      {/* =====================================================
          TOP STATS
      ===================================================== */}

      <section className="admin-stats-grid">

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <Users size={18} />
          </div>

          <div>
            <span>Total patients</span>
            <strong>
              {patients.length}
            </strong>
          </div>

        </div>

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <UserRound size={18} />
          </div>

          <div>
            <span>Total doctors</span>
            <strong>
              {doctors.length}
            </strong>
          </div>

        </div>

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <CalendarDays size={18} />
          </div>

          <div>
            <span>Total appointments</span>
            <strong>
              {appointmentStats.total}
            </strong>
          </div>

        </div>

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <Stethoscope size={18} />
          </div>

          <div>
            <span>Specialists</span>
            <strong>
              {specialists.length}
            </strong>
          </div>

        </div>

      </section>

      {/* =====================================================
          APPOINTMENT STATUS
      ===================================================== */}

      <section className="admin-status-grid">

        <div className="admin-status-card">

          <Clock3 size={16} />

          <div>
            <span>Pending</span>
            <strong>
              {appointmentStats.pending}
            </strong>
          </div>

        </div>

        <div className="admin-status-card">

          <CheckCircle2 size={16} />

          <div>
            <span>Approved</span>
            <strong>
              {appointmentStats.approved}
            </strong>
          </div>

        </div>

        <div className="admin-status-card">

          <CheckCircle2 size={16} />

          <div>
            <span>Completed</span>
            <strong>
              {appointmentStats.completed}
            </strong>
          </div>

        </div>

        <div className="admin-status-card">

          <XCircle size={16} />

          <div>
            <span>Cancelled</span>
            <strong>
              {appointmentStats.cancelled}
            </strong>
          </div>

        </div>

      </section>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="admin-content-grid">

        {/* Recent appointments */}

        <div className="admin-panel">

          <div className="admin-panel-header">

            <div>
              <span className="eyebrow">
                PATIENT CARE
              </span>

              <h2>
                Recent appointments
              </h2>
            </div>

            <a href="/admin/appointments">
              View appointments →
            </a>

          </div>

          {recentAppointments.length === 0 ? (

            <div className="admin-empty-state">

              <CalendarDays size={22} />

              <h3>
                No appointments yet
              </h3>

              <p>
                New patient appointments will appear
                here.
              </p>

            </div>

          ) : (

            <div className="admin-appointment-list">

              {recentAppointments.map(
                (appointment) => (

                  <div
                    className="admin-appointment-row"
                    key={appointment.id}
                  >

                    <div className="admin-patient-avatar">
                      {getInitial(
                        appointment.patientName
                      )}
                    </div>

                    <div className="admin-appointment-main">

                      <strong>
                        {appointment.patientName}
                      </strong>

                      <span>
                        {appointment.doctorName}
                        {" · "}
                        {appointment.specialistName}
                      </span>

                    </div>

                    <div className="admin-appointment-time">

                      <div>
                        <CalendarDays size={13} />

                        <span>
                          {formatDate(
                            appointment.appointmentDate
                          )}
                        </span>
                      </div>

                      <div>
                        <Clock3 size={13} />

                        <span>
                          {formatTime(
                            appointment.appointmentTime
                          )}
                        </span>
                      </div>

                    </div>

                    <span
                      className={
                        `admin-appointment-status ` +
                        `admin-status-${appointment.status.toLowerCase()}`
                      }
                    >
                      {appointment.status}
                    </span>

                  </div>

                )
              )}

            </div>

          )}

        </div>

        {/* Summary */}

        <div className="admin-panel">

          <div className="admin-panel-header">

            <div>
              <span className="eyebrow">
                WORKLOAD
              </span>

              <h2>
                Appointment summary
              </h2>
            </div>

          </div>

          <div className="admin-summary-list">

            <div>
              <span>Pending review</span>

              <strong>
                {appointmentStats.pending}
              </strong>
            </div>

            <div>
              <span>Approved</span>

              <strong>
                {appointmentStats.approved}
              </strong>
            </div>

            <div>
              <span>Completed</span>

              <strong>
                {appointmentStats.completed}
              </strong>
            </div>

            <div>
              <span>Cancelled</span>

              <strong>
                {appointmentStats.cancelled}
              </strong>
            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          FOOTER NOTE
      ===================================================== */}

      <section className="admin-workspace-note">

        <span>
          MEDIFLOW WORKSPACE
        </span>

        <h2>
          Keep patient care moving.
        </h2>

        <p>
          Review appointments and monitor the care
          network from one place.
        </p>

      </section>

    </div>
  );
}

export default AdminDashboard;