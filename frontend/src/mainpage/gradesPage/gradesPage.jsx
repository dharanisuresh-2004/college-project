import React, { useState, useEffect } from 'react';
import './gradesPage.css';
import AddGrades from './gradeForm/gradeForm';

export default function Grades() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [overlayData, setOverlayData] = useState([]);
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [overlayTitle, setOverlayTitle] = useState('');

    const [showAddGrades, setShowAddGrades] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await fetch('http://localhost:8080/students/list/all');
            if (!res.ok) throw new Error('Failed to fetch students');
            const data = await res.json();
            setStudents(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchPerformance = async (studentId, studentName) => {
        try {
            // /students/{studentId}/semester/all/grades
            const res = await fetch(`http://localhost:8080/students/${studentId}/semester/all/grades`);
            if (!res.ok) throw new Error('Failed to fetch all grades');
            const data = await res.json();
            setOverlayTitle(`All Grades - ${studentName}`);
            // setOverlayData(data);
            setOverlayData(Array.isArray(data) ? data : [data]);
            console.log("Fetched all grades:", data);
            setOverlayVisible(true);
        } catch (err) {
            alert(err.message);
        }

    };

    const fetchCurrentSemGrades = async (studentId, studentName, currentSemester) => {
        try {
            const res = await fetch(`http://localhost:8080/students/${studentId}/semester/${currentSemester}/grades`);
            if (!res.ok) throw new Error('Failed to fetch current semester grades');
            const data = await res.json();
            setOverlayTitle(`Current Semester Grades - ${studentName}`);
            setOverlayData(data);
            setOverlayVisible(true);
        } catch (err) {
            alert(err.message);
        }
    };

    const fetchCollectiveGrades = async (studentId, studentName) => {
        try {
            const res = await fetch(`http://localhost:8080/students/${studentId}/semester/all/semesterGrades`);
            if (!res.ok) throw new Error('Failed to fetch collective semester grades');
            const data = await res.json();
            setOverlayTitle(`Collective Semester Grades - ${studentName}`);
            setOverlayData(data);
            setOverlayVisible(true);
        } catch (err) {
            alert(err.message);
        }
    };

    const closeOverlay = () => {
        setOverlayVisible(false);
        setOverlayData([]);
        setOverlayTitle('');
    };

    if (loading) return <div className="loading">Loading students...</div>;
    if (error) return <div className="error">Error: {error}</div>;

//     useEffect(() => {
//   console.log("OverlayData updated:", overlayData);
// }, [overlayData]);


    return (
        <div className="grades-container">

            {showAddGrades && selectedStudent && (
                <AddGrades
                    studentId={selectedStudent.id}
                    onClose={() => setShowAddGrades(false)}
                    refreshGrades={fetchStudents} // or whatever function fetches/reloads students & grades
                />
            )}

            <h1>Students & Grades</h1>
            <table className="grades-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Current Semester</th>
                        <th>Department</th>
                        <th>Actions</th>
                        <th>Add Grades</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student.student_id || student.id}>
                            <td>{student.name}</td>
                            <td>{student.current_semester}</td>
                            <td>{student.department}</td>
                            <td>
                                <button onClick={() => fetchPerformance(student.id || student.student_id, student.name)}>
                                    Fetch overall performance
                                </button>
                                <button onClick={() => fetchCurrentSemGrades(student.id || student.student_id, student.name, student.current_semester)}>
                                    Fetch Current Sem
                                </button>
                                <button onClick={() => fetchCollectiveGrades(student.id || student.student_id, student.name)}>
                                    Collective Grades
                                </button>
                            </td>
                            <td>
                                <button
                                    onClick={() => {
                                    setSelectedStudent(student);
                                    setShowAddGrades(true);
                                    }}
                                >
                                    Add Semester Grades
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {overlayVisible && (
                <div className="overlay">
                    <div className="overlay-content">
                        <h3>{overlayTitle}</h3>
                        <table className="overlay-table">
                            <thead>
                                <tr>
                                    {overlayData.length > 0 &&
                                        Object.keys(overlayData[0]).map((key) => <th key={key}>{key}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(overlayData) && overlayData.length > 0 ? (
                                    overlayData.map((row, idx) => (
                                    <tr key={idx}>
                                        {Object.values(row).map((val, i) => <td key={i}>{val}</td>)}
                                    </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="100%">No grades found</td></tr>
                                )}
                            </tbody>

                        </table>
                        <button onClick={closeOverlay}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}
