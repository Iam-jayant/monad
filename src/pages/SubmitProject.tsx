import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useSubmitProject } from '../hooks/useQuadraticVoting';
import type { ProjectMetadata } from '../utils/quadratic';
import './SubmitProject.css';

export default function SubmitProject() {
    const { isConnected } = useAccount();
    const { submitProject, isPending, isConfirming, isSuccess, hash } = useSubmitProject();

    const [formData, setFormData] = useState<ProjectMetadata>({
        name: '',
        description: '',
        thumbnail: '',
        demoLink: '',
        videoLink: '',
        repoLink: '',
        readmeLink: '',
        team: {
            teamName: '',
            members: [],
        },
    });

    const [teamMembersInput, setTeamMembersInput] = useState('');
    const [metadataURI, setMetadataURI] = useState('');
    const [useDirectURI, setUseDirectURI] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let uri = metadataURI;

        if (!useDirectURI) {
            // Create metadata JSON
            const metadata: ProjectMetadata = {
                ...formData,
                team: {
                    ...formData.team,
                    members: teamMembersInput
                        .split(',')
                        .map(m => m.trim())
                        .filter(m => m.length > 0),
                },
            };

            // In a real app, you would upload this to IPFS/Arweave
            // For MVP, we'll use a data URI or ask user to provide URI
            const jsonString = JSON.stringify(metadata, null, 2);
            uri = `data:application/json;base64,${btoa(jsonString)}`;

            console.log('Project Metadata:', metadata);
            console.log('Metadata URI:', uri);
        }

        if (!uri) {
            alert('Please provide a metadata URI or fill out the form');
            return;
        }

        submitProject(uri);
    };

    const handleInputChange = (field: keyof ProjectMetadata, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleTeamChange = (field: 'teamName', value: string) => {
        setFormData(prev => ({
            ...prev,
            team: {
                ...prev.team!,
                [field]: value,
            },
        }));
    };

    if (!isConnected) {
        return (
            <div className="submit-project-page">
                <div className="connect-prompt">
                    <h2>Connect Your Wallet</h2>
                    <p>Please connect your wallet to submit a project</p>
                </div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="submit-project-page">
                <div className="success-message">
                    <h2>✅ Project Submitted Successfully!</h2>
                    <p>Your project has been added to the voting pool.</p>
                    {hash && (
                        <p className="tx-hash">
                            Transaction: <code>{hash}</code>
                        </p>
                    )}
                    <button
                        onClick={() => window.location.href = '/'}
                        className="btn-primary"
                    >
                        Go to Voting
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="submit-project-page">
            <div className="submit-header">
                <h2>Submit Your Project</h2>
                <p>Share your project with the community for quadratic voting</p>
            </div>

            <div className="uri-toggle">
                <label className="toggle-label">
                    <input
                        type="checkbox"
                        checked={useDirectURI}
                        onChange={(e) => setUseDirectURI(e.target.checked)}
                    />
                    <span>I have a metadata URI (IPFS/Arweave)</span>
                </label>
            </div>

            <form onSubmit={handleSubmit} className="submit-form">
                {useDirectURI ? (
                    <div className="form-group">
                        <label htmlFor="metadataURI">Metadata URI *</label>
                        <input
                            type="text"
                            id="metadataURI"
                            value={metadataURI}
                            onChange={(e) => setMetadataURI(e.target.value)}
                            placeholder="ipfs://... or https://..."
                            required
                            className="form-input"
                        />
                        <small className="form-hint">
                            Provide an IPFS or Arweave URI containing your project metadata JSON
                        </small>
                    </div>
                ) : (
                    <>
                        <div className="form-group">
                            <label htmlFor="name">Project Name *</label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                required
                                className="form-input"
                                placeholder="My Awesome Project"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description *</label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                required
                                className="form-textarea"
                                rows={4}
                                placeholder="A brief description of your project..."
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="thumbnail">Thumbnail URL</label>
                            <input
                                type="url"
                                id="thumbnail"
                                value={formData.thumbnail}
                                onChange={(e) => handleInputChange('thumbnail', e.target.value)}
                                className="form-input"
                                placeholder="https://example.com/image.png"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="demoLink">Demo Link</label>
                                <input
                                    type="url"
                                    id="demoLink"
                                    value={formData.demoLink}
                                    onChange={(e) => handleInputChange('demoLink', e.target.value)}
                                    className="form-input"
                                    placeholder="https://demo.example.com"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="videoLink">Video Link</label>
                                <input
                                    type="url"
                                    id="videoLink"
                                    value={formData.videoLink}
                                    onChange={(e) => handleInputChange('videoLink', e.target.value)}
                                    className="form-input"
                                    placeholder="https://youtube.com/watch?v=..."
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="repoLink">Repository URL</label>
                                <input
                                    type="url"
                                    id="repoLink"
                                    value={formData.repoLink}
                                    onChange={(e) => handleInputChange('repoLink', e.target.value)}
                                    className="form-input"
                                    placeholder="https://github.com/user/repo"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="readmeLink">README Link</label>
                                <input
                                    type="url"
                                    id="readmeLink"
                                    value={formData.readmeLink}
                                    onChange={(e) => handleInputChange('readmeLink', e.target.value)}
                                    className="form-input"
                                    placeholder="https://github.com/user/repo#readme"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="teamName">Team Name</label>
                            <input
                                type="text"
                                id="teamName"
                                value={formData.team?.teamName || ''}
                                onChange={(e) => handleTeamChange('teamName', e.target.value)}
                                className="form-input"
                                placeholder="Team Awesome"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="teamMembers">Team Members</label>
                            <input
                                type="text"
                                id="teamMembers"
                                value={teamMembersInput}
                                onChange={(e) => setTeamMembersInput(e.target.value)}
                                className="form-input"
                                placeholder="Alice, Bob, Charlie (comma-separated)"
                            />
                            <small className="form-hint">
                                Enter team member names separated by commas
                            </small>
                        </div>
                    </>
                )}

                <div className="form-actions">
                    <button
                        type="submit"
                        disabled={isPending || isConfirming}
                        className="btn-primary btn-large"
                    >
                        {isPending || isConfirming ? 'Submitting...' : 'Submit Project'}
                    </button>
                </div>

                {isPending && <p className="status-message">Waiting for wallet confirmation...</p>}
                {isConfirming && <p className="status-message">Confirming transaction...</p>}
            </form>

            <div className="metadata-schema">
                <h3>Metadata JSON Schema</h3>
                <pre className="schema-code">
                    {`{
  "name": "Project Name",
  "description": "Short description",
  "thumbnail": "https://...",
  "demoLink": "https://...",
  "videoLink": "https://...",
  "repoLink": "https://...",
  "readmeLink": "https://...",
  "team": {
    "teamName": "Optional",
    "members": ["Alice", "Bob"]
  }
}`}
                </pre>
            </div>
        </div>
    );
}
