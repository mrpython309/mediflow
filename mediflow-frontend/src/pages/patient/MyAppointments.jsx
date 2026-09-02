import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Stethoscope,
  X,
} from "lucide-react";

import api from "../../services/api";

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(null);

  const cancelAppointment = async (appointmentId) => {
  try {
    setCancelling(appointmentId);
    setError("");

    await api.patch(
      `/api/patient/appointments/${appointmentId}/cancel`
    );

    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === appointmentId
          ? {
              ...appointment,
              status: "CANCELLED",
            }
          : appointment
      )
    );
  } catch (err) {
    console.error(
      "Failed to cancel appointment:",
      err
    );

    setError(
      err.response?.data?.message ||
        "Unable to cancel appointment."
    );
  } finally {
    setCancelling(null);
  }
};

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/api/patient/appointments"
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

  const formatDate = (date) => {
    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    return new Date(
      `1970-01-01T${time}`
    ).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    return `my-appointment-status my-status-${status.toLowerCase()}`;
  };

  return (
    <div className="my-appointments-page">

      <div className="page-header">
        <div>
          <span className="eyebrow">
            YOUR CARE
          </span>

          <h1>My appointments</h1>

          <p>
            Keep track of your upcoming and previous
            consultations.
          </p>
        </div>
      </div>

      {error && (
        <div className="doctors-page-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="appointment-empty">
          <p>Loading your appointments...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="appointment-empty">
          <div className="appointment-empty-icon">
            <CalendarDays size={20} />
          </div>

          <h3>No appointments yet</h3>

          <p>
            Book a consultation with one of our
            specialists to get started.
          </p>
        </div>
      ) : (
        <div className="my-appointments-list">

          {appointments.map((appointment) => (
            <article
              className="my-appointment-card"
              key={appointment.id}
            >

              <div className="my-appointment-top">

                <div className="my-doctor-info">

                  <div className="my-doctor-avatar">
                    {appointment.doctorName
                      ?.replace(/^Dr\.\s*/i, "")
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </div>

                  <div>
                    <span className="my-specialty">
                      {appointment.specialistName}
                    </span>

                    <h2>
                      {appointment.doctorName}
                    </h2>
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

              <div className="my-appointment-details">

                <div>
                  <CalendarDays size={15} />

                  <span>
                    {formatDate(
                      appointment.appointmentDate
                    )}
                  </span>
                </div>

                <div>
                  <Clock3 size={15} />

                  <span>
                    {formatTime(
                      appointment.appointmentTime
                    )}
                  </span>
                </div>

                <div>
                  <Stethoscope size={15} />

                  <span>
                    {appointment.symptoms ||
                      "General consultation"}
                  </span>
                </div>

              </div>

              <div className="my-appointment-footer">
                Appointment #{appointment.id}
              </div>

              {(appointment.status === "PENDING" ||
  appointment.status === "APPROVED") && (
  <div className="my-appointment-actions">

    <button
      type="button"
      className="cancel-appointment-button"
      disabled={cancelling === appointment.id}
      onClick={() =>
        cancelAppointment(appointment.id)
      }
    >
      {cancelling === appointment.id
        ? "Cancelling..."
        : "Cancel appointment"}
    </button>

  </div>
)}

            </article>
          ))}

        </div>
      )}

    </div>
  );
}

export default MyAppointments;