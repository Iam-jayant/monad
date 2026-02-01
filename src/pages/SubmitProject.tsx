import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useParams, useNavigate } from 'react-router-dom';
import { useSubmitProject } from '../hooks/useQuadraticVoting';
import type { ProjectMetadata } from '../utils/quadratic';
import { uploadFileToIPFS, uploadJSONToIPFS } from '../utils/ipfs';
import './SubmitProject.css';

export default function SubmitProject() {
    const { id } = useParams<{ id: string }>();
    const eventId = Number(id);
    const navigate = useNavigate();
    const { isConnected } = useAccount();
    const { submitProject, isPending: isTxPending, isConfirming, isSuccess, hash } = useSubmitProject();

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<string>('');
    const [eventCode, setEventCode] = useState('');

    const [formData, setFormData] = useState<ProjectMetadata>({
        name: '',
        description: '',
        thumbnail: '',
        siteLink: '', // was demoLink
        videoLink: '',
        repoLink: '',
        readmeLink: '',
        team: {
            teamName: '',
            members: [],
        },
    });

    const [teamMembersInput, setTeamMembersInput] = useState('');

    const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFile) {
            alert('Please select a thumbnail image');
            return;
        }

        if (!eventCode) {
            alert('Please enter the Event Code');
            return;
        }

        if (!formData.repoLink) {
            alert('Repository Link is mandatory');
            return;
        }

        setIsUploading(true);
        setUploadStatus('Uploading thumbnail to IPFS...');

        try {
            const imageIpfsUrl = await uploadFileToIPFS(selectedFile);
            setUploadStatus('Image uploaded! preparing metadata...');

            const metadata: ProjectMetadata = {
                ...formData,
                thumbnail: imageIpfsUrl,
                team: {
                    ...formData.team,
                    members: teamMembersInput
                        .split(',')
                        .map(m => m.trim())
                        .filter(m => m.length > 0),
                },
            };

            setUploadStatus('Uploading metadata to IPFS...');
            const metadataIpfsUrl = await uploadJSONToIPFS(metadata);

            setUploadStatus('Waiting for wallet signature...');
            submitProject(eventId, metadataIpfsUrl, eventCode);

        } catch (error) {
            console.error('Submission failed:', error);
            setUploadStatus('Upload failed. Please try again.');
            alert('Failed to upload to IPFS or submit transaction.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleInputChange = (field: keyof ProjectMetadata, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
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
                    {hash && <p className="tx-hash">Tx: <code>{hash}</code></p>}
                    <button onClick={() => navigate(`/event/${eventId}`)} className="btn-primary">
                        Return to Event
                    </button>
                </div>
            </div>
        );
    }

    const isPending = isUploading || isTxPending || isConfirming;

    return (
        <div className="submit-project-page">
            <div className="submit-header">
                <h2>Submit Project (Event #{id})</h2>
                <p>Fill in the details below. You need the Event Code from the organizer.</p>
            </div>

            <form onSubmit={handleSubmit} className="submit-form">

                <div className="form-group highlight-group">
                    <label htmlFor="eventCode">Event Access Code *</label>
                    <input
                        type="text"
                        id="eventCode"
                        value={eventCode}
                        onChange={(e) => setEventCode(e.target.value)}
                        required
                        className="form-input code-input"
                        placeholder="Enter the secret code for this event"
                    />
                </div>

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
                        placeholder="Brief description..."
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="thumbnail">Thumbnail Image *</label>
                    <input
                        type="file"
                        id="thumbnail"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        className="form-input"
                        required
                    />
                    {previewUrl && (
                        <div className="thumbnail-preview">
                            <img src={previewUrl} alt="Preview" />
                        </div>
                    )}
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="siteLink">Site URL</label>
                        <input
                            type="url"
                            id="siteLink"
                            value={formData.siteLink}
                            onChange={(e) => handleInputChange('siteLink', e.target.value)}
                            className="form-input"
                            placeholder="https://mysite.com"
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
                            placeholder="https://youtube.com/..."
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="repoLink">Repository URL *</label>
                        <input
                            type="url"
                            id="repoLink"
                            value={formData.repoLink}
                            onChange={(e) => handleInputChange('repoLink', e.target.value)}
                            className="form-input"
                            required
                            placeholder="https://github.com/..."
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
                            placeholder="https://github.com/..."
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
                        placeholder="Alice, Bob..."
                    />
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="btn-primary btn-large"
                    >
                        {isPending ? (uploadStatus || 'Processing...') : 'Submit Project'}
                    </button>
                    <button type="button" onClick={() => navigate(`/event/${eventId}`)} className="btn-secondary">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
