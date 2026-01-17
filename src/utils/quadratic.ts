/**
 * Calculate the quadratic cost for a given number of votes
 * Formula: cost = votes²
 */
export function calculateCost(votes: number): number {
    return votes * votes;
}

/**
 * Calculate the maximum number of votes possible with given credits
 * Formula: maxVotes = √credits
 */
export function calculateMaxVotes(credits: number): number {
    return Math.floor(Math.sqrt(credits));
}

/**
 * Validate if a vote distribution is valid given total credits
 * @param votes Record of projectId to number of votes
 * @param totalCredits Total credits available
 * @returns true if valid, false otherwise
 */
export function validateVoteDistribution(
    votes: Record<number, number>,
    totalCredits: number
): boolean {
    const totalCost = Object.values(votes).reduce(
        (sum, v) => sum + calculateCost(v),
        0
    );
    return totalCost <= totalCredits;
}

/**
 * Calculate remaining credits after allocating votes
 */
export function calculateRemainingCredits(
    votes: Record<number, number>,
    totalCredits: number
): number {
    const totalCost = Object.values(votes).reduce(
        (sum, v) => sum + calculateCost(v),
        0
    );
    return totalCredits - totalCost;
}

/**
 * Format address for display (0x1234...5678)
 */
export function formatAddress(address: string): string {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Parse project metadata from JSON string
 */
export interface ProjectMetadata {
    name: string;
    description: string;
    thumbnail?: string;
    demoLink?: string;
    videoLink?: string;
    repoLink?: string;
    readmeLink?: string;
    team?: {
        teamName?: string;
        members?: string[];
    };
}

export async function fetchProjectMetadata(uri: string): Promise<ProjectMetadata | null> {
    try {
        // Handle IPFS URIs
        let fetchUrl = uri;
        if (uri.startsWith('ipfs://')) {
            fetchUrl = `https://ipfs.io/ipfs/${uri.slice(7)}`;
        }

        const response = await fetch(fetchUrl);
        if (!response.ok) {
            console.error('Failed to fetch metadata:', response.statusText);
            return null;
        }

        const data = await response.json();
        return data as ProjectMetadata;
    } catch (error) {
        console.error('Error fetching project metadata:', error);
        return null;
    }
}
