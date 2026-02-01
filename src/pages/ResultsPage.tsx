import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useReadContracts } from 'wagmi';
import { useEvent } from '../hooks/useQuadraticVoting';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/wagmi';
import ProjectCard from '../components/ProjectCard';
import './ResultsPage.css';

interface ProjectResult {
    id: number;
    votePower: number;
}

export default function ResultsPage() {
    const { id } = useParams<{ id: string }>();
    const eventId = Number(id);
    const { event, isLoading: eventLoading } = useEvent(eventId);

    // Construct contract calls for all projects
    const projectContracts = event && event.projectCount > 0
        ? Array.from({ length: event.projectCount }, (_, i) => ({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI as any,
            functionName: 'eventProjectVotePower',
            args: [BigInt(eventId), BigInt(i + 1)],
        }))
        : [];

    const { data: votePowers, isLoading: resultsLoading } = useReadContracts({
        contracts: projectContracts,
        query: {
            enabled: !!event && event.projectCount > 0,
            refetchInterval: 10000, // Live updates every 10s
        }
    });

    const [sortedProjects, setSortedProjects] = useState<ProjectResult[]>([]);

    useEffect(() => {
        if (!votePowers || !event) return;

        const results: ProjectResult[] = votePowers.map((result, index) => ({
            id: index + 1,
            votePower: result.result ? Number(result.result) : 0,
        }));

        // Sort descending
        results.sort((a, b) => b.votePower - a.votePower);
        setSortedProjects(results);
    }, [votePowers, event]);

    if (eventLoading) return <div className="results-page"><p>Loading event...</p></div>;
    if (!event) return <div className="results-page"><p>Event not found.</p></div>;

    const navLinks = (
        <div className="event-nav">
            <Link to={`/event/${eventId}`}>Vote</Link>
            <Link to={`/event/${eventId}/submit`}>Submit Project</Link>
            <Link to={`/event/${eventId}/results`} className="active">Results</Link>
        </div>
    );

    return (
        <div className="results-page">
            <div className="event-header">
                <h1>{event.name}</h1>
                {navLinks}
            </div>

            <div className="results-header">
                <h2>🏆 Leaderboard</h2>
                <p>Live rankings by quadratic vote power</p>
            </div>

            {event.projectCount === 0 ? (
                <div className="no-results">
                    <p>No projects submitted yet.</p>
                </div>
            ) : resultsLoading ? (
                <div className="loading-container"><p>Loading results...</p></div>
            ) : (
                <div className="results-container">
                    <div className="results-list">
                        {sortedProjects.map((project, index) => (
                            <div key={project.id} className="result-item">
                                <div className={`rank-badge rank-${index + 1}`}>
                                    <span className="rank-number">#{index + 1}</span>
                                </div>
                                <div className="result-card">
                                    <ProjectCard
                                        eventId={eventId}
                                        projectId={project.id}
                                        metadata={null} // Card will fetch it
                                        votePower={project.votePower}
                                        isLoading={false}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="results-info">
                        <h3>About Quadratic Scoring</h3>
                        <p>
                            Projects are ranked by "Vote Power", which is the sum of votes received.
                            The cost to cast these votes was quadratic (Cost = Votes²), ensuring fair representation.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
