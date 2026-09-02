import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Stethoscope,
} from "lucide-react";

import api from "../../services/api";

function AdminSpecialists() {
  const [specialists, setSpecialists] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSpecialists = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/api/specialists"
        );

        setSpecialists(response.data || []);
      } catch (err) {
        console.error(
          "Failed to load specialists:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load specialists."
        );
      } finally {
        setLoading(false);
      }
    };

    loadSpecialists();
  }, []);

  const filteredSpecialists = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return specialists;
    }

    return specialists.filter((specialist) =>
      specialist.name
        ?.toLowerCase()
        .includes(query)
    );
  }, [specialists, search]);

  return (
    <div className="admin-list-page">

      <section className="admin-list-header">

        <div>
          <span className="eyebrow">
            CARE CATEGORIES
          </span>

          <h1>Specialists</h1>

          <p>
            View the medical specialties available
            across MediFlow.
          </p>
        </div>

        <div className="admin-list-count">
          <span>Total specialists</span>
          <strong>
            {specialists.length}
          </strong>
        </div>

      </section>

      <section className="admin-list-toolbar">

        <div className="admin-search-box">

          <Search size={16} />

          <input
            type="text"
            placeholder="Search specialties..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>

      </section>

      {error && (
        <div className="doctors-page-error">
          {error}
        </div>
      )}

      {loading ? (

        <div className="admin-page-state">
          Loading specialists...
        </div>

      ) : filteredSpecialists.length === 0 ? (

        <div className="admin-empty-state admin-page-empty">

          <Stethoscope size={22} />

          <h3>
            No specialists found
          </h3>

          <p>
            Try changing your search.
          </p>

        </div>

      ) : (

        <section className="admin-specialists-grid">

          {filteredSpecialists.map(
            (specialist) => (

              <article
                className="admin-specialist-card"
                key={specialist.id}
              >

                <div className="admin-specialist-icon">
                  <Stethoscope size={18} />
                </div>

                <span className="eyebrow">
                  SPECIALTY
                </span>

                <h2>
                  {specialist.name}
                </h2>

                <p>
                  Specialist department
                </p>

              </article>

            )
          )}

        </section>

      )}

    </div>
  );
}

export default AdminSpecialists;