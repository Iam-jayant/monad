import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useParams, Link } from 'react-router-dom';
import { useEvent, useVoterInfo, useVote, useInitializeCredits } from '../hooks/useQuadraticVoting';
import { calculateCost, type ProjectMetadata, fetchProjectMetadata } from '../utils/quadratic';
import ProjectCard from '../components/ProjectCard';
import './VotingPage.css';

export default function VotingPage() {
    const { id } = useParams<{ id: string }>();
    const eventId = Number(id);
    const { isConnected } = useAccount();
    const { event, isLoading: eventLoading } = useEvent(eventId);
    const { credits, initialized, refetch: refetchVoterInfo } = useVoterInfo(eventId);
    const { initializeCredits, isPending: isInitializing, isSuccess: initSuccess } = useInitializeCredits();
    const { vote, isPending: isVoting, isSuccess: voteSuccess } = useVote();

    const [projects, setProjects] = useState<Array<{ id: number; metadata: ProjectMetadata | null }>>([]);
    const [votes, setVotes] = useState<Record<number, number>>({});
    const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);

    // Load projects
    useEffect(() => {
        const loadProjects = async () => {
            if (!event || event.projectCount === 0) {
                setProjects([]);
                return;
            }

            setIsLoadingMetadata(true);
            const projectsData: Array<{ id: number; metadata: ProjectMetadata | null }> = [];

            // Initialize placeholders
            for (let i = 1; i <= event.projectCount; i++) {
                projectsData.push({ id: i, metadata: null });
            }
            setProjects([...projectsData]);

            // Fetch metadata
            // Note: In a real app we would use useProjectMetadata hook efficiently or multicall.
            // Here we iterate. Optimisation: Use Promise.all
            // But we need the URI from contract first.
            // Since we don't have a "getAllProjects" function, we rely on individual fetches or knowing the URIs.
            // Previous code used a mock or direct fetch. 
            // We'll update ProjectCard to handle its own metadata fetch or do it here.
            // Let's rely on ProjectCard fetching metadata via the hook to avoid complex logic here,
            // OR fetch properly here. Since useProjectMetadata is a hook, we can't call it in loop.
            // We should assume ProjectCard handles metadata fetching using the hook given itemId.
            // So we just pass IDs.

            setIsLoadingMetadata(false);
        };

        if (event) loadProjects();
    }, [event?.projectCount, event]);

    // Refetch voter info after initialization
    useEffect(() => {
        if (initSuccess) {
            refetchVoterInfo();
        }
    }, [initSuccess, refetchVoterInfo]);

    // Refetch after voting
    useEffect(() => {
        if (voteSuccess) {
            refetchVoterInfo();
            setVotes({});
        }
    }, [voteSuccess, refetchVoterInfo]);

    const handleVoteChange = (projectId: number, newVotes: number) => {
        setVotes(prev => ({
            ...prev,
            [projectId]: newVotes,
        }));
    };

    const handleSubmitVotes = () => {
        Object.entries(votes).forEach(([projectId, voteCount]) => {
            if (voteCount > 0) {
                vote(eventId, parseInt(projectId), voteCount);
            }
        });
    };

    const totalCost = Object.values(votes).reduce((sum, v) => sum + calculateCost(v), 0);
    const remainingCredits = credits - totalCost;
    const canSubmit = remainingCredits >= 0 && Object.values(votes).some(v => v > 0);

    if (eventLoading) return <div className="voting-page"><p>Loading event...</p></div>;
    if (!event) return <div className="voting-page"><p>Event not found.</p></div>;

    const navLinks = (
        <div className="event-nav">
            <Link to={`/event/${eventId}`} className="active">Vote</Link>
            <Link to={`/event/${eventId}/submit`}>Submit Project</Link>
            <Link to={`/event/${eventId}/results`}>Results</Link>
        </div>
    );

    if (!isConnected) {
        return (
            <div className="voting-page">
                <h1>{event.name}</h1>
                {navLinks}
                <div className="connect-prompt">
                    <h2>Connect Your Wallet</h2>
                    <p>Please connect your wallet to participate in {event.name}</p>
                </div>
            </div>
        );
    }

    if (!initialized) {
        return (
            <div className="voting-page">
                <h1>{event.name}</h1>
                {navLinks}
                <div className="initialize-prompt">
                    <h2>Initialize Your Voting Credits</h2>
                    <p>You need to initialize your account to receive voting credits for this event.</p>
                    <button
                        onClick={() => initializeCredits(eventId)}
                        disabled={isInitializing}
                        className="btn-primary"
                    >
                        {isInitializing ? 'Initializing...' : 'Initialize Credits'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="voting-page">
            <div className="event-header">
                <h1>{event.name}</h1>
                {navLinks}
            </div>

            <div className="voting-header">
                <h2>Cast Your Votes</h2>
                <div className="credits-display">
                    <div className="credits-info">
                        <span className="credits-label">Available:</span>
                        <span className="credits-value">{credits}</span>
                    </div>
                    <div className="credits-info">
                        <span className="credits-label">Cost:</span>
                        <span className={`credits-value ${totalCost > credits ? 'error' : ''}`}>
                            {totalCost}
                        </span>
                    </div>
                    <div className="credits-info">
                        <span className="credits-label">Remaining:</span>
                        <span className={`credits-value ${remainingCredits < 0 ? 'error' : ''}`}>
                            {remainingCredits}
                        </span>
                    </div>
                </div>
            </div>

            <div className="quadratic-explainer">
                <p>
                    1 vote = 1 credit, 2 votes = 4 credits, 3 votes = 9 credits. Spread your votes!
                </p>
            </div>

            {event.projectCount === 0 ? (
                <div className="no-projects">
                    <p>No projects yet. <Link to={`/event/${eventId}/submit`}>Submit one!</Link></p>
                </div>
            ) : (
                <>
                    <div className="projects-grid">
                        {Array.from({ length: event.projectCount }, (_, i) => i + 1).map((projectId) => (
                            <ProjectCard
                                key={projectId}
                                eventId={eventId}
                                projectId={projectId}
                                metadata={null} // ProjectCard will fetch
                                currentVotes={votes[projectId] || 0}
                                onVoteChange={handleVoteChange}
                                showVoteInput={true}
                                isLoading={false}
                            />
                        ))}
                    </div>

                    <div className="voting-actions">
                        <button
                            onClick={handleSubmitVotes}
                            disabled={!canSubmit || isVoting}
                            className="btn-primary btn-large"
                        >
                            {isVoting ? 'Submitting Votes...' : 'Submit Votes'}
                        </button>
                        {remainingCredits < 0 && (
                            <p className="error-message">
                                Insufficient credits!
                            </p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
