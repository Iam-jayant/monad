import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/wagmi';

/**
 * Hook to get voter information (credits and initialization status)
 */
export function useVoterInfo() {
    const { address } = useAccount();

    const { data, isLoading, refetch } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getVoterInfo',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
        },
    });

    return {
        credits: data ? Number(data[0]) : 0,
        initialized: data ? data[1] : false,
        isLoading,
        refetch,
    };
}

/**
 * Hook to initialize voter credits
 */
export function useInitializeCredits() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const initializeCredits = () => {
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'initializeCredits',
        });
    };

    return {
        initializeCredits,
        isPending,
        isConfirming,
        isSuccess,
        error,
        hash,
    };
}

/**
 * Hook to submit a new project
 */
export function useSubmitProject() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const submitProject = (metadataURI: string) => {
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'submitProject',
            args: [metadataURI],
        });
    };

    return {
        submitProject,
        isPending,
        isConfirming,
        isSuccess,
        error,
        hash,
    };
}

/**
 * Hook to vote for a project
 */
export function useVote() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const vote = (projectId: number, votes: number) => {
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'vote',
            args: [BigInt(projectId), BigInt(votes)],
        });
    };

    return {
        vote,
        isPending,
        isConfirming,
        isSuccess,
        error,
        hash,
    };
}

/**
 * Hook to get total project count
 */
export function useProjectCount() {
    const { data, isLoading, refetch } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'projectCount',
    });

    return {
        projectCount: data ? Number(data) : 0,
        isLoading,
        refetch,
    };
}

/**
 * Hook to get project metadata URI
 */
export function useProjectMetadata(projectId: number) {
    const { data, isLoading } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getProjectMetadata',
        args: [BigInt(projectId)],
        query: {
            enabled: projectId >= 0,
        },
    });

    return {
        metadataURI: data as string,
        isLoading,
    };
}

/**
 * Hook to get project vote power
 */
export function useProjectVotePower(projectId: number) {
    const { data, isLoading, refetch } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getProjectResult',
        args: [BigInt(projectId)],
        query: {
            enabled: projectId >= 0,
        },
    });

    return {
        votePower: data ? Number(data) : 0,
        isLoading,
        refetch,
    };
}

/**
 * Hook to get voter's votes for a specific project
 */
export function useVoterProjectVotes(projectId: number) {
    const { address } = useAccount();

    const { data, isLoading, refetch } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getVoterProjectVotes',
        args: address && projectId >= 0 ? [address, BigInt(projectId)] : undefined,
        query: {
            enabled: !!address && projectId >= 0,
        },
    });

    return {
        votes: data ? Number(data) : 0,
        isLoading,
        refetch,
    };
}

/**
 * Hook to get initial credits amount
 */
export function useInitialCredits() {
    const { data } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'INITIAL_CREDITS',
    });

    return {
        initialCredits: data ? Number(data) : 100,
    };
}
