import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        "/api/auth/login",
        formData
      );

      login(response.data);

      const role = response.data.role;

      if (role === "PATIENT") {
        navigate("/patient/dashboard");
      } else if (role === "DOCTOR") {
        navigate("/doctor/dashboard");
      } else if (role === "ADMIN") {
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);

      if (error.response) {
        setError(
          error.response.data?.message ||
            "Unable to sign in with these credentials."
        );
      } else {
        setError(
          "Unable to connect to MediFlow. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-shell">

        {/* Left side */}
        <section className="login-intro">
          <div className="login-brand">
            <div className="login-brand-mark">M</div>

            <div>
              <strong>MediFlow</strong>
              <span>Care management platform</span>
            </div>
          </div>

          <div className="login-message">
            <span className="login-kicker">
              HEALTHCARE, SIMPLIFIED
            </span>

            <h1>
              Better care starts
              <br />
              with a better flow.
            </h1>

            <p>
              Manage appointments, connect with doctors,
              and keep your healthcare journey organized
              in one place.
            </p>
          </div>

          <div className="login-footer-note">
            <span className="login-status-dot" />
            Secure healthcare workspace
          </div>
        </section>

        {/* Right side */}
        <section className="login-panel">

          <div className="login-form-container">

            <div className="login-heading">
              <span>WELCOME BACK</span>

              <h2>Sign in to MediFlow</h2>

              <p>
                Access your personalized healthcare workspace.
              </p>
            </div>

            <form
              className="login-form"
              onSubmit={handleSubmit}
            >

              <div className="form-field">
                <label htmlFor="email">
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="form-field">
                <div className="field-label-row">
                  <label htmlFor="password">
                    Password
                  </label>

                  <span className="field-hint">
                    Secure sign in
                  </span>
                </div>

                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
              </div>

              {error && (
                <div className="login-error">
                  {error}
                </div>
              )}

              <button
                className="login-submit"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="login-spinner" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <span className="login-arrow">→</span>
                  </>
                )}
              </button>

            </form>

            <div className="login-info">
              <div className="info-line" />

              <span>
                Your healthcare information stays protected.
              </span>

              <div className="info-line" />
            </div>

          </div>

        </section>

      </div>
    </div>
  );
}

export default Login;