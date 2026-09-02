import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const doctorImages = {
  "Dr. John Smith": "/doctors/doctor-01.jpg",
  "Dr. Sarah Wilson": "/doctors/doctor-02.jpg",
  "Dr. Michael Chen": "/doctors/doctor-03.jpg",
  "Dr. Emily Carter": "/doctors/doctor-04.jpg",
  "Dr. Priya Nair": "/doctors/doctor-05.jpg",
};

function PatientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [
          appointmentsResponse,
          doctorsResponse,
        ] = await Promise.all([
          api.get("/api/patient/appointments"),
          api.get("/api/doctors"),
        ]);

        setAppointments(
          appointmentsResponse.data || []
        );

        setDoctors(
          doctorsResponse.data || []
        );
      } catch (error) {
        console.error(
          "Dashboard loading failed:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const upcomingAppointments = useMemo(() => {
    return appointments
      .filter(
        (appointment) =>
          appointment.status === "PENDING" ||
          appointment.status === "APPROVED"
      )
      .sort(
        (a, b) =>
          new Date(
            `${a.appointmentDate}T${a.appointmentTime}`
          ) -
          new Date(
            `${b.appointmentDate}T${b.appointmentTime}`
          )
      );
  }, [appointments]);

  const completedAppointments = useMemo(() => {
    return appointments.filter(
      (appointment) =>
        appointment.status === "COMPLETED"
    );
  }, [appointments]);

  const pendingAppointments = useMemo(() => {
    return appointments.filter(
      (appointment) =>
        appointment.status === "PENDING"
    );
  }, [appointments]);

  const upcomingAppointment =
    upcomingAppointments[0];

  const getDoctorImage = (doctorName) => {
    return doctorImages[doctorName];
  };

  const getInitials = (fullName) => {
    return (
      fullName
        ?.replace(/^Dr\.\s*/i, "")
        ?.split(" ")
        ?.filter(Boolean)
        ?.slice(0, 2)
        ?.map((name) =>
          name.charAt(0).toUpperCase()
        )
        ?.join("") || "DR"
    );
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="patient-dashboard">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="dashboard-header">

        <div>

          <p className="eyebrow">
            PATIENT PORTAL
          </p>

          <h1>
            Good morning,{" "}
            <span>
              {user?.fullName}
            </span>
          </h1>

          <p className="header-subtitle">
            Here's a quick overview of your
            appointments and care.
          </p>

        </div>

        <div className="profile-chip">

          <div className="avatar">
            {user?.fullName
              ?.charAt(0)
              ?.toUpperCase()}
          </div>

          <div>
            <strong>
              {user?.fullName}
            </strong>

            <span>
              Patient
            </span>
          </div>

        </div>

      </section>

      {/* =====================================================
          STATS
      ===================================================== */}

      <section className="stats-grid">

        <div className="stat-card">

          <div className="stat-icon">
            A
          </div>

          <div>
            <span>
              Appointments
            </span>

            <strong>
              {appointments.length}
            </strong>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon">
            P
          </div>

          <div>
            <span>
              Pending
            </span>

            <strong>
              {pendingAppointments.length}
            </strong>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon">
            C
          </div>

          <div>
            <span>
              Completed
            </span>

            <strong>
              {completedAppointments.length}
            </strong>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon">
            D
          </div>

          <div>
            <span>
              Doctors
            </span>

            <strong>
              {doctors.length}
            </strong>
          </div>

        </div>

      </section>

      {/* =====================================================
          MAIN GRID
      ===================================================== */}

      <section className="dashboard-grid">

        {/* ===================================================
            UPCOMING APPOINTMENT
        =================================================== */}

        <div className="panel upcoming-panel">

          <div className="panel-header">

            <div>

              <p className="eyebrow">
                NEXT VISIT
              </p>

              <h2>
                Upcoming appointment
              </h2>

            </div>

            <span className="status-dot">
              {upcomingAppointment?.status ||
                "NONE"}
            </span>

          </div>

          {upcomingAppointment ? (

            <div className="upcoming-content">

              <div className="doctor-summary">

                {getDoctorImage(
                  upcomingAppointment.doctorName
                ) ? (

                  <img
                    src={getDoctorImage(
                      upcomingAppointment.doctorName
                    )}
                    alt={
                      upcomingAppointment.doctorName
                    }
                    className="dashboard-doctor-avatar"
                  />

                ) : (

                  <div className="doctor-avatar">
                    {getInitials(
                      upcomingAppointment.doctorName
                    )}
                  </div>

                )}

                <div>

                  <h3>
                    {
                      upcomingAppointment.doctorName
                    }
                  </h3>

                  <p>
                    {
                      upcomingAppointment.specialistName
                    }
                  </p>

                </div>

              </div>

              <div className="appointment-meta">

                <div>

                  <span>
                    Date
                  </span>

                  <strong>
                    {
                      upcomingAppointment.appointmentDate
                    }
                  </strong>

                </div>

                <div>

                  <span>
                    Time
                  </span>

                  <strong>
                    {
                      upcomingAppointment.appointmentTime
                    }
                  </strong>

                </div>

              </div>

              <div className="appointment-note">
                {upcomingAppointment.symptoms ||
                  "No symptoms provided."}
              </div>

            </div>

          ) : (

            <div className="empty-state">

              <h3>
                No upcoming appointments
              </h3>

              <p>
                Book a consultation with one of our
                specialists.
              </p>

            </div>

          )}

        </div>

        {/* ===================================================
            QUICK ACTIONS
        =================================================== */}

        <div className="panel">

          <div className="panel-header">

            <div>

              <p className="eyebrow">
                SHORTCUTS
              </p>

              <h2>
                Quick actions
              </h2>

            </div>

          </div>

          <div className="quick-actions">

            <button
              type="button"
              className="action-card"
              onClick={() =>
                navigate("/patient/doctors")
              }
            >

              <span>
                +
              </span>

              <div>

                <strong>
                  Book appointment
                </strong>

                <small>
                  Find a doctor
                </small>

              </div>

            </button>

            <button
              type="button"
              className="action-card"
              onClick={() =>
                navigate(
                  "/patient/appointments"
                )
              }
            >

              <span>
                ≡
              </span>

              <div>

                <strong>
                  My appointments
                </strong>

                <small>
                  View your history
                </small>

              </div>

            </button>

            <button
              type="button"
              className="action-card"
              onClick={() =>
                navigate(
                  "/patient/ai-assistant"
                )
              }
            >

              <span>
                AI
              </span>

              <div>

                <strong>
                  MediFlow Assistant
                </strong>

                <small>
                  Get health guidance
                </small>

              </div>

            </button>

          </div>

        </div>

      </section>

      {/* =====================================================
          AVAILABLE DOCTORS
      ===================================================== */}

      <section className="panel doctors-panel">

        <div className="panel-header">

          <div>

            <p className="eyebrow">
              CARE TEAM
            </p>

            <h2>
              Available doctors
            </h2>

          </div>

          <button
            type="button"
            className="text-button"
            onClick={() =>
              navigate("/patient/doctors")
            }
          >
            View all
          </button>

        </div>

        <div className="doctor-grid">

          {doctors
            .filter((doctor) => doctor.active)
            .slice(0, 4)
            .map((doctor) => {

              const doctorImage =
                getDoctorImage(
                  doctor.fullName
                );

              return (

                <div
                  className="doctor-card"
                  key={doctor.id}
                >

                  <div className="doctor-card-top">

                    {doctorImage ? (

                      <img
                        src={doctorImage}
                        alt={doctor.fullName}
                        className="dashboard-care-doctor-image"
                      />

                    ) : (

                      <div className="doctor-avatar large">
                        {getInitials(
                          doctor.fullName
                        )}
                      </div>

                    )}

                    <span
                      className={
                        doctor.active
                          ? "availability available"
                          : "availability unavailable"
                      }
                    >
                      {doctor.active
                        ? "Available"
                        : "Unavailable"}
                    </span>

                  </div>

                  <h3>
                    {doctor.fullName}
                  </h3>

                  <p>
                    {doctor.specialistName}
                  </p>

                  <span className="qualification">
                    {doctor.qualification}
                  </span>

                </div>

              );
            })}

        </div>

      </section>

      {/* =====================================================
          MEDIFLOW AI
      ===================================================== */}

      <section className="ai-banner">

        <div className="ai-content">

          <span className="ai-label">
            MEDIFLOW AI
          </span>

          <h2>
            Not sure which specialist to see?
          </h2>

          <p>
            Describe your symptoms and MediFlow
            Assistant can help guide you to the
            right department.
          </p>

        </div>

        <button
          type="button"
          className="ai-button"
          onClick={() =>
            navigate("/patient/ai-assistant")
          }
        >
          Ask MediFlow AI
        </button>

      </section>

    </div>
  );
}

export default PatientDashboard;