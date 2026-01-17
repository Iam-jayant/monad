import type { ProjectMetadata } from '../utils/quadratic';
import './ProjectCard.css';

interface ProjectCardProps {
    projectId: number;
    metadata: ProjectMetadata | null;
    votePower?: number;
    currentVotes?: number;
    onVoteChange?: (projectId: number, votes: number) => void;
    showVoteInput?: boolean;
    isLoading?: boolean;
}

export default function ProjectCard({
    projectId,
    metadata,
    votePower,
    currentVotes = 0,
    onVoteChange,
    showVoteInput = false,
    isLoading = false,
}: ProjectCardProps) {
    if (isLoading || !metadata) {
        return (
            <div className="project-card loading">
                <div className="skeleton-image"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text short"></div>
            </div>
        );
    }

    return (
        <div className="project-card">
            {metadata.thumbnail && (
                <div className="project-thumbnail">
                    <img src={metadata.thumbnail} alt={metadata.name} />
                </div>
            )}

            <div className="project-content">
                <h3 className="project-name">{metadata.name}</h3>
                <p className="project-description">{metadata.description}</p>

                {metadata.team?.teamName && (
                    <div className="project-team">
                        <span className="team-label">Team:</span> {metadata.team.teamName}
                        {metadata.team.members && metadata.team.members.length > 0 && (
                            <span className="team-members">
                                {' '}({metadata.team.members.join(', ')})
                            </span>
                        )}
                    </div>
                )}

                <div className="project-links">
                    {metadata.demoLink && (
                        <a href={metadata.demoLink} target="_blank" rel="noopener noreferrer" className="project-link">
                            🔗 Demo
                        </a>
                    )}
                    {metadata.videoLink && (
                        <a href={metadata.videoLink} target="_blank" rel="noopener noreferrer" className="project-link">
                            🎥 Video
                        </a>
                    )}
                    {metadata.repoLink && (
                        <a href={metadata.repoLink} target="_blank" rel="noopener noreferrer" className="project-link">
                            💻 Repo
                        </a>
                    )}
                    {metadata.readmeLink && (
                        <a href={metadata.readmeLink} target="_blank" rel="noopener noreferrer" className="project-link">
                            📖 README
                        </a>
                    )}
                </div>

                {votePower !== undefined && (
                    <div className="vote-power">
                        <span className="vote-power-label">Total Vote Power:</span>
                        <span className="vote-power-value">{votePower}</span>
                    </div>
                )}

                {showVoteInput && onVoteChange && (
                    <div className="vote-input-section">
                        <label htmlFor={`votes-${projectId}`} className="vote-label">
                            Your Votes:
                        </label>
                        <input
                            type="number"
                            id={`votes-${projectId}`}
                            min="0"
                            value={currentVotes}
                            onChange={(e) => onVoteChange(projectId, parseInt(e.target.value) || 0)}
                            className="vote-input"
                        />
                        <span className="vote-cost">
                            Cost: {currentVotes * currentVotes} credits
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
