import React, { useEffect, useState } from "react";

export default function BorrowOverlay({ book, onClose, onBorrowSuccess }) {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("http://localhost:8080/students/list/all");
        if (!res.ok) throw new Error("Failed to fetch students");
        const data = await res.json();
        setStudents(Array.isArray(data) ? data : []);
        setError(null);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const submitBorrow = async () => {
    if (!selectedStudentId) {
      setError("Please select a student");
      return;
    }
    try {
      setSubmitting(true);
              // /books/borrow/{bookId}/{studentId}
      const res = await fetch(
        `http://localhost:8080/books/borrow/${book.id}/${selectedStudentId}`,
        { method: "PUT" }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to borrow book");
      }
      await res.json();
      setSubmitting(false);
      onBorrowSuccess(); // notify parent to refresh and close
    } catch (e) {
      setSubmitting(false);
      setError(e.message);
    }
  };

  return (
    <div className="overlay">
      <div className="overlay-content">
        <h3>Borrow Book</h3>

        <div className="overlay-summary">
          <div><strong>Book:</strong> {book.book_name}</div>
          <div><strong>Author:</strong> {book.author}</div>
          <div><strong>Status:</strong> {book.status}</div>
        </div>

        {loading ? (
          <div className="loading">Loading students...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <label className="overlay-field">
            <span className="overlay-label">Select student</span>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
            >
              <option value="">-- Select --</option>
              {students.map((s) => (
                <option key={s.id || s.student_id} value={s.id || s.student_id}>
                  {s.name} ({typeof s.department === "string" ? s.department : String(s.department)})
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="overlay-actions">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={submitBorrow} disabled={submitting || loading}>
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
