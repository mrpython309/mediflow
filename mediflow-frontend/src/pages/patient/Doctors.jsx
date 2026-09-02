import { useEffect, useMemo, useState } from "react";

import {
  ArrowRight,
  GraduationCap,
  MapPin,
  Search,
  Stethoscope,
} from "lucide-react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import api from "../../services/api";

const specialistAliases = {
  "general practitioner": "General Medicine",
  "general practitioner (gp)": "General Medicine",
  "primary care physician": "General Medicine",
  "family medicine": "General Medicine",

  cardiologist: "Cardiology",
  cardiology: "Cardiology",

  "emergency medicine physician": "Emergency Medicine",
  "emergency medicine": "Emergency Medicine",

  dermatologist: "Dermatology",
  dermatology: "Dermatology",

  neurologist: "Neurology",
  neurology: "Neurology",

  orthopedic: "Orthopedics",
  orthopaedic: "Orthopedics",
  orthopedics: "Orthopedics",

  pediatrician: "Pediatrics",
  pediatrics: "Pediatrics",

  psychiatrist: "Psychiatry",
  psychiatry: "Psychiatry",

  gynecologist: "Gynecology",
  gynecology: "Gynecology",
};

const doctorImages = {
  "Dr. John Smith": "/doctors/doctor-01.jpg",
  "Dr. Sarah Wilson": "/doctors/doctor-02.jpg",
  "Dr. Michael Chen": "/doctors/doctor-03.jpg",
  "Dr. Emily Carter": "/doctors/doctor-04.jpg",
  "Dr. Priya Nair": "/doctors/doctor-05.jpg",
};

