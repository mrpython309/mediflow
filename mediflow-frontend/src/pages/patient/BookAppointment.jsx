import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  MapPin,
} from "lucide-react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../../services/api";

function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState(false);

  const [formData, setFormData] = useState({
    appointmentDate: "",
    appointmentTime: "",
    gender: "",
    age: "",
    symptoms: "",
    address: "",
  });

  // ---------------------------------------------
  // Handle form input changes
  // ---------------------------------------------
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ---------------------------------------------
  // Submit appointment
  // ---------------------------------------------
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");
      setBooking(true);

      const requestData = {
        doctorId: Number(doctorId),
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        gender: formData.gender,
        age: Number(formData.age),
        symptoms: formData.symptoms,
        address: formData.address,
      };

      await api.post(
        "/api/patient/appointments",
        requestData
      );

      navigate("/patient/appointments");
    } catch (err) {
      console.error(
        "Appointment booking failed:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to book appointment."
      );
    } finally {
      setBooking(false);
    }
  };

  // ---------------------------------------------
  // Load selected doctor
  // ---------------------------------------------
  useEffect(() => {
    const loadDoctor = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/api/doctors"
        );

        const selectedDoctor =
          response.data.find(
            (item) =>
              item.id === Number(doctorId)
          );

        if (!selectedDoctor) {
          setError("Doctor not found.");
          return;
        }

        setDoctor(selectedDoctor);
      } catch (err) {
        console.error(
          "Failed to load doctor:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load doctor information."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDoctor();
  }, [doctorId]);

  // ---------------------------------------------
  // Loading state
  // ---------------------------------------------
  if (loading) {
    return (
      <div className="booking-page-state">
        Loading doctor information...
      </div>
    );
  }

  // ---------------------------------------------
  // Error state
  // ---------------------------------------------
  if (error && !doctor) {
    return (
      <div className="booking-page-state">
        <p>{error}</p>

        <button
          className="back-button"
          onClick={() =>
            navigate("/patient/doctors")
          }
        >
          Back to doctors
        </button>
      </div>
    );
  }

  return (
    <div className="booking-page">

      {/* =========================================
          PAGE HEADER
      ========================================= */}

      <div className="booking-header">

        <button
          type="button"
          className="booking-back-link"
          onClick={() =>
            navigate("/patient/doctors")
          }
        >
          <ArrowLeft size={15} />
          Back to doctors
        </button>

        <span className="eyebrow">
          APPOINTMENT
        </span>

        <h1>Book an appointment</h1>

        <p>
          Choose a suitable time and provide a few
          details for your visit.
        </p>

      </div>

      {/* =========================================
          BOOKING LAYOUT
      ========================================= */}

      <div className="booking-layout">

        {/* =======================================
            DOCTOR CARD
        ======================================= */}

        <aside className="booking-doctor-card">

          <div className="booking-doctor-photo">

            {(() => {
              const doctorImages = {
                "Dr. John Smith": "/doctors/doctor-01.jpg",
                "Dr. Sarah Wilson": "/doctors/doctor-02.jpg",
                "Dr. Michael Chen": "/doctors/doctor-03.jpg",
                "Dr. Emily Carter": "/doctors/doctor-04.jpg",
                "Dr. Priya Nair": "/doctors/doctor-05.jpg",
              };

              const doctorImage =
                doctorImages[doctor?.fullName];

              if (doctorImage) {
                return (
                  <img
                    src={doctorImage}
                    alt={doctor?.fullName}
                    className="booking-doctor-image"
                  />
                );
              }

              return (
                <div className="booking-doctor-avatar">
                  {doctor?.fullName
                    ?.replace(/^Dr\.\s*/i, "")
                    ?.charAt(0)
                    ?.toUpperCase()}
                </div>
              );
            })()}

          </div>

          <div className="booking-doctor-info">

            <span className="doctor-specialty-label">
              {doctor.specialistName}
            </span>

            <h2>{doctor.fullName}</h2>

            <div className="booking-doctor-detail">
              <GraduationCap size={14} />

              <span>
                {doctor.qualification}
              </span>
            </div>

            <div className="booking-doctor-detail">
              <MapPin size={14} />

              <span>
                Bengaluru
              </span>
            </div>

            <div className="booking-doctor-available">
              <span />
              {doctor.active
                ? "Available for appointments"
                : "Currently unavailable"}
            </div>

          </div>

        </aside>

        {/* =======================================
            FORM
        ======================================= */}

        <form
          className="booking-form-card"
          onSubmit={handleSubmit}
        >

          <div className="booking-section-title">

            <div className="booking-section-icon">
              <CalendarDays size={17} />
            </div>

            <div>
              <h2>Appointment details</h2>

              <p>
                Select the date and time for your
                consultation.
              </p>
            </div>

          </div>

          {/* Date + Time */}

          <div className="booking-fields">

            <div className="booking-field">

              <label htmlFor="appointmentDate">
                Appointment date
              </label>

              <input
                id="appointmentDate"
                name="appointmentDate"
                type="date"
                value={
                  formData.appointmentDate
                }
                onChange={handleChange}
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                required
              />

            </div>

            <div className="booking-field">

              <label htmlFor="appointmentTime">
                Appointment time
              </label>

              <input
                id="appointmentTime"
                name="appointmentTime"
                type="time"
                value={
                  formData.appointmentTime
                }
                onChange={handleChange}
                required
              />

            </div>

          </div>

          {/* Patient details */}

          <div className="booking-subsection">

            <div className="booking-subsection-title">
              <span>ABOUT YOU</span>

              <p>
                A few details help the doctor prepare
                for your visit.
              </p>
            </div>

            <div className="booking-fields">

              <div className="booking-field">

                <label htmlFor="gender">
                  Gender
                </label>

                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>

              </div>

              <div className="booking-field">

                <label htmlFor="age">
                  Age
                </label>

                <input
                  id="age"
                  name="age"
                  type="number"
                  min="1"
                  max="120"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

          </div>

          {/* Symptoms */}

          <div className="booking-field booking-full-width">

            <label htmlFor="symptoms">
              Symptoms
            </label>

            <textarea
              id="symptoms"
              name="symptoms"
              rows="4"
              placeholder="Briefly describe what you're experiencing..."
              value={formData.symptoms}
              onChange={handleChange}
              required
            />

            <span className="booking-field-help">
              Keep it brief and describe the main
              reason for your visit.
            </span>

          </div>

          {/* Address */}

          <div className="booking-field booking-full-width">

            <label htmlFor="address">
              Address
            </label>

            <textarea
              id="address"
              name="address"
              rows="3"
              placeholder="Enter your current address..."
              value={formData.address}
              onChange={handleChange}
              required
            />

          </div>

          {/* Error */}

          {error && (
            <div className="booking-form-error">
              {error}
            </div>
          )}

          {/* Submit */}

          <div className="booking-submit-area">

            <div className="booking-submit-note">

              <CheckCircle2 size={16} />

              <span>
                Your request will be sent to the
                doctor for confirmation.
              </span>

            </div>

            <button
              type="submit"
              className="booking-submit-button"
              disabled={
                booking || !doctor?.active
              }
            >
              {booking ? (
                <>
                  <span className="booking-button-spinner" />
                  Booking...
                </>
              ) : (
                <>
                  Confirm appointment
                  <ArrowRightIcon />
                </>
              )}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

function ArrowRightIcon() {
  return <span className="booking-arrow">→</span>;
}

export default BookAppointment;