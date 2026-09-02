import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Topbar() {
  const { user } = useAuth();
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (!showHelp) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowHelp(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showHelp]);

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      setShowHelp(false);
    }
  };

  const roleLabel =
    user?.role === "PATIENT"
      ? "Patient"
      : user?.role === "DOCTOR"
        ? "Doctor"
        : "Administrator";

  return (
    <>
      <header className="mf-topbar">
        <div>
          <span className="mf-topbar-context">
            {user?.role === "PATIENT"
              ? "Patient portal"
              : user?.role === "DOCTOR"
                ? "Doctor workspace"
                : "Administration"}
          </span>

          <h2>MediFlow</h2>
        </div>

        <div className="mf-topbar-right">
          <button
            type="button"
            className="mf-icon-button"
            aria-label="Open MediFlow Help & Support"
            title="Help & Support"
            onClick={() => setShowHelp(true)}
          >
            ?
          </button>

          <div className="mf-topbar-profile">
            <div className="mf-user-avatar small">
              {user?.fullName?.charAt(0)?.toUpperCase()}
            </div>

            <div>
              <strong>{user?.fullName}</strong>
              <span>{user?.email}</span>
            </div>
          </div>
        </div>
      </header>

      {showHelp && (
        <div
          className="mf-help-overlay"
          onClick={handleOverlayClick}
          role="presentation"
        >
          <section
            className="mf-help-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mf-help-title"
          >
            <div className="mf-help-header">
              <div>
                <span className="mf-help-eyebrow">
                  MEDIFLOW SUPPORT
                </span>

                <h2 id="mf-help-title">
                  Help & Support
                </h2>

                <p>
                  Quick guidance for using your MediFlow{" "}
                  {roleLabel.toLowerCase()} portal.
                </p>
              </div>

              <button
                type="button"
                className="mf-help-close"
                aria-label="Close Help & Support"
                onClick={() => setShowHelp(false)}
              >
                ×
              </button>
            </div>

            <div className="mf-help-grid">
              <div className="mf-help-item">
                <span className="mf-help-icon">01</span>

                <div>
                  <h3>Appointments</h3>
                  <p>
                    Patients can find doctors, choose a time,
                    and track appointment status. Doctors can
                    review requests and update their status.
                  </p>
                </div>
              </div>

              <div className="mf-help-item">
                <span className="mf-help-icon">02</span>

                <div>
                  <h3>MediFlow AI</h3>
                  <p>
                    Patients can describe symptoms to receive
                    general guidance and a suggested medical
                    specialty. AI guidance does not replace a
                    professional medical evaluation.
                  </p>
                </div>
              </div>

              <div className="mf-help-item">
                <span className="mf-help-icon">03</span>

                <div>
                  <h3>Account security</h3>
                  <p>
                    Your session is protected by authentication
                    and role-based access. Sign out when you
                    finish using the application.
                  </p>
                </div>
              </div>

              <div className="mf-help-item">
                <span className="mf-help-icon">04</span>

                <div>
                  <h3>Need assistance?</h3>
                  <p>
                    For medical concerns, always consult a
                    qualified healthcare professional. MediFlow
                    provides software and general information,
                    not medical diagnosis.
                  </p>
                </div>
              </div>
            </div>

            <div className="mf-help-footer">
              <span>
                MediFlow • Care management platform
              </span>

              <button
                type="button"
                className="mf-help-done"
                onClick={() => setShowHelp(false)}
              >
                Got it
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default Topbar;