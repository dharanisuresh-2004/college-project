import React, { useEffect, useState } from "react";

// /C:/Users/justi/Documents/programs/college_management/frontend/src/mainpage/attendance/attendance.jsx

export default function Attendance() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [busyId, setBusyId] = useState(null); // student_id of student being updated

    useEffect(() => {
        let mounted = true;
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch("http://localhost:8080/students/list/all");
                if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
                const data = await res.json();
                if (mounted) setStudents(Array.isArray(data) ? data : []);
            } catch (err) {
                if (mounted) setError(err.message || "Failed to load students");
            } finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        return () => (mounted = false);
    }, []);

    // Sends today's date (or whatever your API expects) to mark absent.
    // Uses student_id as the identifier and optimistically increments no_of_absences.
    async function markAbsent(studentId) {
        setBusyId(studentId);
        setError(null);
        const today = new Date().toISOString(); // adjust payload if your API expects a different shape
        try {
            const res = await fetch(`http://localhost:8080/students/${encodeURIComponent(studentId)}/attendance`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ date: today }),
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || res.statusText || "Failed to update attendance");
            }
            const updated = await res.json().catch(() => null);
            setStudents(prev =>
                prev.map(s =>
                    s.student_id === studentId
                        ? (updated ? updated : { ...s, no_of_absences: Number(s.no_of_absences || 0) + 1 })
                        : s
                )
            );
        } catch (err) {
            setError(err.message || "Update failed");
        } finally {
            setBusyId(null);
        }
    }

    if (loading) return <div>Loading students…</div>;
    if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

    return (
        <div style={{ color: "white"}}>
            <h2>Attendance</h2>
            {students.length === 0 && <div>No students found.</div>}
            <ul style={{ listStyle: "none", padding: 0 }}>
                {students.map((s) => (
                    <li
                        key={s.student_id}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "8px 0",
                            borderBottom: "1px solid #eee",
                        }}
                    >
                        <div>
                            <div style={{ fontWeight: 600 }}>
                                Student {s.student_id} — Semester: {s.semester ?? "—"}
                            </div>
                            <div style={{ fontSize: 12, color: "#555" }}>
                                Attendance: {s.attendance_percentage ?? "—"} | Absences: {s.no_of_absences ?? 0}
                            </div>
                        </div>
                        <button
                            onClick={() => markAbsent(s.student_id)}
                            disabled={busyId === s.student_id}
                            style={{
                                padding: "6px 10px",
                                cursor: busyId === s.student_id ? "not-allowed" : "pointer",
                            }}
                        >
                            {busyId === s.student_id ? "Updating…" : "Mark Absent"}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}