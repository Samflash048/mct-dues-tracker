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

  // 1. New state to hold the search text
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/students/")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => setStudents(data))
      .catch((err) => setError(err.message));
  }, []);

  const renderPaymentStatus = (payments: Payment[], level: number) => {
    if (!payments || !Array.isArray(payments))
      return <span style={{ color: "gray" }}>—</span>;
    const record = payments.find((p) => p.academic_level === level);
    if (!record) return <span style={{ color: "gray" }}>—</span>;
    return record.is_paid ? (
      <span style={{ color: "green", fontWeight: "bold" }}>Paid</span>
    ) : (
      <span style={{ color: "#d9534f", fontWeight: "500" }}>Unpaid</span>
    );
  };

  // 2. Filter the students list based on the search query (name or reg number)
  const filteredStudents = students.filter(
    (student) =>
      student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.reg_number.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "system-ui",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ textAlign: "left", marginBottom: "10px" }}>
        MCT Dues Dashboard
      </h1>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {/* 3. The Search Input Field */}
      <div style={{ marginBottom: "20px", textAlign: "left" }}>
        <input
          type="text"
          placeholder="Search by name or reg number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "10px 15px",
            width: "100%",
            maxWidth: "400px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />
      </div>

      <div
        style={{
          overflowX: "auto",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#f4f4f4",
                borderBottom: "2px solid #ddd",
              }}
            >
              <th style={{ padding: "12px" }}>Name</th>
              <th style={{ padding: "12px" }}>Reg Number</th>
              <th style={{ padding: "12px" }}>100L</th>
              <th style={{ padding: "12px" }}>300L</th>
              <th style={{ padding: "12px" }}>400L</th>
              <th style={{ padding: "12px" }}>500L</th>
            </tr>
          </thead>
          <tbody>
            {/* 4. Map over the filtered list instead of the full list */}
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "12px" }}>
                    <strong>{student.full_name}</strong>
                  </td>
                  <td style={{ padding: "12px", color: "#555" }}>
                    {student.reg_number}
                  </td>
                  <td style={{ padding: "12px" }}>
                    {renderPaymentStatus(student.payments, 100)}
                  </td>
                  <td style={{ padding: "12px" }}>
                    {renderPaymentStatus(student.payments, 300)}
                  </td>
                  <td style={{ padding: "12px" }}>
                    {renderPaymentStatus(student.payments, 400)}
                  </td>
                  <td style={{ padding: "12px" }}>
                    {renderPaymentStatus(student.payments, 500)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "gray",
                  }}
                >
                  No students found matching "{searchQuery}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
