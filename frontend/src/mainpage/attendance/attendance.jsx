import React, { useEffect, useState } from "react";
import "./attendancePage.css";

export default function AttendancePage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // View overlay state
  const [viewOverlayVisible, setViewOverlayVisible] = useState(false);
  const [attendanceData, setAttendanceData] = useState(null);

  // Add attendance overlay state
  const [addOverlayVisible, setAddOverlayVisible] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [absenceDays, setAbsenceDays] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch("http://localhost:8080/students/list/all");
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openViewOverlay = async (studentId) => {
    try {
      const res = await fetch(`http://localhost:8080/students/${studentId}/attendance`);
      if (!res.ok) throw new Error("Failed to fetch attendance");
      const data = await res.json();
      setAttendanceData(data);
      setViewOverlayVisible(true);
    } catch (err) {
      alert(err.message);
    }
  };

  const closeViewOverlay = () => {
    setViewOverlayVisible(false);
    setAttendanceData(null);
  };

  const openAddOverlay = (studentId) => {
    setSelectedStudentId(studentId);
    setAbsenceDays("");
    setAddOverlayVisible(true);
  };

  const submitAbsenceDays = async () => {
    if (!absenceDays) return;
    try {
      const res = await fetch(
        `http://localhost:8080/students/${selectedStudentId}/absenceDays/${absenceDays}`,
        { method: "PUT" }
      );
      if (!res.ok) throw new Error("Failed to update attendance");
      await res.json();
      setAddOverlayVisible(false);
      setSelectedStudentId(null);
      setAbsenceDays("");
      fetchStudents(); // refresh list if needed
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="loading">Loading students...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="attendance-page">
      <h1>Student Attendance</h1>
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Semester</th>
            <th>View</th>
            <th>Add Attendance</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.current_semester}</td>
              <td>
                <button onClick={() => openViewOverlay(s.id)}>View</button>
              </td>
              <td>
                <button onClick={() => openAddOverlay(s.id)}>Add Attendance</button>
              </td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: "center" }}>
                No students found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* View overlay */}
      {viewOverlayVisible && attendanceData && (
        <div className="overlay">
          <div className="overlay-content">
            <h3>Attendance Details</h3>
            <div className="details-grid">
              <p><strong>Student ID:</strong> {attendanceData.student_id}</p>
              <p><strong>Attendance %:</strong> {attendanceData.attendance_percentage}</p>
              <p><strong>No. of Absences:</strong> {attendanceData.no_of_absences}</p>
              <p><strong>Semester:</strong> {attendanceData.semester}</p>
            </div>
            <button onClick={closeViewOverlay}>Close</button>
          </div>
        </div>
      )}

      {/* Add attendance overlay */}
      {addOverlayVisible && (
        <div className="overlay">
          <div className="overlay-content">
            <h3>Add Absence Days</h3>
            <input
              type="number"
              placeholder="Number of absence days"
              value={absenceDays}
              onChange={(e) => setAbsenceDays(e.target.value)}
            />
            <div className="overlay-actions">
              <button onClick={() => setAddOverlayVisible(false)}>Cancel</button>
              <button onClick={submitAbsenceDays}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
