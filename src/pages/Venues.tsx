import { useEvents } from "@/context/EventContext";
// Removed unused imports
import { format, addDays, startOfToday } from "date-fns";

export default function VenuesPage() {
    const { venues, events } = useEvents();
    const today = startOfToday();
    const days = [0, 1, 2, 3, 4].map(d => addDays(today, d));

    const getEventsForVenueAndDay = (venueId: string, date: Date) => {
        return events.filter(e => {
            if (e.venueId !== venueId) return false;
            if (e.status === 'Rejected') return false;
            const eStart = new Date(e.start);
            return eStart.getDate() === date.getDate() && eStart.getMonth() === date.getMonth();
        });
    };

    return (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Venue Master Calendar</h2>
            <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                    <div className="grid grid-cols-[150px_1fr] border-b">
                        <div className="p-4 font-bold">Venue</div>
                        <div className="grid grid-cols-5">
                            {days.map(d => (
                                <div key={d.toString()} className="p-4 text-center border-l font-semibold">
                                    {format(d, 'EEE, MMM d')}
                                </div>
                            ))}
                        </div>
                    </div>
                    {venues.map(venue => (
                        <div key={venue.id} className="grid grid-cols-[150px_1fr] border-b hover:bg-muted/50">
                            <div className="p-4 font-medium flex flex-col justify-center">
                                {venue.name}
                                <span className="text-xs text-muted-foreground">Cap: {venue.capacity}</span>
                            </div>
                            <div className="grid grid-cols-5 h-24">
                                {days.map(d => {
                                    const venueEvents = getEventsForVenueAndDay(venue.id, d);
                                    return (
                                        <div key={d.toString()} className="border-l p-1 relative">
                                            {venueEvents.map(e => (
                                                <div
                                                    key={e.id}
                                                    className="text-xs p-1 rounded mb-1 truncate bg-primary/10 border border-primary/20 text-primary-foreground"
                                                    title={e.title}
                                                >
                                                    <span className="font-semibold text-foreground">{format(new Date(e.start), 'HH:mm')}</span> <span className="text-foreground">{e.title}</span>
                                                </div>
                                            ))}
                                            {venueEvents.length === 0 && (
                                                <div className="flex h-full items-center justify-center text-xs text-muted-foreground/30">
                                                    Available
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
