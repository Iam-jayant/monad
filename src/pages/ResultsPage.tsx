import { useState, useEffect } from 'react';
import { useProjectCount } from '../hooks/useQuadraticVoting';
import type { ProjectMetadata } from '../utils/quadratic';
import ProjectCard from '../components/ProjectCard';
import './ResultsPage.css';

interface ProjectResult {
    id: number;
    metadata: ProjectMetadata | null;
    votePower: number;
}

export default function ResultsPage() {
    const { projectCount } = useProjectCount();
    const [projects, setProjects] = useState<ProjectResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadResults = async () => {
            if (projectCount === 0) return;

            setIsLoading(true);
            const projectsData: ProjectResult[] = [];

            // Load all projects with their vote power
            for (let i = 0; i < projectCount; i++) {
                projectsData.push({
                    id: i,
                    metadata: null,
                    votePower: 0,
                });
            }

            setProjects(projectsData);

            // Fetch metadata and vote power for each project
            // Note: In a real app, you'd batch these requests or use a subgraph
            for (let i = 0; i < projectCount; i++) {
                try {
                    // Mock metadata for now
                    const mockMetadata: ProjectMetadata = {
                        name: `Project ${i + 1}`,
                        description: `Description for project ${i + 1}`,
                    };

                    projectsData[i].metadata = mockMetadata;
                    projectsData[i].votePower = Math.floor(Math.random() * 100); // Mock vote power
                } catch (error) {
                    console.error(`Failed to load data for project ${i}:`, error);
                }
            }

            // Sort by vote power (descending)
            projectsData.sort((a, b) => b.votePower - a.votePower);

            setProjects([...projectsData]);
            setIsLoading(false);
        };

        loadResults();
    }, [projectCount]);

    return (
        <div className="results-page">
            <div className="results-header">
                <h2>🏆 Leaderboard</h2>
                <p>Projects ranked by quadratic vote power</p>
            </div>

            {projectCount === 0 ? (
                <div className="no-results">
                    <p>No projects have been submitted yet.</p>
                </div>
            ) : (
                <div className="results-container">
                    <div className="results-list">
                        {projects.map((project, index) => (
                            <div key={project.id} className="result-item">
                                <div className="rank-badge">
                                    <span className="rank-number">#{index + 1}</span>
                                </div>
                                <div className="result-card">
                                    <ProjectCard
                                        projectId={project.id}
                                        metadata={project.metadata}
                                        votePower={project.votePower}
                                        isLoading={isLoading}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="results-info">
                        <h3>About Quadratic Voting</h3>
                        <p>
                            Vote power represents the total number of votes a project received,
                            not the total credits spent. This creates a more democratic outcome
                            where broad support is valued over concentrated voting.
                        </p>
                        <div className="example">
                            <h4>Example:</h4>
                            <ul>
                                <li>10 voters each giving 1 vote = 10 vote power (10 credits total)</li>
                                <li>1 voter giving 10 votes = 10 vote power (100 credits total)</li>
                            </ul>
                            <p>
                                Both scenarios result in the same vote power, but the first
                                requires much fewer credits, encouraging broader participation.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
