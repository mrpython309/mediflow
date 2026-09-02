import { useEffect, useMemo, useState } from "react";
import {
  Mail,
  Phone,
  Search,
  UserRound,
} from "lucide-react";

import api from "../../services/api";

function AdminPatients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/api/admin/patients"
        );

        setPatients(response.data || []);
      } catch (err) {
        console.error(
          "Failed to load patients:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load patients."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return patients;
    }

    return patients.filter((patient) => {
      return (
        patient.fullName
          ?.toLowerCase()
          .includes(query) ||
        patient.email
          ?.toLowerCase()
          .includes(query) ||
        patient.phone
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [patients, search]);

  const getInitials = (name) => {
    return (
      name
        ?.trim()
        ?.split(" ")
        ?.slice(0, 2)
        ?.map((part) => part.charAt(0))
        ?.join("")
        ?.toUpperCase() || "P"
    );
  };

  return (
    <div className="admin-list-page">

      {/* Header */}

      <section className="admin-list-header">

        <div>
          <span className="eyebrow">
            PATIENT DIRECTORY
          </span>

          <h1>Patients</h1>

          <p>
            View registered patients and their account
            information.
          </p>
        </div>

        <div className="admin-list-count">
          <span>Total patients</span>
          <strong>{patients.length}</strong>
        </div>

      </section>

      {/* Search */}

      <section className="admin-list-toolbar">

        <div className="admin-search-box">

          <Search size={16} />

          <input
            type="text"
            placeholder="Search patients by name, email or phone..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>

        {search && (
          <span className="admin-search-result">
            {filteredPatients.length} result
            {filteredPatients.length === 1
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

      {/* Content */}

      {loading ? (

        <div className="admin-page-state">
          Loading patients...
        </div>

      ) : filteredPatients.length === 0 ? (

        <div className="admin-empty-state admin-page-empty">

          <UserRound size={22} />

          <h3>
            No patients found
          </h3>

          <p>
            Try changing your search.
          </p>

        </div>

      ) : (

        <section className="admin-patients-table">

          <div className="admin-patients-table-head">

            <span>Patient</span>
            <span>Contact</span>
            <span>Status</span>

          </div>

          {filteredPatients.map((patient) => (

            <div
              className="admin-patient-row"
              key={patient.id}
            >

              {/* Patient */}

              <div className="admin-patient-main">

                <div className="admin-patient-avatar">
                  {getInitials(
                    patient.fullName
                  )}
                </div>

                <div>
                  <strong>
                    {patient.fullName}
                  </strong>

                  <span>
                    Patient #{patient.id}
                  </span>
                </div>

              </div>

              {/* Contact */}

              <div className="admin-patient-contact">

                <div>
                  <Mail size={13} />
                  <span>
                    {patient.email}
                  </span>
                </div>

                <div>
                  <Phone size={13} />
                  <span>
                    {patient.phone || "Not provided"}
                  </span>
                </div>

              </div>

              {/* Status */}

              <div>

                <span
                  className={
                    patient.active
                      ? "admin-active-status"
                      : "admin-inactive-status"
                  }
                >
                  <span />
                  {patient.active
                    ? "Active"
                    : "Inactive"}
                </span>

              </div>

            </div>

          ))}

        </section>

      )}

    </div>
  );
}

export default AdminPatients;