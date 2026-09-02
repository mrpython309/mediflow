import { useEffect, useMemo, useState } from "react";
import {
  GraduationCap,
  MapPin,
  Search,
  Stethoscope,
} from "lucide-react";

import api from "../../services/api";

const doctorImages = {
  "Dr. John Smith": "/doctors/doctor-01.jpg",
  "Dr. Sarah Wilson": "/doctors/doctor-02.jpg",
  "Dr. Michael Chen": "/doctors/doctor-03.jpg",
  "Dr. Emily Carter": "/doctors/doctor-04.jpg",
  "Dr. Priya Nair": "/doctors/doctor-05.jpg",
};

function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/api/admin/doctors"
        );

        setDoctors(response.data || []);
      } catch (err) {
        console.error(
          "Failed to load doctors:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load doctors."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, []);

  const filteredDoctors = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return doctors;
    }

    return doctors.filter((doctor) => {
      return (
        doctor.fullName
          ?.toLowerCase()
          .includes(query) ||
        doctor.email
          ?.toLowerCase()
          .includes(query) ||
        doctor.specialistName
          ?.toLowerCase()
          .includes(query) ||
        doctor.qualification
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [doctors, search]);

  const getInitials = (name) => {
    return (
      name
        ?.replace(/^Dr\.\s*/i, "")
        ?.trim()
        ?.split(" ")
        ?.slice(0, 2)
        ?.map((part) =>
          part.charAt(0)
        )
        ?.join("")
        ?.toUpperCase() || "DR"
    );
  };

  return (
    <div className="admin-list-page">

      {/* Header */}

      <section className="admin-list-header">

        <div>
          <span className="eyebrow">
            CARE TEAM
          </span>

          <h1>Doctors</h1>

          <p>
            View doctors, specialties and professional
            information.
          </p>
        </div>

        <div className="admin-list-count">
          <span>Total doctors</span>
          <strong>{doctors.length}</strong>
        </div>

      </section>

      {/* Search */}

      <section className="admin-list-toolbar">

        <div className="admin-search-box">

          <Search size={16} />

          <input
            type="text"
            placeholder="Search by doctor, specialty or qualification..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>

        {search && (
          <span className="admin-search-result">
            {filteredDoctors.length} result
            {filteredDoctors.length === 1
              ? ""
              : "s"}
          </span>
        )}

      </section>

      {/* Error */}

      {error && (
        <div className="doctors-page-error">
          {error}
        </div>
      )}

      {/* Loading */}

      {loading ? (

        <div className="admin-page-state">
          Loading doctors...
        </div>

      ) : filteredDoctors.length === 0 ? (

        <div className="admin-empty-state admin-page-empty">

          <Stethoscope size={22} />

          <h3>
            No doctors found
          </h3>

          <p>
            Try changing your search.
          </p>

        </div>

      ) : (

        <section className="admin-doctors-grid">

          {filteredDoctors.map((doctor) => (

            <article
              className="admin-doctor-card"
              key={doctor.id}
            >

              <div className="admin-doctor-top">

            {doctorImages[doctor.fullName] ? (
              <img
                src={doctorImages[doctor.fullName]}
                alt={doctor.fullName}
                className="admin-doctor-image"
              />
            ) : (
               <div className="doctor-avatar">
                    {getInitials(doctor.fullName)}
               </div>
            )}

                <span
                  className={
                    doctor.active
                      ? "admin-active-status"
                      : "admin-inactive-status"
                  }
                >
                  <span />
                  {doctor.active
                    ? "Active"
                    : "Inactive"}
                </span>

              </div>

              <span className="doctor-specialty-label">
                {doctor.specialistName}
              </span>

              <h2>
                {doctor.fullName}
              </h2>

              <div className="admin-doctor-detail">

                <GraduationCap size={14} />

                <span>
                  {doctor.qualification}
                </span>

              </div>

              <div className="admin-doctor-detail">

                <MapPin size={14} />

                <span>
                  Bengaluru
                </span>

              </div>

              <div className="admin-doctor-detail">

                <span className="admin-detail-label">
                  Email
                </span>

                <span>
                  {doctor.email}
                </span>

              </div>

            </article>

          ))}

        </section>

      )}

    </div>
  );
}

export default AdminDoctors;