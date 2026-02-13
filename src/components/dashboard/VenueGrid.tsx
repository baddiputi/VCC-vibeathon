import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Event, Venue } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MapPin, Users } from "lucide-react";

interface VenueGridProps {
    venues: Venue[];
    events: Event[];
}

export function VenueGrid({ venues, events }: VenueGridProps) {
    const getVenueStatus = (venueId: string) => {
        const activeEvent = events.find(e => e.venueId === venueId && e.status === 'Running');
        if (activeEvent) return { status: 'Occupied', event: activeEvent };

        const upcomingEvent = events.find(e => e.venueId === venueId && e.status === 'Approved');
        if (upcomingEvent) return { status: 'Reserved', event: upcomingEvent };

        return { status: 'Available', event: null };
    };

    return (
        <Card className="col-span-4 border-none shadow-xl bg-gradient-to-br from-white to-blue-50/50">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Live Campus Venue Map
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {venues.map(venue => {
                        const { status, event } = getVenueStatus(venue.id);
                        return (
                            <div
                                key={venue.id}
                                className={cn(
                                    "group p-5 rounded-xl border-2 transition-all duration-300 flex flex-col justify-between h-[140px] relative overflow-hidden hover:shadow-2xl hover:scale-105 cursor-pointer",
                                    status === 'Occupied'
                                        ? "border-rose-400 bg-gradient-to-br from-rose-50 to-pink-100 hover:from-rose-100 hover:to-pink-200"
                                        : status === 'Reserved'
                                            ? "border-amber-400 bg-gradient-to-br from-amber-50 to-orange-100 hover:from-amber-100 hover:to-orange-200"
                                            : "border-emerald-400 bg-gradient-to-br from-emerald-50 to-green-100 hover:from-emerald-100 hover:to-green-200"
                                )}
                            >
                                <div className="absolute top-0 right-0 -mt-8 -mr-8 h-24 w-24 rounded-full bg-white/30 blur-2xl" />
                                <div className="flex justify-between items-start relative z-10">
                                    <div>
                                        <h4 className="font-bold text-gray-900">{venue.name}</h4>
                                        <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                                            <Users className="h-3 w-3" />
                                            Cap: {venue.capacity}
                                        </p>
                                    </div>
                                    <Badge
                                        variant={status === 'Occupied' ? 'destructive' : status === 'Reserved' ? 'warning' : 'success'}
                                        className="shadow-lg"
                                    >
                                        {status}
                                    </Badge>
                                </div>

                                {event ? (
                                    <div className="text-sm mt-2 relative z-10 bg-white/60 backdrop-blur-sm p-2 rounded-md">
                                        <p className="font-semibold truncate text-gray-900">{event.title}</p>
                                        <p className="text-xs text-gray-700">{event.type}</p>
                                    </div>
                                ) : (
                                    <div className="text-sm mt-auto opacity-70 relative z-10">
                                        <span className="text-emerald-700 font-medium">Ready for booking</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
