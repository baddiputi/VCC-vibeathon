import { Button } from "@/components/ui/button";
import { useEvents } from "@/context/EventContext";
import { MetricsCards } from "@/components/dashboard/MetricsCards";
import { VenueGrid } from "@/components/dashboard/VenueGrid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
    const { events, venues, resources } = useEvents();
    const { role } = useAuth();

    // Role-based filtering
    let displayedVenues = venues;
    let displayedEvents = events;

    if (role === 'Coordinator') {
        // "If Role = Event Coordinator, only show status for their booked venue."
        // We filter events to only show those requested by Coordinator.
        displayedEvents = events.filter(e => e.requesterRole === 'Coordinator');

        // We filter venues to only show those relevant to the coordinator's events
        // OR we show all venues but they only see status for theirs?
        // The requirement says "only show status for their booked venue". 
        // Showing a grid of empty/gray venues and highlighting theirs seems best for "status".
        // But to keep it simple and strict:
        const myVenueIds = new Set(displayedEvents.map(e => e.venueId));
        if (myVenueIds.size > 0) {
            displayedVenues = venues.filter(v => myVenueIds.has(v.id));
        } else {
            // If no events, show all so they can see what is available? 
            // Or show none?
            // Let's show all venues so they know compatibility, but the GRID will likely show "Available" 
            // unless we filter the *occupancy* data.
            // The VenueGrid component derives status from `events` prop.
            // Since we passed `displayedEvents`, the Grid will only see THIS coordinator's events.
            // So other events won't mark venues as "Occupied". 
            // This fulfills "only show status for their booked venue" (i.e. they don't see others' bookings).
            // Perfect.
            displayedVenues = venues;
        }
    } else if (role === 'HOD') {
        // HOD see Department events. 
        // Mocking: Assume HOD sees everything for now or filter if we had Dept data.
        // We'll leave it as global for HOD in this demo unless specified.
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground mr-2">Viewing as: <span className="font-semibold text-primary">{role}</span></span>
                    <Button>Download Report</Button>
                </div>
            </div>

            <MetricsCards events={displayedEvents} venues={venues} resources={resources} />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <VenueGrid venues={displayedVenues} events={displayedEvents} />

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {displayedEvents.slice(0, 5).map(event => (
                                <div key={event.id} className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{event.title}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {event.status} - {event.venueId}
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium">
                                        {/* Time placeholder */}
                                    </div>
                                </div>
                            ))}
                            {displayedEvents.length === 0 && <p className="text-muted-foreground text-sm">No recent activity</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
