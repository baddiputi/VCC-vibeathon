import { createContext, useContext, useState, ReactNode } from 'react';
import { Event, Venue, ResourceItem } from '@/types';
import { addHours, startOfToday } from 'date-fns';

// Mock Data Setup
const today = startOfToday();

const MOCK_VENUES: Venue[] = [
    { id: 'aud-1', name: 'Main Auditorium', capacity: 500, type: 'Auditorium', features: ['AC', 'Sound System', 'Projector', 'Stage'] },
    { id: 'sem-a', name: 'Seminar Hall A', capacity: 100, type: 'Seminar Hall', features: ['AC', 'Projector', 'Whiteboard'] },
    { id: 'sem-b', name: 'Seminar Hall B', capacity: 100, type: 'Seminar Hall', features: ['AC', 'Projector'] },
    { id: 'lab-a', name: 'Computer Lab A', capacity: 60, type: 'Lab', features: ['Computers', 'AC', 'Projector'] },
    { id: 'grd-1', name: 'College Ground', capacity: 2000, type: 'Open Ground', features: ['Open Air', 'Lighting'] },
];

const MOCK_RESOURCES: ResourceItem[] = [
    { id: 'mic', name: 'Wireless Microphones', totalCapacity: 40, allocated: 0, type: 'Equipment' },
    { id: 'proj', name: 'HD Projectors', totalCapacity: 20, allocated: 0, type: 'Equipment' },
    { id: 'chair', name: 'Plastic Chairs', totalCapacity: 500, allocated: 0, type: 'Facility' },
    { id: 'wifi', name: 'Dedicated Wi-Fi', totalCapacity: 5, allocated: 0, type: 'ITC' },
    { id: 'food', name: 'Catering Service', totalCapacity: 10, allocated: 0, type: 'Food' },
];

const MOCK_EVENTS: Event[] = [
    {
        id: 'evt-1',
        title: 'Robotics Workshop',
        type: 'Workshop',
        description: 'Hands-on robotics workshop',
        start: addHours(today, 10).toISOString(),
        end: addHours(today, 16).toISOString(),
        venueId: 'lab-a',
        venuePreference: { type: 'Lab', minCapacity: 50 },
        participantCount: 45,
        mandatoryResources: [
            { id: 'mic', name: 'Wireless Microphones', count: 2, type: 'Equipment', priority: 'Mandatory' },
            { id: 'proj', name: 'HD Projectors', count: 1, type: 'Equipment', priority: 'Mandatory' }
        ],
        optionalResources: [],
        status: 'Running',
        executionState: 'In Progress',
        requesterRole: 'Coordinator',
        requesterId: 'coord-1',
        department: 'Robotics Club',
        approvalChain: [
            { role: 'HOD', action: 'Approved', timestamp: addHours(today, -48).toISOString() },
            { role: 'Dean', action: 'Approved', timestamp: addHours(today, -24).toISOString() },
            { role: 'Head', action: 'Approved', timestamp: addHours(today, -12).toISOString() }
        ],
        isModifiable: false,
        markedStartAt: addHours(today, 10).toISOString(),
        createdAt: addHours(today, -72).toISOString(),
        updatedAt: addHours(today, 10).toISOString(),
    },
    {
        id: 'evt-2',
        title: 'Annual Cultural Night',
        type: 'Cultural',
        description: 'Annual cultural event',
        start: addHours(today, 40).toISOString(),
        end: addHours(today, 44).toISOString(),
        venueId: 'aud-1',
        venuePreference: { type: 'Auditorium', minCapacity: 400 },
        participantCount: 400,
        mandatoryResources: [
            { id: 'mic', name: 'Wireless Microphones', count: 10, type: 'Equipment', priority: 'Mandatory' }
        ],
        optionalResources: [],
        status: 'Pending Dean',
        executionState: 'Not Started',
        requesterRole: 'Coordinator',
        requesterId: 'coord-2',
        department: 'Student Council',
        approvalChain: [
            { role: 'HOD', action: 'Approved', timestamp: addHours(today, -12).toISOString() },
            { role: 'Dean', action: 'Pending' },
            { role: 'Head', action: 'Pending' }
        ],
        isModifiable: false,
        createdAt: addHours(today, -24).toISOString(),
        updatedAt: addHours(today, -12).toISOString(),
    },
    {
        id: 'evt-3',
        title: 'Gaming Fest',
        type: 'Competition',
        start: addHours(today, -24).toISOString(),
        end: addHours(today, -20).toISOString(),
        venuePreference: { type: 'Seminar Hall', minCapacity: 80 },
        participantCount: 80,
        mandatoryResources: [],
        optionalResources: [],
        status: 'Rejected',
        executionState: 'Cancelled',
        requesterRole: 'Coordinator',
        requesterId: 'coord-3',
        department: 'Esports Club',
        rejectionReason: 'Venue Double Booked with Faculty Meeting',
        approvalChain: [
            { role: 'HOD', action: 'Rejected', timestamp: addHours(today, -48).toISOString() }
        ],
        isModifiable: true,
        createdAt: addHours(today, -72).toISOString(),
        updatedAt: addHours(today, -48).toISOString(),
    },
];

interface EventContextType {
    events: Event[];
    venues: Venue[];
    resources: ResourceItem[];
    addEvent: (event: Event) => void;
    updateEventStatus: (id: string, status: Event['status'], reason?: string) => void;
    deleteEvent: (id: string) => void;
    markEventStart: (eventId: string) => void;
    markEventComplete: (eventId: string) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
    const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
    const [venues] = useState<Venue[]>(MOCK_VENUES);
    const [resources] = useState<ResourceItem[]>(MOCK_RESOURCES);

    const addEvent = (event: Event) => {
        setEvents((prev) => [...prev, event]);
    };

    const updateEventStatus = (id: string, status: Event['status'], reason?: string) => {
        setEvents((prev) =>
            prev.map((evt) =>
                evt.id === id ? { ...evt, status, rejectionReason: reason, updatedAt: new Date().toISOString() } : evt
            )
        );
    };

    const deleteEvent = (id: string) => {
        setEvents((prev) => prev.filter((evt) => evt.id !== id));
    };

    const markEventStart = (eventId: string) => {
        setEvents((prev) =>
            prev.map((evt) =>
                evt.id === eventId ? {
                    ...evt,
                    executionState: 'In Progress' as const,
                    markedStartAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                } : evt
            )
        );
    };

    const markEventComplete = (eventId: string) => {
        setEvents((prev) =>
            prev.map((evt) =>
                evt.id === eventId ? {
                    ...evt,
                    executionState: 'Completed' as const,
                    status: 'Completed',
                    markedCompleteAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                } : evt
            )
        );
    };

    return (
        <EventContext.Provider value={{
            events,
            venues,
            resources,
            addEvent,
            updateEventStatus,
            deleteEvent,
            markEventStart,
            markEventComplete
        }}>
            {children}
        </EventContext.Provider>
    );
};

export const useEvents = () => {
    const context = useContext(EventContext);
    if (!context) {
        throw new Error('useEvents must be used within an EventProvider');
    }
    return context;
};
