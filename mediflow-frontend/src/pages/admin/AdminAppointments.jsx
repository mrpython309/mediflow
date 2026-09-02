import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Search,
} from "lucide-react";

import api from "../../services/api";

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/api/admin/appointments"
        );

        setAppointments(response.data || []);
      } catch (err) {
        console.error(
          "Failed to load appointments:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load appointments."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  const statuses = [
    "ALL",
    "PENDING",
    "APPROVED",
    "COMPLETED",
    "CANCELLED",
    "REJECTED",
  ];

  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return appointments.filter((appointment) => {
      const matchesSearch =
        !query ||
        appointment.patientName
          ?.toLowerCase()
          .includes(query) ||
        appointment.doctorName
          ?.toLowerCase()
          .includes(query) ||
        appointment.specialistName
          ?.toLowerCase()
          .includes(query);

      const matchesStatus =
        status === "ALL" ||
        appointment.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [appointments, search, status]);

  const formatDate = (date) => {
    if (!date) {
      return "-";
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
      return "-";
    }

    return new Date(
      `1970-01-01T${time}`
    ).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="admin-list-page">

      {/* Header */}

      <section className="admin-list-header">

        <div>
          <span className="eyebrow">
            APPOINTMENT MANAGEMENT
          </span>

          <h1>Appointments</h1>

          <p>
            Review appointment activity across
            the MediFlow care network.
          </p>
        </div>

        <div className="admin-list-count">
          <span>Total appointments</span>
          <strong>
            {appointments.length}
          </strong>
        </div>

      </section>

      {/* Toolbar */}

      <section className="admin-appointments-toolbar">

        <div className="admin-search-box">

          <Search size={16} />

          <input
            type="text"
            placeholder="Search patient, doctor or specialty..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>

        <div className="admin-appointment-filters">

          {statuses.map((item) => (

            <button
              type="button"
              key={item}
              className={
                status === item
                  ? "admin-appointment-filter active"
                  : "admin-appointment-filter"
              }
              onClick={() =>
                setStatus(item)
              }
            >
              {item === "ALL"
                ? "All"
                : item}
            </button>

          ))}

        </div>

      </section>

      {/* Error */}

      {error && (
        <div className="doctors-page-error">
          {error}
        </div>
      )}

      {/* Results */}

      {loading ? (

        <div className="admin-page-state">
          Loading appointments...
        </div>

      ) : filteredAppointments.length === 0 ? (

        <div className="admin-empty-state admin-page-empty">

          <CalendarDays size={22} />

          <h3>
            No appointments found
          </h3>

          <p>
            Try changing the search or status filter.
          </p>

        </div>

      ) : (

        <section className="admin-appointments-list">

          {filteredAppointments.map(
            (appointment) => (

              <article
                className="admin-appointment-card"
                key={appointment.id}
              >

                <div className="admin-appointment-card-top">

                  <div className="admin-appointment-patient">

                    <div className="admin-patient-avatar">
                      {appointment.patientName
                        ?.charAt(0)
                        ?.toUpperCase() || "P"}
                    </div>

                    <div>
                      <span>
                        PATIENT
                      </span>

                      <h2>
                        {appointment.patientName}
                      </h2>
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

                <div className="admin-appointment-grid">

                  <div>

                    <span className="admin-detail-title">
                      DOCTOR
                    </span>

                    <strong>
                      {appointment.doctorName}
                    </strong>

                  </div>

                  <div>

                    <span className="admin-detail-title">
                      SPECIALTY
                    </span>

                    <strong>
                      {appointment.specialistName}
                    </strong>

                  </div>

                  <div>

                    <span className="admin-detail-title">
                      DATE
                    </span>

                    <div className="admin-appointment-value">
                      <CalendarDays size={13} />

                      {formatDate(
                        appointment.appointmentDate
                      )}
                    </div>

                  </div>

                  <div>

                    <span className="admin-detail-title">
                      TIME
                    </span>

                    <div className="admin-appointment-value">
                      <Clock3 size={13} />

                      {formatTime(
                        appointment.appointmentTime
                      )}
                    </div>

                  </div>

                </div>

                <div className="admin-appointment-symptoms">

                  <span>
                    Symptoms
                  </span>

                  <p>
                    {appointment.symptoms ||
                      "No symptoms provided."}
                  </p>

                </div>

                <div className="admin-appointment-footer">
                  Appointment #{appointment.id}
                </div>

              </article>

            )
          )}

        </section>

      )}

    </div>
  );
}

export default AdminAppointments;