function Doctors() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const rawAiSpecialty =
    searchParams.get("specialty") || "";

  const normalizedAiSpecialty =
    Object.entries(specialistAliases).find(
      ([alias]) =>
        rawAiSpecialty
          .toLowerCase()
          .includes(alias)
    )?.[1] || rawAiSpecialty;

  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");

  const [specialty, setSpecialty] = useState(
    normalizedAiSpecialty || "ALL"
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (normalizedAiSpecialty) {
      setSpecialty(normalizedAiSpecialty);
    }
  }, [normalizedAiSpecialty]);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/api/doctors"
        );

        setDoctors(response.data || []);
      } catch (err) {
        console.error(
          "Failed to load doctors:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load doctors right now."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, []);

  const specialties = useMemo(() => {
    const uniqueSpecialties = [
      ...new Set(
        doctors
          .map(
            (doctor) =>
              doctor.specialistName
          )
          .filter(Boolean)
      ),
    ];

    return ["ALL", ...uniqueSpecialties];
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return doctors.filter((doctor) => {
      const doctorName =
        doctor.fullName?.toLowerCase() || "";

      const doctorSpecialty =
        doctor.specialistName?.toLowerCase() || "";

      const qualification =
        doctor.qualification?.toLowerCase() || "";

      const selectedSpecialty =
        specialty?.toLowerCase() || "";

      const matchesSearch =
        !query ||
        doctorName.includes(query) ||
        doctorSpecialty.includes(query) ||
        qualification.includes(query);

      const matchesSpecialty =
        selectedSpecialty === "all" ||
        doctorSpecialty.includes(
          selectedSpecialty
        ) ||
        selectedSpecialty.includes(
          doctorSpecialty
        );

      return (
        matchesSearch &&
        matchesSpecialty
      );
    });
  }, [doctors, search, specialty]);

  const clearAiFilter = () => {
    setSpecialty("ALL");
    navigate("/patient/doctors");
  };

  return (
    <div className="doctors-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section className="doctors-hero">

        <div className="doctors-hero-content">

          <span className="eyebrow">
            FIND YOUR CARE TEAM
          </span>

          <h1>
            Find the right doctor
            <br />
            for your needs.
          </h1>

          <p>
            Explore specialists, review their expertise,
            and choose the right doctor for your next visit.
          </p>

        </div>

        <div className="doctors-hero-mark">
          <Stethoscope
            size={42}
            strokeWidth={1.35}
          />
        </div>

      </section>

      {/* =====================================================
          SEARCH + FILTERS
      ===================================================== */}

      <section className="doctor-discovery-bar">

        <div className="doctor-search-box">

          <Search size={17} />

          <input
            type="text"
            value={search}
            placeholder="Search by doctor, specialty or qualification..."
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>

        <div className="specialty-filters">

          {specialties.map((item) => (

            <button
              key={item}
              type="button"
              className={
                specialty === item
                  ? "specialty-filter active"
                  : "specialty-filter"
              }
              onClick={() =>
                setSpecialty(item)
              }
            >
              {item === "ALL"
                ? "All specialists"
                : item}
            </button>

          ))}

        </div>

      </section>

      {/* =====================================================
          AI FILTER NOTICE
      ===================================================== */}

      {rawAiSpecialty && (

        <div className="ai-specialty-filter-banner">

          <div>

            <span>
              MEDIFLOW AI
            </span>

            <p>
              Showing doctors based on your
              AI-assisted specialist recommendation:
              <strong>
                {" "}
                {normalizedAiSpecialty}
              </strong>
            </p>

          </div>

          <button
            type="button"
            onClick={clearAiFilter}
          >
            Show all doctors
          </button>

        </div>

      )}

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="doctors-page-error">
          {error}
        </div>
      )}

      {/* =====================================================
          RESULTS
      ===================================================== */}

      <section className="doctors-results">

        <div className="doctors-results-header">

          <div>

            <span className="eyebrow">
              {filteredDoctors.length}{" "}
              {filteredDoctors.length === 1
                ? "DOCTOR"
                : "DOCTORS"}
            </span>

            <h2>
              Available specialists
            </h2>

            {rawAiSpecialty && (
              <p className="ai-specialty-note">
                Based on your MediFlow AI guidance
              </p>
            )}

          </div>

          {search && (
            <span className="results-query">
              Results for "{search}"
            </span>
          )}

        </div>

        {/* ===================================================
            LOADING
        =================================================== */}

        {loading ? (

          <div className="doctors-loading">

            <div className="loading-pulse" />

            <p>
              Finding available doctors...
            </p>

          </div>

        ) : filteredDoctors.length === 0 ? (

          <div className="doctors-empty">

            <div className="doctors-empty-icon">
              <Search size={19} />
            </div>

            <h3>
              No matching doctors
            </h3>

            <p>
              Try another name or choose a different
              specialty.
            </p>

            {rawAiSpecialty && (
              <button
                type="button"
                className="empty-reset-button"
                onClick={clearAiFilter}
              >
                View all doctors
              </button>
            )}

          </div>

        ) : (

          <div className="premium-doctor-grid">

            {filteredDoctors.map((doctor) => {

              const initials =
                doctor.fullName
                  ?.replace(
                    /^Dr\.\s*/i,
                    ""
                  )
                  ?.split(" ")
                  ?.filter(Boolean)
                  ?.slice(0, 2)
                  ?.map(
                    (name) =>
                      name.charAt(0)
                  )
                  ?.join("")
                  ?.toUpperCase();

              const doctorImage =
                doctorImages[
                  doctor.fullName
                ];

              return (

                <article
                  className="premium-doctor-card"
                  key={doctor.id}
                >

                  {/* =================================================
                      DOCTOR IMAGE
                  ================================================= */}

                  <div className="premium-doctor-image">

                    {doctorImage ? (

                      <img
                        src={doctorImage}
                        alt={doctor.fullName}
                        className="doctor-photo"
                      />

                    ) : (

                      <div className="doctor-photo-placeholder">
                        {initials || "DR"}
                      </div>

                    )}

                    <span
                      className={
                        doctor.active
                          ? "doctor-availability active"
                          : "doctor-availability inactive"
                      }
                    >
                      <span />

                      {doctor.active
                        ? "Available"
                        : "Unavailable"}
                    </span>

                  </div>

                  {/* =================================================
                      DOCTOR INFORMATION
                  ================================================= */}

                  <div className="premium-doctor-content">

                    <span className="doctor-specialty-label">
                      {doctor.specialistName}
                    </span>

                    <h3>
                      {doctor.fullName}
                    </h3>

                    <div className="doctor-detail-line">

                      <GraduationCap size={14} />

                      <span>
                        {doctor.qualification}
                      </span>

                    </div>

                    <div className="doctor-detail-line">

                      <MapPin size={14} />

                      <span>
                        Bengaluru
                      </span>

                    </div>

                    <button
                      type="button"
                      className="doctor-book-button"
                      disabled={!doctor.active}
                      onClick={() =>
                        navigate(
                          `/patient/doctors/${doctor.id}/book`
                        )
                      }
                    >

                      <span>
                        {doctor.active
                          ? "Book appointment"
                          : "Currently unavailable"}
                      </span>

                      {doctor.active && (
                        <ArrowRight size={15} />
                      )}

                    </button>

                  </div>

                </article>

              );
            })}

          </div>

        )}

      </section>

    </div>
  );
}

export default Doctors;