import { Button } from "@/components/ui/button";
import { MetricsCards } from "@/components/dashboard/MetricsCards";
import { VenueGrid } from "@/components/dashboard/VenueGrid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useRoleAccess } from "@/hooks/useRoleAccess";

export default function Dashboard() {
    const { role } = useAuth();
    const { visibleEvents, visibleVenues } = useRoleAccess();

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground mr-2">Viewing as: <span className="font-semibold text-primary">{role}</span></span>
                    <Button>Download Report</Button>
                </div>
            </div>

            <MetricsCards events={visibleEvents} venues={visibleVenues} resources={[]} />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <VenueGrid venues={visibleVenues} events={visibleEvents} />

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {visibleEvents.slice(0, 5).map(event => (
                                <div key={event.id} className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{event.title}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {event.status} - {event.venueId || 'No venue'}
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium">
                                        {/* Time placeholder */}
                                    </div>
                                </div>
                            ))}
                            {visibleEvents.length === 0 && <p className="text-muted-foreground text-sm">No recent activity</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

