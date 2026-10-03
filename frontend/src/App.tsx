import { useState, useEffect } from "react";
import "./App.css";
//import Login from "./Login";
//import Results from "./Results";

interface Payment {
  id: number;
  academic_level: number;
  amount_paid: string | number;
  is_paid: boolean;
}

interface Student {
  id: number;
  full_name: string;
  reg_number: string;
  payments: Payment[];
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("mct_token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetch("/api/students/")
        .then((res) => {
          if (!res.ok) throw new Error("Network response was not ok");
          return res.json();
        })
        .then((data) => setStudents(data))
        .catch((err) => setError(err.message));
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem("mct_token");
    localStorage.removeItem("mct_student_name");
    localStorage.removeItem("mct_reg_number");
    setIsAuthenticated(false);
  };

  // --- UPDATED: 200lvl is no longer locked to "N/A" ---
  const getPillStatus = (payments: Payment[], level: number) => {
    if (level === 500) return "notopen";
    if (!payments || !Array.isArray(payments)) return "unpaid";

    const record = payments.find((p) => p.academic_level === level);
    if (!record) return "unpaid";

    return record.is_paid ? "paid" : "unpaid";
  };

  const renderPill = (status: string) => {
    const labels: Record<string, string> = {
      paid: "Paid",
      unpaid: "Unpaid",
      half: "Half",
      exempt: "Exempt",
      na: "N/A",
      notopen: "Not open",
    };
    return (
      <span className={`pill pill-${status}`}>{labels[status] || status}</span>
    );
  };

