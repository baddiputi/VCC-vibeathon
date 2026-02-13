import { Role } from "@/context/AuthContext";

// Event Statuses
export type EventStatus = 'Submitted' | 'Pending HOD' | 'Pending Dean' | 'Pending Head' | 'Approved' | 'Rejected' | 'Running' | 'Completed';

// Event Execution States
export type EventExecutionState = 'Not Started' | 'In Progress' | 'Completed' | 'Cancelled';

// Resource Request Types
export type ResourceType = 'Equipment' | 'Facility' | 'Service' | 'Food' | 'ITC' | 'Accommodation';
export type ResourcePriority = 'Mandatory' | 'Optional';

// Resource Allocation with Enhanced Details
export interface ResourceAllocation {
    id: string;
    name: string;
    count: number;
    type: ResourceType;
    priority: ResourcePriority;
    allocated?: boolean; // Whether successfully allocated
}

// Food Service Request
export interface FoodServiceRequest {
    type: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
    participantCount: number;
    vegetarianCount?: number;
    nonVegetarianCount?: number;
    specialRequirements?: string;
}

// ITC Service Request
export interface ITCServiceRequest {
    wifiRequired: boolean;
    participantCount?: number;
    liveStreamingRequired: boolean;
    recordingRequired: boolean;
    technicalSupport: boolean;
}

// Hostel Accommodation Request
export interface HostelAccommodationRequest {
    maleCount: number;
    femaleCount: number;
    checkInDate: string;
    checkOutDate: string;
    purpose: string;
}

// Venue Preference (type, not specific venue)
export interface VenuePreference {
    type: 'Auditorium' | 'Seminar Hall' | 'Lab' | 'Open Ground' | 'Classroom';
    minCapacity: number;
    preferredFeatures?: string[]; // e.g., 'AC', 'Projector', 'Sound System'
}

// Event Modification Request
export interface EventModificationRequest {
    eventId: string;
    modifiedBy: Role;
    modificationDate: string;
    changes: {
        schedule?: { start: string; end: string };
        participantCount?: number;
        resources?: ResourceAllocation[];
        venuePreference?: VenuePreference;
    };
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected';
}

// Resource Unavailability Feedback
export interface ResourceUnavailabilityFeedback {
    resourceId: string;
    resourceName: string;
    requestedCount: number;
    availableCount: number;
    reason: string;
    timestamp: string;
}

// Post-Event Summary
export interface PostEventSummary {
    eventId: string;
    actualStartTime: string;
    actualEndTime: string;
    actualParticipantCount: number;
    allocatedResources: ResourceAllocation[];
    releasedResources: string[]; // IDs of released resources
    venueCondition: string;
    feedback?: string;
    coordinatorNotes?: string;
}

// Main Event Interface
export interface Event {
    id: string;
    title: string;
    type: string;
    description?: string;

    // Scheduling
    start: string; // ISO Date string
    end: string;

    // Venue
    venueId?: string; // Allocated venue (set by system)
    venuePreference: VenuePreference; // Requested by coordinator

    // Participants
    participantCount: number;

    // Resources
    mandatoryResources: ResourceAllocation[];
    optionalResources: ResourceAllocation[];

    // Additional Services
    foodService?: FoodServiceRequest;
    itcService?: ITCServiceRequest;
    hostelAccommodation?: HostelAccommodationRequest;

    // Workflow
    status: EventStatus;
    executionState: EventExecutionState;
    requesterRole: Role;
    requesterId: string; // Coordinator ID
    department?: string; // e.g., 'CSE', 'ECE' - for HOD scoping
    school?: string; // e.g., 'Engineering', 'Management' - for Dean scoping

    // Approval & Rejection
    rejectionReason?: string;
    approvalChain: {
        role: Role;
        action: 'Approved' | 'Rejected' | 'Pending';
        timestamp?: string;
        notes?: string;
    }[];

    // Modifications
    modificationRequests?: EventModificationRequest[];
    isModifiable: boolean; // Can be edited

    // Execution Tracking
    markedStartAt?: string;
    markedCompleteAt?: string;
    venueReleasedAt?: string;
    resourcesReleasedAt?: string;

    // Post-Event
    postEventSummary?: PostEventSummary;

    // Feedback
    unavailabilityFeedback?: ResourceUnavailabilityFeedback[];

    // Timestamps
    createdAt: string;
    updatedAt: string;
}

// Venue Interface
export interface Venue {
    id: string;
    name: string;
    capacity: number;
    type: 'Auditorium' | 'Seminar Hall' | 'Lab' | 'Open Ground' | 'Classroom';
    features: string[]; // e.g., ['AC', 'Projector', 'Sound System']
    location?: string;
    availability?: { date: string; isAvailable: boolean }[];
}

// Resource Item Interface
export interface ResourceItem {
    id: string;
    name: string;
    totalCapacity: number;
    allocated: number; // dynamically calculated
    type: ResourceType;
    description?: string;
    maintenanceStatus?: 'Available' | 'Under Maintenance' | 'Retired';
}
