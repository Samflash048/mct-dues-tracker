import { useState, useEffect } from "react";

// Define the shape of our incoming data
interface ResultRecord {
  course_code: string;
  title: string;
  unit_load: number;
  level: number;
  semester: number;
  score: number;
  grade: string;
  session: string;
}

export default function Results() {
  const [results, setResults] = useState<ResultRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedLevel, setExpandedLevel] = useState<number | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      const regNumber = localStorage.getItem("mct_reg_number");
      // If you are using the Vite proxy, keep this as '/api/auth...'.
      // If you are using absolute URLs locally, change it to 'http://127.0.0.1:8000/api/auth...'
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/auth/results/?reg_number=${regNumber}`,
        );
        const data = await res.json();

        if (res.ok) {
          setResults(data.results);
        } else {
          setError(data.error || "Failed to fetch results.");
        }
      } catch (err) {
        setError("Network error. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  // Group the flat data array by academic level, then by semester
  const groupedResults = results.reduce(
    (acc, current) => {
      const { level, semester } = current;
      if (!acc[level]) acc[level] = { 1: [], 2: [] };
      acc[level][semester].push(current);
      return acc;
    },
    {} as Record<number, Record<number, ResultRecord[]>>,
  );

  const toggleLevel = (level: number) => {
    setExpandedLevel(expandedLevel === level ? null : level);
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        Loading your academic records...
      </div>
    );
  if (error)
    return <div style={{ color: "red", textAlign: "center" }}>{error}</div>;

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        background: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      }}
    >
      <h2
        style={{
          color: "#1e3a8a",
          borderBottom: "2px solid #e2e8f0",
          paddingBottom: "10px",
        }}
      >
        Academic Results
      </h2>

      {Object.keys(groupedResults).length === 0 ? (
        <p style={{ color: "#64748b" }}>
          No results have been uploaded for your profile yet.
        </p>
      ) : (
        // Sort levels so 100 Level is at the top
        Object.keys(groupedResults)
          .map(Number)
          .sort((a, b) => a - b)
          .map((level) => (
            <div key={level} style={{ marginBottom: "10px" }}>
              {/* Level Accordion Header */}
              <button
                onClick={() => toggleLevel(level)}
                style={{
                  width: "100%",
                  padding: "15px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  textAlign: "left",
                  fontWeight: "bold",
                  fontSize: "16px",
                  color: "#334155",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>{level} Level</span>
                <span>{expandedLevel === level ? "▼" : "▶"}</span>
              </button>

              {/* Semester Data (Shows only if expanded) */}
              {expandedLevel === level && (
                <div
                  style={{
                    padding: "15px",
                    border: "1px solid #e2e8f0",
                    borderTop: "none",
                    borderBottomLeftRadius: "6px",
                    borderBottomRightRadius: "6px",
                  }}
                >
                  {[1, 2].map((semester) => {
                    const semResults = groupedResults[level][semester];
                    if (semResults.length === 0) return null;

                    return (
                      <div key={semester} style={{ marginBottom: "20px" }}>
                        <h3
                          style={{
                            color: "#475569",
                            fontSize: "15px",
                            marginBottom: "10px",
                          }}
                        >
                          {semester === 1 ? "1st Semester" : "2nd Semester"}
                        </h3>

                        <table
                          style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            fontSize: "14px",
                          }}
                        >
                          <thead>
                            <tr
                              style={{
                                background: "#f1f5f9",
                                textAlign: "left",
                              }}
                            >
                              <th
                                style={{
                                  padding: "10px",
                                  borderBottom: "2px solid #cbd5e1",
                                }}
                              >
                                Course
                              </th>
                              <th
                                style={{
                                  padding: "10px",
                                  borderBottom: "2px solid #cbd5e1",
                                }}
                              >
                                Score
                              </th>
                              <th
                                style={{
                                  padding: "10px",
                                  borderBottom: "2px solid #cbd5e1",
                                }}
                              >
                                Grade
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {semResults.map((res, index) => (
                              <tr
                                key={index}
                                style={{ borderBottom: "1px solid #e2e8f0" }}
                              >
                                <td
                                  style={{ padding: "10px", color: "#1e293b" }}
                                >
                                  <strong>{res.course_code}</strong>
                                </td>
                                <td style={{ padding: "10px" }}>{res.score}</td>
                                <td
                                  style={{
                                    padding: "10px",
                                    fontWeight: "bold",
                                    color:
                                      res.grade === "F" ? "#ef4444" : "#10b981",
                                  }}
                                >
                                  {res.grade}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))
      )}
    </div>
  );
}
