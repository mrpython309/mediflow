import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  Clock3,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";

import api from "../../services/api";

function parseAIResponse(text) {
  if (!text) {
    return {
      specialist: "",
      urgency: "",
      guidance: "",
      disclaimer: "",
    };
  }

  const cleanText = text
    .replace(/\s+/g, " ")
    .trim();

  const specialistMatch = cleanText.match(
    /Suggested specialist:\s*(.*?)\s+Urgency:/i
  );

  const urgencyMatch = cleanText.match(
    /Urgency:\s*(.*?)\s+Guidance:/i
  );

  const guidanceMatch = cleanText.match(
    /Guidance:\s*(.*?)\s+Disclaimer:/i
  );

  const disclaimerMatch = cleanText.match(
    /Disclaimer:\s*(.*)$/i
  );

  return {
    specialist:
      specialistMatch?.[1]?.trim() || "",

    urgency:
      urgencyMatch?.[1]?.trim() || "",

    guidance:
      guidanceMatch?.[1]?.trim() || "",

    disclaimer:
      disclaimerMatch?.[1]?.trim() || "",
  };
}

function AIAssistant() {
  const navigate = useNavigate();

  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState("");
  const [suggestedSpecialist, setSuggestedSpecialist] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const parsedResult = useMemo(
    () => parseAIResponse(result),
    [result]
  );

  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      setError(
        "Please describe your symptoms before analyzing them."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult("");
      setSuggestedSpecialist("");

      const response = await api.post(
        "/api/ai/analyze",
        JSON.stringify(symptoms.trim()),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const aiResponse =
        typeof response.data === "string"
          ? response.data
          : response.data?.message || "";

      setResult(aiResponse);

      const specialistMatch =
        aiResponse.match(
          /Suggested specialist:\s*(.*?)\s+Urgency:/i
        );

      if (specialistMatch?.[1]) {
        setSuggestedSpecialist(
          specialistMatch[1].trim()
        );
      }
    } catch (err) {
      console.error(
        "AI analysis failed:",
        err
      );

      setError(
        err.response?.data?.message ||
          "MediFlow AI is temporarily unavailable. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExample = (example) => {
    setSymptoms(example);
    setError("");
  };

  return (
    <div className="ai-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="ai-hero">

        <div className="ai-hero-copy">

          <div className="ai-hero-label">
            <Sparkles size={13} />
            <span>MEDIFLOW AI</span>
          </div>

          <h1>
            Understand your symptoms.
            <br />
            Find the right care.
          </h1>

          <p>
            Describe how you're feeling in your own words.
            MediFlow AI can suggest an appropriate medical
            specialty and help you take the next step.
          </p>

        </div>

        <div className="ai-hero-mark">

          <div className="ai-hero-orbit orbit-one" />
          <div className="ai-hero-orbit orbit-two" />

          <div className="ai-hero-icon">
            <Stethoscope size={31} strokeWidth={1.6} />
          </div>

        </div>

      </section>

      {/* =====================================================
          INPUT CARD
      ===================================================== */}

      <section className="ai-input-card">

        <div className="ai-input-heading">

          <div className="ai-section-icon">
            <Sparkles size={16} />
          </div>

          <div>

            <span className="ai-section-kicker">
              STEP 01
            </span>

            <h2>Tell us how you're feeling</h2>

            <p>
              Mention your main symptoms, how long
              you've had them, and anything else that
              may help.
            </p>

          </div>

        </div>

        <textarea
          value={symptoms}
          onChange={(event) =>
            setSymptoms(event.target.value)
          }
          placeholder="Example: I've had a sore throat, fever and cough since yesterday..."
          rows={7}
          maxLength={1000}
        />

        <div className="ai-input-meta">

          <span>
            {symptoms.length}/1000
          </span>

          <span>
            General guidance only
          </span>

        </div>

        <div className="ai-example-row">

          <span className="ai-example-label">
            Try an example:
          </span>

          <button
            type="button"
            onClick={() =>
              handleExample(
                "I have fever, cough and sore throat"
              )
            }
          >
            Fever & cough
          </button>

          <button
            type="button"
            onClick={() =>
              handleExample(
                "I have chest pain and pressure in my chest"
              )
            }
          >
            Chest discomfort
          </button>

          <button
            type="button"
            onClick={() =>
              handleExample(
                "I have a skin rash and itching"
              )
            }
          >
            Skin irritation
          </button>

        </div>

        {error && (
          <div className="ai-error">

            <AlertCircle size={15} />

            <span>{error}</span>

          </div>
        )}

        <div className="ai-input-footer">

          <div className="ai-safety-note">

            <ShieldCheck size={15} />

            <span>
              AI guidance does not replace a medical
              evaluation.
            </span>

          </div>

          <button
            type="button"
            className="ai-analyze-button"
            onClick={handleAnalyze}
            disabled={loading}
          >

            {loading ? (
              <>
                <LoaderCircle
                  size={15}
                  className="ai-spinner"
                />

                Analyzing symptoms...
              </>
            ) : (
              <>
                Analyze symptoms
                <ArrowRight size={15} />
              </>
            )}

          </button>

        </div>

      </section>

      {/* =====================================================
          LOADING STATE
      ===================================================== */}

      {loading && (
        <section className="ai-analysis-status">

          <div className="ai-loading-icon">
            <Sparkles size={17} />
          </div>

          <div>

            <strong>
              MediFlow AI is reviewing your symptoms
            </strong>

            <p>
              Looking for the most appropriate
              specialist.
            </p>

          </div>

        </section>
      )}

      {/* =====================================================
          RESULT
      ===================================================== */}

      {result && !loading && (

        <section className="ai-result-card">

          <div className="ai-result-top">

            <div>

              <div className="ai-result-label">
                <Sparkles size={13} />
                MEDIFLOW AI
              </div>

              <h2>
                Your care guidance
              </h2>

              <p>
                Based on the symptoms you described.
              </p>

            </div>

            <div className="ai-result-ready">
              <span />
              Analysis ready
            </div>

          </div>

          {/* Specialist */}

          {parsedResult.specialist && (
            <div className="ai-result-feature">

              <div className="ai-result-feature-icon">
                <Stethoscope size={18} />
              </div>

              <div>

                <span>
                  SUGGESTED SPECIALIST
                </span>

                <strong>
                  {parsedResult.specialist}
                </strong>

              </div>

            </div>
          )}

          <div className="ai-result-grid">

            {/* Urgency */}

            {parsedResult.urgency && (
              <div className="ai-result-section">

                <div className="ai-result-section-heading">
                  <Clock3 size={15} />
                  <span>Urgency</span>
                </div>

                <p className="ai-urgency">
                  {parsedResult.urgency}
                </p>

              </div>
            )}

            {/* Guidance */}

            {parsedResult.guidance && (
              <div className="ai-result-section">

                <div className="ai-result-section-heading">
                  <ShieldCheck size={15} />
                  <span>Guidance</span>
                </div>

                <p>
                  {parsedResult.guidance}
                </p>

              </div>
            )}

          </div>

          {/* Disclaimer */}

          {parsedResult.disclaimer && (
            <div className="ai-disclaimer-box">

              <ShieldCheck size={15} />

              <div>

                <strong>
                  Important
                </strong>

                <p>
                  {parsedResult.disclaimer}
                </p>

              </div>

            </div>
          )}

          {/* Actions */}

          {suggestedSpecialist && (
            <div className="ai-result-actions">

              <div>
                <span>
                  READY FOR THE NEXT STEP?
                </span>

                <p>
                  Explore doctors who may match
                  this recommendation.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/patient/doctors?specialty=${encodeURIComponent(
                      suggestedSpecialist
                    )}`
                  )
                }
              >
                Find suitable doctors
                <ArrowRight size={15} />
              </button>

            </div>
          )}

          <div className="ai-result-bottom">
            <span>
              MediFlow AI provides general information
              for educational purposes.
            </span>

            <span>
              Always consult a qualified healthcare
              professional for medical concerns.
            </span>
          </div>

        </section>
      )}

    </div>
  );
}

export default AIAssistant;