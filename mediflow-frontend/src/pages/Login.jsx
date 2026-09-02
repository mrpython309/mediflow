import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mode, setMode] = useState("login");

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError("");
    setSuccess("");
  };

  const handleLoginChange = (event) => {
    const { name, value } = event.target;

    setLoginForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleRegisterChange = (event) => {
    const { name, value } = event.target;

    setRegisterForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await api.post(
        "/api/auth/login",
        loginForm
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

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (registerForm.phone.length !== 10) {
      setError("Phone number must contain 10 digits.");
      return;
    }

    setLoading(true);

    try {
      await api.post(
        "/api/patients/register",
        registerForm
      );

      setSuccess(
        "Account created successfully. You can now sign in."
      );

      setLoginForm({
        email: registerForm.email,
        password: registerForm.password,
      });

      setRegisterForm({
        fullName: "",
        email: "",
        phone: "",
        password: "",
      });

      setTimeout(() => {
        setMode("login");
        setSuccess("");
      }, 1200);
    } catch (error) {
      console.error("Registration failed:", error);

      if (error.response) {
        const responseData = error.response.data;

        if (responseData?.errors) {
          const firstError = Object.values(
            responseData.errors
          )[0];

          setError(
            firstError ||
              responseData.message ||
              "Unable to create your account."
          );
        } else {
          setError(
            responseData?.message ||
              "Unable to create your account."
          );
        }
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

            {/* Mode switch */}
            <div className="auth-tabs">
              <button
                type="button"
                className={`auth-tab ${
                  mode === "login" ? "active" : ""
                }`}
                onClick={() => switchMode("login")}
              >
                Sign in
              </button>

              <button
                type="button"
                className={`auth-tab ${
                  mode === "register" ? "active" : ""
                }`}
                onClick={() => switchMode("register")}
              >
                Create account
              </button>
            </div>

            {mode === "login" ? (
              <>
                <div className="login-heading">
                  <span>WELCOME BACK</span>

                  <h2>Sign in to MediFlow</h2>

                  <p>
                    Access your personalized healthcare
                    workspace.
                  </p>
                </div>

                <form
                  className="login-form"
                  onSubmit={handleLoginSubmit}
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
                      value={loginForm.email}
                      onChange={handleLoginChange}
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
                      value={loginForm.password}
                      onChange={handleLoginChange}
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
                        <span className="login-arrow">
                          →
                        </span>
                      </>
                    )}
                  </button>
                </form>

                <div className="auth-switch-text">
                  New to MediFlow?
                  <button
                    type="button"
                    onClick={() => switchMode("register")}
                  >
                    Create an account
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="login-heading">
                  <span>NEW PATIENT</span>

                  <h2>Create your account</h2>

                  <p>
                    Get started with your MediFlow
                    healthcare workspace.
                  </p>
                </div>

                <form
                  className="login-form"
                  onSubmit={handleRegisterSubmit}
                >
                  <div className="form-field">
                    <label htmlFor="fullName">
                      Full name
                    </label>

                    <input
                      id="fullName"
                      type="text"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={registerForm.fullName}
                      onChange={handleRegisterChange}
                      autoComplete="name"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="registerEmail">
                      Email address
                    </label>

                    <input
                      id="registerEmail"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={registerForm.email}
                      onChange={handleRegisterChange}
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="phone">
                      Phone number
                    </label>

                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      placeholder="10-digit mobile number"
                      value={registerForm.phone}
                      onChange={(event) => {
                        const value = event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10);

                        setRegisterForm((previous) => ({
                          ...previous,
                          phone: value,
                        }));
                      }}
                      inputMode="numeric"
                      autoComplete="tel"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="registerPassword">
                      Password
                    </label>

                    <input
                      id="registerPassword"
                      type="password"
                      name="password"
                      placeholder="Create a password"
                      value={registerForm.password}
                      onChange={handleRegisterChange}
                      autoComplete="new-password"
                      required
                    />
                  </div>

                  {error && (
                    <div className="login-error">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="login-success">
                      {success}
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
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create account
                        <span className="login-arrow">
                          →
                        </span>
                      </>
                    )}
                  </button>
                </form>

                <div className="auth-switch-text">
                  Already have an account?
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                  >
                    Sign in
                  </button>
                </div>
              </>
            )}

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