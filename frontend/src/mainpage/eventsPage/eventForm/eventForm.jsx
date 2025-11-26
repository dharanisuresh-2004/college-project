import React, { useState } from 'react';
import './eventForm.css';

export default function EventForm({ onSubmit, initialData = {} }) {
    const [formData, setFormData] = useState({
        name: initialData.name || '',
        description: initialData.description || '',
        event_date: initialData.event_date || '',
        event_type: initialData.event_type || '',
        location: initialData.location || '',
        in_charge: initialData.in_charge || '',
        registration_needed: initialData.registration_needed || false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const dateAsInstant = new Date(formData.event_date)

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        onSubmit({...formData,event_date : dateAsInstant.toISOString()});
    };

    return (
        <form className="event-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="name">Event Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} />
            </div>

            <div className="form-group">
                <label htmlFor="eventDate">Event Date</label>
                <input type="date" id="eventDate" name="event_date" value={formData.event_date} onChange={handleChange} required />
            </div>

            <div className="form-group">
                <label htmlFor="eventType">Event Type</label>
                <input type="text" id="eventType" name="event_type" value={formData.event_type} onChange={handleChange} />
            </div>

            <div className="form-group">
                <label htmlFor="location">Location</label>
                <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} />
            </div>

            <div className="form-group">
                <label htmlFor="inCharge">In Charge</label>
                <input type="text" id="inCharge" name="in_charge" value={formData.in_charge} onChange={handleChange} />
            </div>

            <div className="form-group checkbox">
                <label htmlFor="registrationNeeded">Registration Needed</label>
                <input type="checkbox" id="registrationNeeded" name="registration_needed" checked={formData.registration_needed} onChange={handleChange} />
            </div>

            <button type="submit" className="submit-btn">Submit</button>
        </form>
    );
}