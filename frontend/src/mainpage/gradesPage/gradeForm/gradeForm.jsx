import React, { useState, useEffect } from 'react';
import './gradeForm.css';

export default function AddGrades({ studentId, onClose, refreshGrades }) {
    const [semester, setSemester] = useState(1);
    const [grades, setGrades] = useState([{ subject: '', grade: '' }]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (index, field, value) => {
        const updated = [...grades];
        updated[index][field] = value;
        setGrades(updated);
    };

    const addRow = () => {
        setGrades([...grades, { subject: '', grade: '' }]);
    };

    const removeRow = (index) => {
        const updated = grades.filter((_, i) => i !== index);
        setGrades(updated);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            const payload = {};
            grades.forEach(g => {
                if (g.subject && g.grade) payload[g.subject] = g.grade;
            });
            // /students/{studentId}/semester/{currentSemester}/grades
            const response = await fetch(`http://localhost:8080/students/${studentId}/semester/${semester}/grades`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error('Failed to add grades');
            await response.json();
            refreshGrades(); // Refresh the grades table
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="overlay">
            <div className="overlay-content">
                <h3>Add Semester Grades</h3>
                
                <label>
                    Semester:
                    <select value={semester} onChange={e => setSemester(parseInt(e.target.value))}>
                        {[...Array(8)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                    </select>
                </label>

                <div className="grades-inputs">
                    {grades.map((g, idx) => (
                        <div key={idx} className="grade-row">
                            <input
                                type="text"
                                placeholder="Subject"
                                value={g.subject}
                                onChange={e => handleChange(idx, 'subject', e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Grade (S/A/B/C/D/E)"
                                value={g.grade}
                                onChange={e => handleChange(idx, 'grade', e.target.value)}
                            />
                            {grades.length > 1 && (
                                <button onClick={() => removeRow(idx)}>Remove</button>
                            )}
                        </div>
                    ))}
                </div>

                <button onClick={addRow}>Add Subject</button>
                <button onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
                {error && <p style={{color: 'red'}}>{error}</p>}
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}
