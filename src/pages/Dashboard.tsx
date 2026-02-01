import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNextEventId, useEvent } from '../hooks/useQuadraticVoting';
import './Dashboard.css';

function EventCard({ eventId }: { eventId: number }) {
    const { event, isLoading } = useEvent(eventId);

    if (isLoading || !event || !event.isActive) return null;

    return (
        <Link to={`/event/${eventId}`} className="event-card">
            <div className="event-info">
                <h3>{event.name}</h3>
                <span className="project-count">{event.projectCount} Projects</span>
            </div>
            <div className="event-arrow">→</div>
        </Link>
    );
}

export default function Dashboard() {
    const navigate = useNavigate();
    const [joinId, setJoinId] = useState('');
    const nextId = useNextEventId();

    // Fetch last 5 events (reverse order)
    const recentEvents = Array.from({ length: Math.min(5, nextId - 1) }, (_, i) => nextId - 1 - i).filter(id => id > 0);

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        if (joinId) navigate(`/event/${joinId}`);
    };

    return (
        <div className="dashboard-container">
            <div className="hero-section">
                <h1>Quadratic Voting Platform</h1>
                <p>Create events, submit projects, and vote using credits.</p>
                <div className="hero-actions">
                    <Link to="/admin/create" className="btn-primary">Create New Event</Link>
                </div>
            </div>

            <div className="join-section">
                <h2>Join Event</h2>
                <form onSubmit={handleJoin} className="join-form">
                    <input
                        type="number"
                        placeholder="Enter Event ID"
                        value={joinId}
                        onChange={(e) => setJoinId(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn-secondary">Go</button>
                </form>
            </div>

            <div className="events-list">
                <h2>Recent Events</h2>
                {recentEvents.length > 0 ? (
                    <div className="events-grid">
                        {recentEvents.map(id => (
                            <EventCard key={id} eventId={id} />
                        ))}
                    </div>
                ) : (
                    <p className="no-events">No events found. Create one to get started!</p>
                )}
            </div>
        </div>
    );
}
