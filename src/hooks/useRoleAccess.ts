import { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useEvents } from '@/context/EventContext';
import { Event, Venue } from '@/types';

interface RoleAccessReturn {
    visibleEvents: Event[];
    visibleVenues: Venue[];
    canCreateEvent: boolean;
    canEditEvent: (event: Event) => boolean;
    canApproveEvent: (event: Event) => boolean;
    canManageResources: boolean;
    canManageVenues: boolean;
    pendingApprovalEvents: Event[];
}

export function useRoleAccess(): RoleAccessReturn {
    const { role, userId, department, school } = useAuth();
    const { events, venues } = useEvents();

    // Filter events based on role
    const visibleEvents = useMemo(() => {
        if (role === 'Coordinator') {
            // Coordinators see only their own events
            return events.filter(e => e.requesterId === userId);
        }
        if (role === 'HOD') {
            // HODs see all events from their department
            return events.filter(e => e.department === department);
        }
        if (role === 'Dean') {
            // Deans see all events from their school
            return events.filter(e => e.school === school);
        }
        // Head and Admin see all events
        return events;
    }, [role, events, userId, department, school]);

    // Filter venues based on role
    const visibleVenues = useMemo(() => {
        if (role === 'Coordinator') {
            // Coordinators see only venues allocated to their events
            const allocatedVenueIds = new Set(
                visibleEvents.map(e => e.venueId).filter(Boolean) as string[]
            );
            return venues.filter(v => allocatedVenueIds.has(v.id));
        }
        // All other roles see all venues
        return venues;
    }, [role, venues, visibleEvents]);

    // Permission checks
    const canCreateEvent = role === 'Coordinator';

    const canEditEvent = (event: Event): boolean => {
        if (role === 'Coordinator') {
            return event.requesterId === userId && event.isModifiable;
        }
        return false; // Only coordinators can edit events
    };

    const canApproveEvent = (event: Event): boolean => {
        if (role === 'HOD' && event.status === 'Pending HOD' && event.department === department) {
            return true;
        }
        if (role === 'Dean' && event.status === 'Pending Dean' && event.school === school) {
            return true;
        }
        if (role === 'Head' && event.status === 'Pending Head') {
            return true;
        }
        return false;
    };

    const canManageResources = role === 'Admin';
    const canManageVenues = role === 'Admin';

    // Filter pending approval events for current role
    const pendingApprovalEvents = useMemo(() => {
        if (role === 'HOD') {
            return visibleEvents.filter(e => e.status === 'Pending HOD');
        }
        if (role === 'Dean') {
            return visibleEvents.filter(e => e.status === 'Pending Dean');
        }
        if (role === 'Head') {
            return visibleEvents.filter(e => e.status === 'Pending Head');
        }
        return [];
    }, [role, visibleEvents]);

    return {
        visibleEvents,
        visibleVenues,
        canCreateEvent,
        canEditEvent,
        canApproveEvent,
        canManageResources,
        canManageVenues,
        pendingApprovalEvents
    };
}
