import { useState } from 'react';
import { useCreateEvent } from '../hooks/useQuadraticVoting';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { createEvent, isPending, isSuccess, isConfirming, hash } = useCreateEvent();

    const [name, setName] = useState('');
    const [code, setCode] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !code) return;
        createEvent(name, code);
    };

    return (
        <div className="admin-container">
            <div className="admin-card">
                <h2>Create New Event</h2>
                <p className="admin-subtitle">Create a voting event and set a secret code for project submissions.</p>

                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-group">
                        <label>Event Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Monad Hackathon 2025"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Submission Code</label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Secret code for participants"
                            required
                        />
                        <span className="help-text">Share this code with participants to let them submit projects.</span>
                    </div>

                    <button type="submit" disabled={isPending || isConfirming} className="btn-primary">
                        {isPending ? 'Confirm in Wallet...' : isConfirming ? 'Creating Event...' : 'Create Event'}
                    </button>

                    {isSuccess && <div className="success-message">Event created successfully!</div>}
                    {hash && <div className="tx-hash">Tx: {hash.slice(0, 10)}...</div>}
                </form>
            </div>
        </div>
    );
}
