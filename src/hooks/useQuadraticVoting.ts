import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/wagmi';

// Cast ABI to any to avoid strict type inference issues during refactor
const abi = CONTRACT_ABI as any;

// --- Event Hooks ---

export function useCreateEvent() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const createEvent = (name: string, code: string) => {
        writeContract({
            address: CONTRACT_ADDRESS,
            abi,
            functionName: 'createEvent',
            args: [name, code],
        });
    };

    return { createEvent, isPending, isConfirming, isSuccess, error, hash };
}

export function useNextEventId() {
    const { data } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: 'nextEventId',
    });
    return Number(data || 0);
}

export function useEvent(eventId: number) {
    const { data, isLoading } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: 'events',
        args: [BigInt(eventId)],
        query: { enabled: eventId > 0 },
    });

    // data from 'events' mapping returns: [name, admin, codeHash, isActive, projectCount]
    const eventData = data as [string, string, string, boolean, bigint] | undefined;

    return {
        event: eventData ? {
            name: eventData[0],
            admin: eventData[1],
            isActive: eventData[3],
            projectCount: Number(eventData[4])
        } : null,
        isLoading
    };
}

// --- Voter Hooks ---

export function useVoterInfo(eventId: number) {
    const { address } = useAccount();
    const { data, isLoading, refetch } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: 'getVoterInfo',
        args: eventId > 0 && address ? [BigInt(eventId), address] : undefined,
        query: { enabled: !!address && eventId > 0 },
    });

    const info = data as [bigint, boolean] | undefined;

    return {
        credits: info ? Number(info[0]) : 0,
        initialized: info ? info[1] : false,
        isLoading,
        refetch,
    };
}

export function useInitializeCredits() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const initializeCredits = (eventId: number) => {
        writeContract({
            address: CONTRACT_ADDRESS,
            abi,
            functionName: 'initializeCredits',
            args: [BigInt(eventId)],
        });
    };

    return { initializeCredits, isPending, isConfirming, isSuccess, error, hash };
}

// --- Project Submission ---

export function useSubmitProject() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const submitProject = (eventId: number, metadataURI: string, code: string) => {
        writeContract({
            address: CONTRACT_ADDRESS,
            abi,
            functionName: 'submitProject',
            args: [BigInt(eventId), metadataURI, code],
        });
    };

    return { submitProject, isPending, isConfirming, isSuccess, error, hash };
}

// --- Voting Hooks ---

export function useVote() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const vote = (eventId: number, projectId: number, votes: number) => {
        writeContract({
            address: CONTRACT_ADDRESS,
            abi,
            functionName: 'vote',
            args: [BigInt(eventId), BigInt(projectId), BigInt(votes)],
        });
    };

    return { vote, isPending, isConfirming, isSuccess, error, hash };
}

export function useProjectMetadata(eventId: number, projectId: number) {
    const { data, isLoading } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: 'getProjectMetadata',
        args: [BigInt(eventId), BigInt(projectId)],
        query: { enabled: eventId > 0 && projectId > 0 },
    });
    return { metadataURI: data as string, isLoading };
}

export function useEventProjectVotePower(eventId: number, projectId: number) {
    const { data, isLoading, refetch } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: 'eventProjectVotePower',
        args: [BigInt(eventId), BigInt(projectId)],
        query: { enabled: eventId > 0 && projectId > 0 },
    });
    return { votePower: data ? Number(data) : 0, isLoading, refetch };
}

export function useVoterProjectVotes(eventId: number, projectId: number) {
    const { address } = useAccount();
    const { data, isLoading, refetch } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: 'eventVoterProjectVotes',
        args: address && eventId > 0 && projectId > 0 ? [BigInt(eventId), address, BigInt(projectId)] : undefined,
        query: { enabled: !!address && eventId > 0 && projectId > 0 },
    });
    return { votes: data ? Number(data) : 0, isLoading, refetch };
}

export function useInitialCredits() {
    const { data } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: 'INITIAL_CREDITS',
    });
    return Number(data || 100);
}
