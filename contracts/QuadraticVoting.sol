// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title QuadraticVoting
 * @notice Multi-event Quadratic Voting platform optimized for Monad
 */
contract QuadraticVoting {
    // --- Constants ---
    uint256 public constant INITIAL_CREDITS = 100;

    // --- Structs ---
    struct Event {
        string name;
        address admin;
        bytes32 codeHash; // Hash of the secret code required to submit projects
        bool isActive;
        uint256 projectCount;
    }

    struct Project {
        uint256 id;
        uint256 eventId;
        address submitter;
        string metadataURI;
    }

    // --- State Variables ---

    // Auto-incrementing IDs
    uint256 public nextEventId = 1;

    // Event storage
    mapping(uint256 => Event) public events;

    // Project storage: eventId => projectId => Project
    mapping(uint256 => mapping(uint256 => Project)) public eventProjects;

    // Voter Credits: eventId => voter => credits
    mapping(uint256 => mapping(address => uint256)) public eventVoterCredits;
    mapping(uint256 => mapping(address => bool)) public eventVoterInitialized;

    // Votes: eventId => voter => projectId => votes
    mapping(uint256 => mapping(address => mapping(uint256 => uint256)))
        public eventVoterProjectVotes;

    // Aggregated Vote Power: eventId => projectId => totalPower
    mapping(uint256 => mapping(uint256 => uint256))
        public eventProjectVotePower;

    // --- Events ---
    event EventCreated(
        uint256 indexed eventId,
        string name,
        address indexed admin
    );
    event CreditsInitialized(
        uint256 indexed eventId,
        address indexed voter,
        uint256 credits
    );
    event ProjectSubmitted(
        uint256 indexed eventId,
        uint256 indexed projectId,
        address indexed submitter,
        string metadataURI
    );
    event VoteCast(
        uint256 indexed eventId,
        address indexed voter,
        uint256 indexed projectId,
        uint256 votes,
        uint256 cost
    );

    // --- Errors ---
    error InvalidEvent();
    error Unauthorized();
    error InvalidCode();
    error AlreadyInitialized();
    error InsufficientCredits();
    error InvalidProject();
    error EventNotActive();

    // --- Modifiers ---
    modifier validEvent(uint256 _eventId) {
        if (_eventId == 0 || _eventId >= nextEventId) revert InvalidEvent();
        if (!events[_eventId].isActive) revert EventNotActive();
        _;
    }

    // --- Core Functions ---

    /**
     * @notice Create a new voting event
     * @param _name Display name of the event
     * @param _code Secret code required for project submissions
     */
    function createEvent(
        string calldata _name,
        string calldata _code
    ) external {
        uint256 eventId = nextEventId++;

        events[eventId] = Event({
            name: _name,
            admin: msg.sender,
            codeHash: keccak256(abi.encodePacked(_code)),
            isActive: true,
            projectCount: 0
        });

        emit EventCreated(eventId, _name, msg.sender);
    }

    /**
     * @notice Initialize voting credits for a specific event
     * @param _eventId The event to join
     */
    function initializeCredits(uint256 _eventId) external validEvent(_eventId) {
        if (eventVoterInitialized[_eventId][msg.sender])
            revert AlreadyInitialized();

        eventVoterCredits[_eventId][msg.sender] = INITIAL_CREDITS;
        eventVoterInitialized[_eventId][msg.sender] = true;

        emit CreditsInitialized(_eventId, msg.sender, INITIAL_CREDITS);
    }

    /**
     * @notice Submit a project to an event
     * @param _eventId The event to submit to
     * @param _metadataURI IPFS URI of project metadata
     * @param _code Secret code provided by event admin
     */
    function submitProject(
        uint256 _eventId,
        string calldata _metadataURI,
        string calldata _code
    ) external validEvent(_eventId) {
        Event storage evt = events[_eventId];

        // Verify code
        if (keccak256(abi.encodePacked(_code)) != evt.codeHash)
            revert InvalidCode();

        uint256 projectId = ++evt.projectCount;

        eventProjects[_eventId][projectId] = Project({
            id: projectId,
            eventId: _eventId,
            submitter: msg.sender,
            metadataURI: _metadataURI
        });

        emit ProjectSubmitted(_eventId, projectId, msg.sender, _metadataURI);
    }

    /**
     * @notice Cast votes for a project
     * @param _eventId The event ID
     * @param _projectId The project ID within the event
     * @param _votes Desired total votes (replaces previous votes)
     */
    function vote(
        uint256 _eventId,
        uint256 _projectId,
        uint256 _votes
    ) external validEvent(_eventId) {
        if (_projectId == 0 || _projectId > events[_eventId].projectCount)
            revert InvalidProject();
        if (!eventVoterInitialized[_eventId][msg.sender]) revert Unauthorized();

        uint256 currentVotes = eventVoterProjectVotes[_eventId][msg.sender][
            _projectId
        ];
        uint256 currentCost = calculateCost(currentVotes);
        uint256 newCost = calculateCost(_votes);

        uint256 credits = eventVoterCredits[_eventId][msg.sender];

        // Refund precedent: add back current cost, check new cost
        // Simplified: credits + currentCost - newCost >= 0
        if (credits + currentCost < newCost) revert InsufficientCredits();

        // Update credits
        eventVoterCredits[_eventId][msg.sender] =
            credits +
            currentCost -
            newCost;

        // Update votes
        eventVoterProjectVotes[_eventId][msg.sender][_projectId] = _votes;

        // Update project total score (simple summation of votes)
        // Note: In QV, the score usually is Sum(sqrt(votes)) or just Sum(votes).
        // Let's store Sum(votes) as the "Vote Power" or "Points".
        // If we want the "Quadratic Result", strict QV is sum of square roots of votes?
        // No, strict QV: Cost = Votes^2. Result = Sum(Votes).
        // The "Voice Credit" is the scarce resource. The "Votes" are the output.
        // So we just sum the votes.

        if (_votes > currentVotes) {
            eventProjectVotePower[_eventId][_projectId] += (_votes -
                currentVotes);
        } else {
            eventProjectVotePower[_eventId][_projectId] -= (currentVotes -
                _votes);
        }

        emit VoteCast(_eventId, msg.sender, _projectId, _votes, newCost);
    }

    // --- View Functions ---

    function calculateCost(uint256 _votes) public pure returns (uint256) {
        return _votes * _votes;
    }

    function getProjectMetadata(
        uint256 _eventId,
        uint256 _projectId
    ) external view returns (string memory) {
        return eventProjects[_eventId][_projectId].metadataURI;
    }

    function getVoterInfo(
        uint256 _eventId,
        address _voter
    ) external view returns (uint256 credits, bool initialized) {
        return (
            eventVoterCredits[_eventId][_voter],
            eventVoterInitialized[_eventId][_voter]
        );
    }
}
