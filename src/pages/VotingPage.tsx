import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useProjectCount, useVoterInfo, useVote, useInitializeCredits } from '../hooks/useQuadraticVoting';
import { calculateCost, type ProjectMetadata } from '../utils/quadratic';
import ProjectCard from '../components/ProjectCard';
import './VotingPage.css';

export default function VotingPage() {
    const { isConnected } = useAccount();
    const { projectCount } = useProjectCount();
    const { credits, initialized, refetch: refetchVoterInfo } = useVoterInfo();
    const { initializeCredits, isPending: isInitializing, isSuccess: initSuccess } = useInitializeCredits();
    const { vote, isPending: isVoting, isSuccess: voteSuccess } = useVote();

    const [projects, setProjects] = useState<Array<{ id: number; metadata: ProjectMetadata | null }>>([]);
    const [votes, setVotes] = useState<Record<number, number>>({});
    const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);

    // Load projects
    useEffect(() => {
        const loadProjects = async () => {
            if (projectCount === 0) return;

            setIsLoadingMetadata(true);
            const projectsData: Array<{ id: number; metadata: ProjectMetadata | null }> = [];

            for (let i = 0; i < projectCount; i++) {
                projectsData.push({ id: i, metadata: null });
            }

            setProjects(projectsData);

            // Fetch metadata for each project
            for (let i = 0; i < projectCount; i++) {
                try {
                    await fetch(`${import.meta.env.VITE_CONTRACT_ADDRESS}/metadata/${i}`);
                    // This is a placeholder - in reality, you'd fetch from the contract
                    // For now, we'll use a mock
                    const mockMetadata: ProjectMetadata = {
                        name: `Project ${i + 1}`,
                        description: `Description for project ${i + 1}`,
                    };
                    projectsData[i].metadata = mockMetadata;
                } catch (error) {
                    console.error(`Failed to load metadata for project ${i}:`, error);
                }
            }

            setProjects([...projectsData]);
            setIsLoadingMetadata(false);
        };

        loadProjects();
    }, [projectCount]);

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
        // Submit votes for each project
        Object.entries(votes).forEach(([projectId, voteCount]) => {
            if (voteCount > 0) {
                vote(parseInt(projectId), voteCount);
            }
        });
    };

    const totalCost = Object.values(votes).reduce((sum, v) => sum + calculateCost(v), 0);
    const remainingCredits = credits - totalCost;
    const canSubmit = remainingCredits >= 0 && Object.values(votes).some(v => v > 0);

    if (!isConnected) {
        return (
            <div className="voting-page">
                <div className="connect-prompt">
                    <h2>Connect Your Wallet</h2>
                    <p>Please connect your wallet to start voting</p>
                </div>
            </div>
        );
    }

    if (!initialized) {
        return (
            <div className="voting-page">
                <div className="initialize-prompt">
                    <h2>Initialize Your Voting Credits</h2>
                    <p>You need to initialize your account to receive voting credits</p>
                    <button
                        onClick={initializeCredits}
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
            <div className="voting-header">
                <h2>Cast Your Votes</h2>
                <div className="credits-display">
                    <div className="credits-info">
                        <span className="credits-label">Available Credits:</span>
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
                <h3>How Quadratic Voting Works</h3>
                <p>
                    The cost of votes increases quadratically: 1 vote = 1 credit, 2 votes = 4 credits, 3 votes = 9 credits, etc.
                    This encourages you to spread your votes across multiple projects rather than concentrating on one.
                </p>
            </div>

            {projectCount === 0 ? (
                <div className="no-projects">
                    <p>No projects submitted yet. Be the first to submit a project!</p>
                </div>
            ) : (
                <>
                    <div className="projects-grid">
                        {projects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                projectId={project.id}
                                metadata={project.metadata}
                                currentVotes={votes[project.id] || 0}
                                onVoteChange={handleVoteChange}
                                showVoteInput={true}
                                isLoading={isLoadingMetadata}
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
                                Insufficient credits! Reduce your votes or remove some allocations.
                            </p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
