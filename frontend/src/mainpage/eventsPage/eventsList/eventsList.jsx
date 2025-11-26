import React, { useState, useEffect } from 'react';
import './eventsList.css';

export default function EventsList() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Overlay state
    const [showOverlay, setShowOverlay] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [studentId, setStudentId] = useState('');
    const [newInCharge, setNewInCharge] = useState('');
    const [students, setStudents] = useState([]);

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        fetchEvents();
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        const res = await fetch("http://localhost:8080/students/list/all");
        const data = await res.json();
        setStudents(data);
    };

    const fetchEvents = async () => {
        try {
            const response = await fetch('http://localhost:8080/events/');
            if (!response.ok) throw new Error('Failed to fetch events');
            const data = await response.json();
            setEvents(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Open overlay
    const openOverlay = (eventId) => {
        setSelectedEventId(eventId);
        setShowOverlay(true);
    };

    // Submit new in-charge
    const submitInchargeChange = async () => {
        await fetch(`http://localhost:8080/events/${selectedEventId}/${studentId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ in_charge: newInCharge }),
        });

        setShowOverlay(false);
        fetchEvents();
    };

    // Delete event
    const deleteEvent = async (eventId) => {
        await fetch(`http://localhost:8080/events/${eventId}/`, {
            method: "DELETE"
        });
        fetchEvents();
    };

    if (loading) return <div className="loading">Loading events...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="events-container">
            <h1>Events</h1>

            {/* Overlay Popup */}
            {showOverlay && (
                <div className="overlay">
                    <div className="overlay-content">
                        <h3>Edit In-Charge</h3>

                        <select
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            className="overlay-select"
                        >
                            <option value="">Select Student</option>
                            {students.map(s => (
                                <option key={s.id} value={s.id}>
                                    {s.name} - {s.id}
                                </option>
                            ))}
                        </select>


                        <input
                            type="text"
                            placeholder="New In-Charge Name"
                            value={newInCharge}
                            onChange={(e) => setNewInCharge(e.target.value)}
                        />

                        <button onClick={submitInchargeChange}>Submit</button>
                        <button onClick={() => setShowOverlay(false)}>Cancel</button>
                    </div>
                </div>
            )}

            <table className="events-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Location</th>
                        <th>In Charge</th>
                        <th>Registration</th>
                        <th>Edit In-Charge</th>
                        <th>Delete</th>
                    </tr>
                </thead>

                <tbody>
                    {events.map((event) => (
                        <tr key={event.id}>
                            <td>{event.id}</td>
                            <td>{event.name}</td>
                            <td>{event.description}</td>
                            <td>{new Date(event.event_date).toLocaleDateString()}</td>
                            <td>{event.event_type}</td>
                            <td>{event.location}</td>
                            <td>{event.in_charge}</td>
                            <td>{event.registration_needed ? 'Yes' : 'No'}</td>

                            {/* Edit In-Charge Button */}
                            <td>
                                <button onClick={() => openOverlay(event.id)}>
                                    Edit
                                </button>
                            </td>

                            {/* Delete Button */}
                            <td>
                                <button onClick={() => deleteEvent(event.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
