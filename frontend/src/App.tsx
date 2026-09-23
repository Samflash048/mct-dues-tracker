import { useState, useEffect } from "react";
import "./App.css";

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

function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("https://mct-dues-api.onrender.com/api/students/")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => setStudents(data))
      .catch((err) => setError(err.message));
  }, []);

  // Evaluates database records against your specific class rules
  const getPillStatus = (payments: Payment[], level: number) => {
    if (level === 200) return "na";
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

  const calculateStats = (level: number) => {
    if (level === 200 || level === 500)
      return { count: "—", pct: 0, applicable: false };
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

  return (
    <div className="wrap">
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

      <div className="banner">
        <span className="banner-mark">NOW OPEN</span>
        <div className="banner-text">
          <b>400lvl class dues collection is now open.</b> Every student below
          is currently marked
          <b> unpaid</b> for 400lvl until payment is confirmed. 200lvl shows{" "}
          <b>N/A</b> since no dues were collected that session, and 500lvl will
          open in a later session.
        </div>
      </div>

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
  );
}

export default App;
