import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  CircleAlert,
  Clock3,
  Search,
  UserRound,
  X,
} from "lucide-react";

import api from "../../services/api";

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/api/doctor/appointments"
      );

      setAppointments(response.data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appointmentId, status) => {
    try {
      setActionLoading(`${appointmentId}-${status}`);
      setError("");

      const response = await api.patch(
        `/api/doctor/appointments/${appointmentId}/status`,
        {
          status,
        }
      );

      setAppointments((current) =>
        current.map((appointment) =>
          appointment.id === appointmentId
            ? response.data
            : appointment
        )
      );
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to update appointment."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...appointments]
      .filter((appointment) => {
        if (filter === "ALL") {
          return true;
        }

        return appointment.status === filter;
      })
      .filter((appointment) => {
        if (!query) {
          return true;
        }

        return (
          appointment.patientName
            ?.toLowerCase()
            .includes(query) ||
          appointment.symptoms
            ?.toLowerCase()
            .includes(query)
        );
      })
      .sort(
        (a, b) =>
          new Date(
            `${a.appointmentDate}T${a.appointmentTime}`
          ) -
          new Date(
            `${b.appointmentDate}T${b.appointmentTime}`
          )
      );
  }, [appointments, filter, search]);

  const pendingCount = appointments.filter(
    (appointment) => appointment.status === "PENDING"
  ).length;

  const approvedCount = appointments.filter(
    (appointment) => appointment.status === "APPROVED"
  ).length;

  const completedCount = appointments.filter(
    (appointment) => appointment.status === "COMPLETED"
  ).length;

  const cancelledCount = appointments.filter(
    (appointment) => appointment.status === "CANCELLED"
  ).length;

  const getStatusClass = (status) => {
    return `appointment-status appointment-status-${status.toLowerCase()}`;
  };

  return (
    <div className="doctor-appointments-page">

      <section className="appointments-page-header">
        <div>
          <p className="eyebrow">PATIENT CARE</p>

          <h1>Appointments</h1>

          <p className="appointments-page-description">
            Review patient requests and keep consultations
            moving through the right stage.
          </p>
        </div>

        <div className="appointments-overview">
          <div>
            <strong>{pendingCount}</strong>
            <span>Needs review</span>
          </div>

          <div>
            <strong>{approvedCount}</strong>
            <span>Approved</span>
          </div>

          <div>
            <strong>{completedCount}</strong>
            <span>Completed</span>
          </div>
        </div>
      </section>

      {error && (
        <div className="appointment-error">
          <CircleAlert size={15} />
          <span>{error}</span>
        </div>
      )}

      <section className="appointment-toolbar">

        <div className="appointment-search">
          <Search size={16} />

          <input
            type="text"
            placeholder="Search patient or symptoms..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <div className="appointment-filters">

          {[
            "ALL",
            "PENDING",
            "APPROVED",
            "COMPLETED",
            "CANCELLED",
          ].map((status) => (
            <button
              key={status}
              className={
                filter === status
                  ? "appointment-filter active"
                  : "appointment-filter"
              }
              onClick={() => setFilter(status)}
            >
              {status === "ALL"
                ? "All"
                : status.charAt(0) +
                  status.slice(1).toLowerCase()}
            </button>
          ))}

        </div>
      </section>

      <section className="appointments-list">

        {loading ? (
          <div className="appointment-empty">
            <p>Loading appointments...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="appointment-empty">
            <div className="appointment-empty-icon">
              <CalendarDays size={20} />
            </div>

            <h3>No appointments found</h3>

            <p>
              Try another filter or search term.
            </p>
          </div>
        ) : (
          filteredAppointments.map((appointment) => (

            <article
              className="doctor-appointment-card"
              key={appointment.id}
            >

              <div className="appointment-card-main">

                <div className="patient-profile">

                  <div className="patient-large-avatar">
                    {appointment.patientName
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </div>

                  <div>
                    <h2>
                      {appointment.patientName}
                    </h2>

                    <span>
                      Appointment #{appointment.id}
                    </span>
                  </div>

                </div>

                <span
                  className={getStatusClass(
                    appointment.status
                  )}
                >
                  {appointment.status}
                </span>

              </div>

              <div className="appointment-card-details">

                <div className="appointment-detail">
                  <CalendarDays size={15} />

                  <div>
                    <span>Date</span>
                    <strong>
                     {formatDate(appointment.appointmentDate)}
                    </strong>
                  </div>
                </div>

                <div className="appointment-detail">
                  <Clock3 size={15} />

                  <div>
                    <span>Time</span>
                    <strong>
                     {formatTime(appointment.appointmentTime)}
                    </strong>
                  </div>
                </div>

                <div className="appointment-detail">
                  <UserRound size={15} />

                  <div>
                    <span>Age</span>
                    <strong>
                      {appointment.age}
                    </strong>
                  </div>
                </div>

                <div className="appointment-detail">
                  <CircleAlert size={15} />

                  <div>
                    <span>Symptoms</span>
                    <strong>
                      {appointment.symptoms ||
                        "Not provided"}
                    </strong>
                  </div>
                </div>

              </div>

              <div className="appointment-card-footer">

                <div className="appointment-location">
                  {appointment.address}
                </div>

                <div className="appointment-actions">

                  {appointment.status ===
                    "PENDING" && (
                    <>
                      <button
                        className="secondary-danger-button"
                        disabled={
                          actionLoading ===
                          `${appointment.id}-REJECTED`
                        }
                        onClick={() =>
                          updateStatus(
                            appointment.id,
                            "REJECTED"
                          )
                        }
                      >
                        <X size={14} />
                        Reject
                      </button>

                      <button
                        className="primary-action-button"
                        disabled={
                          actionLoading ===
                          `${appointment.id}-APPROVED`
                        }
                        onClick={() =>
                          updateStatus(
                            appointment.id,
                            "APPROVED"
                          )
                        }
                      >
                        <Check size={14} />
                        Approve
                      </button>
                    </>
                  )}

                  {appointment.status ===
                    "APPROVED" && (
                    <button
                      className="primary-action-button"
                      disabled={
                        actionLoading ===
                        `${appointment.id}-COMPLETED`
                      }
                      onClick={() =>
                        updateStatus(
                          appointment.id,
                          "COMPLETED"
                        )
                      }
                    >
                      <Check size={14} />
                      Mark completed
                    </button>
                  )}

                </div>

              </div>

            </article>

          ))
        )}

      </section>

      <div className="appointment-list-footer">
        Showing {filteredAppointments.length} of{" "}
        {appointments.length} appointments
        {cancelledCount > 0 &&
          ` · ${cancelledCount} cancelled`}
      </div>

    </div>
  );
}

const formatDate = (date) => {
  return new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

const formatTime = (time) => {
  return new Date(`1970-01-01T${time}`).toLocaleTimeString(
    "en-IN",
    {
      hour: "numeric",
      minute: "2-digit",
    }
  );
};

export default DoctorAppointments;