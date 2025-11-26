import React, { useState } from 'react';
import './eventsPage.css';
import EventForm from './eventForm/eventForm.jsx';
import EventsList from './eventsList/eventsList.jsx';

export default function EventsPage() {
    const [activeTab, setActiveTab] = useState('new');

    return (
        <div className="events-container">
            <div className="tabs-wrapper">
                <div className="tabs-header">
                    <button
                        className={`tab-button ${activeTab === 'new' ? 'active' : ''}`}
                        onClick={() => setActiveTab('new')}
                    >
                        Event List
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
                        onClick={() => setActiveTab('list')}
                        >
                        New Event
                    </button>
                </div>

                <div className="tabs-content" key={activeTab}>
                    {activeTab === 'new' && (
                        <div className="tab-pane">
                            <EventsList />                            
                        </div>
                    )}
                    {activeTab === 'list' && (
                        <div className="tab-pane">
                            <EventForm onSubmit={(data) => fetch('http://localhost:8080/events/', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(data)
                            })} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}