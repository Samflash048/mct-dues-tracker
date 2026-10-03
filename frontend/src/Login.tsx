import { useState } from "react";
import "./App.css";

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [step, setStep] = useState(1);
  const [regNumber, setRegNumber] = useState("");
  const [pin, setPin] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // The base URL routes through your Netlify proxy in production or Vite proxy locally
  const BASE_URL = "http://127.0.0.1:8000/api/auth";

  const handleRegSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/verify-reg/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reg_number: regNumber }),
      });
      const data = await res.json();

      if (res.ok) {
        setName(data.name);
        setStep(2);
      } else {
        setError(data.error || "Student not found.");
      }
    } catch (err) {
      setError("Network error. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/verify-code/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reg_number: regNumber, code: pin }),
      });
      const data = await res.json();

      if (res.ok) {
        // Save the session data to keep the student logged in
        localStorage.setItem("mct_token", data.session);
        localStorage.setItem("mct_student_name", data.name);
        localStorage.setItem("mct_reg_number", regNumber);
        onLogin();
      } else {
        setError(data.error || "Invalid PIN.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="wrap"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          className="tb-title"
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#1e3a8a",
            borderBottom: "none",
          }}
        >
          MCT Portal Login
        </h2>

        {error && (
          <div
            style={{
              color: "#dc2626",
              background: "#fee2e2",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "15px",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {step === 1 ? (
          <form
            onSubmit={handleRegSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                Registration Number
              </label>
              <input
                type="text"
                placeholder="e.g. 2022/241800"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  boxSizing: "border-box",
                  fontSize: "16px",
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "14px",
                background: "#1e3a8a",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              {loading ? "Verifying..." : "Next"}
            </button>
          </form>
        ) : (
          <form
            onSubmit={handlePinSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            <div
              style={{
                textAlign: "center",
                marginBottom: "10px",
                background: "#f1f5f9",
                padding: "12px",
                borderRadius: "6px",
              }}
            >
              <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
                Welcome back,
              </p>
              <p
                style={{
                  margin: "5px 0 0 0",
                  fontWeight: "bold",
                  fontSize: "18px",
                  color: "#1e3a8a",
                }}
              >
                {name}
              </p>
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                Session PIN
              </label>
              <input
                type="text"
                placeholder="Enter 6-character code"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  boxSizing: "border-box",
                  fontSize: "16px",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  textAlign: "center",
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "14px",
                background: "#1e3a8a",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              style={{
                padding: "8px",
                background: "transparent",
                color: "#64748b",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
                fontSize: "14px",
              }}
            >
              Not you? Go back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