  const filteredStudents = students.filter(
    (student) =>
      student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.reg_number &&
        student.reg_number.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  // --- UPDATED: 200lvl is no longer excluded from stat calculations ---
  const calculateStats = (level: number) => {
    if (level === 500) return { count: "—", pct: 0, applicable: false };
    if (students.length === 0)
      return { count: "0 / 0", pct: 0, applicable: true };

    const paidCount = students.filter(
      (s) => getPillStatus(s.payments, level) === "paid",
    ).length;
    const pct = Math.round((paidCount / students.length) * 100);
    return {
      count: `${paidCount} / ${students.length}`,
      pct,
      applicable: true,
    };
  };

  const levels = [100, 200, 300, 400, 500];
  const levelTitles: Record<number, string> = {
    100: "100lvl",
    200: "200lvl",
    300: "300lvl",
    400: "400lvl",
    500: "500lvl",
  };

  //if (!isAuthenticated) {
  //  return <Login onLogin={() => setIsAuthenticated(true)} />;
  //}

  return (
    <div
      style={{
        background: "#f8fafc",
        minHeight: "100vh",
        paddingBottom: "50px",
      }}
    >
      <div
        style={{
          background: "#0f172a",
          padding: "15px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: "18px" }}>
          {localStorage.getItem("mct_student_name")}
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: "transparent",
            color: "#ef4444",
            border: "1px solid #ef4444",
            padding: "6px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </div>

      <div
        className="wrap"
        style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}
      >
        <h1
          className="tb-title"
          style={{ textAlign: "center", color: "#1e293b", marginTop: "20px" }}
        >
          MCT Department Portal
        </h1>

        <div style={{ marginTop: "40px" }}>
          <div className="titleblock">
            <div className="tb-main">
              <p className="tb-kicker">CLASS DUES LEDGER</p>
              <h1 className="tb-title">0'27 MCT Class</h1>
              <p className="tb-sub">
                Mechatronics Engineering, University of Nigeria, Nsukka
              </p>
            </div>
            <div className="tb-fields">
              <div className="tb-field">
                <span className="tb-field-label">MAINTAINED BY</span>
                <span className="tb-field-value">Financial Secretary</span>
              </div>
              <div className="tb-field">
                <span className="tb-field-label">CLASS REP</span>
                <span className="tb-field-value">Ezenwafor O. Marvelous</span>
              </div>
              <div className="tb-field">
                <span className="tb-field-label">RECORDS COVER</span>
                <span className="tb-field-value">100lvl – 500lvl</span>
              </div>
            </div>
          </div>

          {/* --- NEW PAYMENT BANNER & WHATSAPP BUTTON --- */}
          <div
            className="banner"
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            <div
              style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}
            >
              <span className="banner-mark">PAYMENT DESK</span>
              <div className="banner-text">
                <b>400lvl dues collections is active.</b> Review your status
                below. To make a payment or report a missing record, transfer to
                the account below and send your receipt to the Financial
                Secretary.
              </div>
            </div>

            <div
              style={{
                background: "#f1f5f9",
                padding: "15px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "15px",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  color: "#334155",
                  lineHeight: "1.6",
                }}
              >
                <strong>Bank Name:</strong> Palmpay <br />
                <strong>Account No:</strong> 8130339831 <br />
                <strong>Account Name:</strong> Kamdilichukwu Solomon Samuel
              </div>

              <a
                href="https://wa.me/2349128878614"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "#25D366",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 2px 4px rgba(37,211,102,0.2)",
                  whiteSpace: "nowrap",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.031 0C5.385 0 .002 5.385.002 12.031c0 2.126.554 4.2 1.606 6.027L.027 24l6.103-1.601a11.956 11.956 0 005.901 1.558h.005c6.643 0 12.025-5.385 12.025-12.031S18.675 0 12.031 0zm0 22.02c-1.8 0-3.565-.484-5.11-1.4l-.367-.217-3.797.996 1.015-3.702-.238-.378a10.048 10.048 0 01-1.536-5.334c0-5.542 4.512-10.052 10.056-10.052 2.686 0 5.21 1.045 7.108 2.944a10.024 10.024 0 012.94 7.105c0 5.54-4.51 10.05-10.05 10.05l-.021-.012zm5.518-7.53c-.302-.152-1.791-.885-2.068-.987-.278-.102-.48-.152-.68.152-.202.302-.782.987-.958 1.188-.178.203-.356.228-.658.077-.302-.152-1.28-.472-2.438-1.508-.902-.806-1.51-1.802-1.688-2.105-.178-.303-.02-.468.132-.62.136-.135.302-.353.454-.53.15-.176.202-.302.302-.503.1-.202.05-.378-.026-.53-.076-.152-.68-1.64-.932-2.247-.246-.593-.496-.512-.68-.521-.176-.008-.378-.008-.58-.008s-.53.076-.807.378c-.278.303-1.058 1.035-1.058 2.525s1.084 2.928 1.236 3.13c.152.203 2.136 3.262 5.176 4.571.722.311 1.286.496 1.725.635.726.23 1.387.197 1.91.12.585-.087 1.791-.733 2.043-1.442.253-.71.253-1.317.178-1.442-.075-.126-.277-.202-.58-.354z" />
                </svg>
                Send Receipt via WhatsApp
              </a>
            </div>
          </div>
          {/* ------------------------------------------- */}

          <div className="stats">
            {levels.map((level) => {
              const stats = calculateStats(level);
              return (
                <div className="stat" key={level}>
                  <div className="stat-level">{levelTitles[level]}</div>
                  <div className="stat-count">{stats.count}</div>
                  <div className="stat-bar">
                    <span
                      style={{ width: `${stats.applicable ? stats.pct : 0}%` }}
                    ></span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="toolbar">
            <div className="search">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Find yourself — type your name or reg. no."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="legend">
              <span className="legend-item">
                <span
                  className="legend-dot"
                  style={{ background: "var(--green)" }}
                ></span>
                Paid
              </span>
              <span className="legend-item">
                <span
                  className="legend-dot"
                  style={{ background: "var(--amber)" }}
                ></span>
                Half payment
              </span>
              <span className="legend-item">
                <span
                  className="legend-dot"
                  style={{ background: "var(--rust)" }}
                ></span>
                Unpaid
              </span>
              <span className="legend-item">
                <span
                  className="legend-dot"
                  style={{ background: "var(--slate)" }}
                ></span>
                N/A · Exempt · Not open
              </span>
            </div>
          </div>

          {error && (
            <p style={{ color: "var(--rust)", marginTop: "1rem" }}>
              Error loading data: {error}
            </p>
          )}

          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Name</th>
                  <th>Reg. No.</th>
                  <th className="center">100lvl</th>
                  <th className="center">200lvl</th>
                  <th className="center">300lvl</th>
                  <th className="center">400lvl</th>
                  <th className="center">500lvl</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                    <tr key={student.id}>
                      <td className="sn">{index + 1}</td>
                      <td className="sname">{student.full_name}</td>
                      <td className="sreg">{student.reg_number || "—"}</td>
                      <td className="center">
                        {renderPill(getPillStatus(student.payments, 100))}
                      </td>
                      <td className="center">
                        {renderPill(getPillStatus(student.payments, 200))}
                      </td>
                      <td className="center">
                        {renderPill(getPillStatus(student.payments, 300))}
                      </td>
                      <td className="center">
                        {renderPill(getPillStatus(student.payments, 400))}
                      </td>
                      <td className="center">
                        {renderPill(getPillStatus(student.payments, 500))}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="empty-row">
                    <td colSpan={8}>
                      No match found — check the spelling and try again.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <footer>
            <span>MCT '027 · Mechatronics Engineering, UNN</span>
            <span>
              Roster: <b>{students.length}</b> active students · Last updated{" "}
              <b>
                {new Date().toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </b>
            </span>
          </footer>
        </div>

        <div style={{ marginTop: "60px" }}>{/* <Results /> */}</div>
      </div>
    </div>
  );
}
