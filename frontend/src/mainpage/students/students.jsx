import React, { useEffect, useState } from "react";
import "./students.css";
import StudentEditOverlay from "./form/studentForm.jsx";

export default function StudentsPage() {
  const DEPARTMENTS = ["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT"];
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tabs: "list" or "add"
  const [activeTab, setActiveTab] = useState("list");

  // New student form
  const [newStudent, setNewStudent] = useState({
    name: "",
    age: "",
    date_of_birth: "",
    department: "CSE",
    year: 2023,
    current_semester: 1,
    address: "",
    contact_no: "",
    emergency_contact_no: "",
    use_college_bus: false,
  });

  // Overlay for editing student
  const [overlayStudent, setOverlayStudent] = useState(null); // student object to edit
  const [overlayVisible, setOverlayVisible] = useState(false);

  // Filters
  const [deptFilter, setDeptFilter] = useState("CSE");
  const [yearFilter, setYearFilter] = useState("");

  useEffect(() => {
    fetchAllStudents();
  }, []);

  const api = (path, options = {}) =>
    fetch(`http://localhost:8080${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });

  const toFrontend = (s) => ({
    id: s.id ?? s.student_id,
    name: s.name,
    age: s.age,
    date_of_birth: s.date_of_birth,
    department: typeof s.department === "string" ? s.department : String(s.department),
    year: s.year,
    current_semester: s.current_semester,
    address: s.address,
    contact_no: s.contact_no,
    emergency_contact_no: s.emergency_contact_no,
    use_college_bus: !!s.use_college_bus,
  });

  // Fetch functions
  const fetchAllStudents = async () => {
    try {
      setLoading(true);
      const res = await api("/students/list/all");
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      setStudents(Array.isArray(data) ? data.map(toFrontend) : []);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const addStudent = async () => {
    try {
      const payload = { ...newStudent, age: Number(newStudent.age), year: Number(newStudent.year), current_semester: Number(newStudent.current_semester), use_college_bus: Boolean(newStudent.use_college_bus) };
      const res = await api("/students/", { method: "POST", body: JSON.stringify(payload) });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to add student");
      }
      await fetchAllStudents();
      setNewStudent({
        name: "",
        age: "",
        date_of_birth: "",
        department: "CSE",
        year: 2023,
        current_semester: 1,
        address: "",
        contact_no: "",
        emergency_contact_no: "",
        use_college_bus: false,
      });
      setActiveTab("list"); // switch to list after adding
    } catch (e) {
      alert(e.message);
    }
  };

  const editStudent = async (id, updates) => {
    try {
      const res = await api(`/students/${id}`, { method: "PATCH", body: JSON.stringify(updates) });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to edit student");
      }
      await fetchAllStudents();
      setOverlayVisible(false);
      setOverlayStudent(null);
    } catch (e) {
      alert(e.message);
    }
  };

  const deleteStudent = async (id) => {
    try {
      const res = await api(`/students/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to delete student");
      }
      await fetchAllStudents();
    } catch (e) {
      alert(e.message);
    }
  };

  // Filter helpers
  const fetchByDept = async () => {
    try {
      const res = await api(`/students/find/${deptFilter}`);
      if (!res.ok) throw new Error("Failed to fetch by dept");
      const data = await res.json();
      setStudents(Array.isArray(data) ? data.map(toFrontend) : []);
    } catch (e) {
      alert(e.message);
    }
  };

  const fetchByDeptYear = async () => {
    if (!yearFilter) return alert("Select year");
    try {
      const res = await api(`/students/find/${deptFilter}/${yearFilter}`);
      if (!res.ok) throw new Error("Failed to fetch by dept/year");
      const data = await res.json();
      setStudents(Array.isArray(data) ? data.map(toFrontend) : []);
    } catch (e) {
      alert(e.message);
    }
  };

  // Loading / error handling
  if (loading) return <div className="loading">Loading students...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="students-page">
      <h1>Students Management</h1>

      {/* Tabs */}
      <div className="tabs">
        <button className={activeTab === "list" ? "active" : ""} onClick={() => setActiveTab("list")}>Student List</button>
        <button className={activeTab === "add" ? "active" : ""} onClick={() => setActiveTab("add")}>Add Student</button>
      </div>

      {/* Tab content */}
      {activeTab === "add" && (
        <div className="add-student-form">
          <h2>Add New Student</h2>
          <input type="text" placeholder="Name" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} />
          <input type="number" placeholder="Age" value={newStudent.age} onChange={(e) => setNewStudent({ ...newStudent, age: e.target.value })} />
          <input type="text" placeholder="YYYY-MM-DD" value={newStudent.date_of_birth} onChange={(e) => setNewStudent({ ...newStudent, date_of_birth: e.target.value })} />
          <select value={newStudent.department} onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })}>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <input type="number" placeholder="Year" value={newStudent.year} onChange={(e) => setNewStudent({ ...newStudent, year: e.target.value })} />
          <input type="number" placeholder="Current Semester" value={newStudent.current_semester} onChange={(e) => setNewStudent({ ...newStudent, current_semester: e.target.value })} />
          <input type="text" placeholder="Address" value={newStudent.address} onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })} />
          <input type="text" placeholder="Contact No" value={newStudent.contact_no} onChange={(e) => setNewStudent({ ...newStudent, contact_no: e.target.value })} />
          <input type="text" placeholder="Emergency Contact No" value={newStudent.emergency_contact_no} onChange={(e) => setNewStudent({ ...newStudent, emergency_contact_no: e.target.value })} />
          <label>
            <input type="checkbox" checked={newStudent.use_college_bus} onChange={(e) => setNewStudent({ ...newStudent, use_college_bus: e.target.checked })} />
            Use College Bus
          </label>
          <button onClick={addStudent}>Add Student</button>
        </div>
      )}

      {activeTab === "list" && (
        <div className="students-list">
          {/* Filters */}
          <div className="actions">
            <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <button onClick={fetchByDept}>Fetch by Dept</button>
            <input type="number" placeholder="Year" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} />
            <button onClick={fetchByDeptYear}>Fetch by Dept + Year</button>
            <button onClick={fetchAllStudents}>Refresh All</button>
          </div>

          {/* Students table */}
          <table className="students-table">
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Age</th><th>DOB</th><th>Dept</th><th>Year</th><th>Sem</th><th>Bus</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 && (
                <tr><td colSpan={9} style={{ textAlign: "center" }}>No students found</td></tr>
              )}
              {students.map(s => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.name}</td>
                  <td>{s.age}</td>
                  <td>{s.date_of_birth}</td>
                  <td>{s.department}</td>
                  <td>{s.year}</td>
                  <td>{s.current_semester}</td>
                  <td>{s.use_college_bus ? "Yes" : "No"}</td>
                  <td>
                    <button onClick={() => { setOverlayStudent(s); setOverlayVisible(true); }}>Edit</button>
                    <button onClick={() => deleteStudent(s.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Overlay placeholder */}
      {overlayVisible && overlayStudent && (
        <div className="overlay">
            <StudentEditOverlay
                student={overlayStudent}
                onClose={() => setOverlayVisible(false)}
                onSave={editStudent} // your existing API call
            />
        </div>
      )}
    </div>
  );
}
