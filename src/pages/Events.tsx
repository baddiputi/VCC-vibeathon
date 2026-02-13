import { Button } from "@/components/ui/button";
import { useEvents } from "@/context/EventContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EventWizard } from "@/components/events/EventWizard";
import { ApprovalTimeline } from "@/components/events/ApprovalTimeline";
import { useState } from "react";
import { Event } from "@/types";
import { Dialog, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, MapPin, Users, Sparkles } from "lucide-react";

export default function EventsPage() {
    const { events, updateEventStatus } = useEvents();
    const [wizardOpen, setWizardOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    const handleApprove = (event: Event) => {
        let nextStatus = event.status;
        if (event.status === 'Submitted') nextStatus = 'Pending HOD';
        else if (event.status === 'Pending HOD') nextStatus = 'Pending Dean';
        else if (event.status === 'Pending Dean') nextStatus = 'Pending Head';
        else if (event.status === 'Pending Head') nextStatus = 'Approved';

        updateEventStatus(event.id, nextStatus as Event['status']);
        setSelectedEvent(null);
    };

    const handleReject = (event: Event, reason: string) => {
        updateEventStatus(event.id, 'Rejected', reason);
        setSelectedEvent(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
                        <Calendar className="h-6 w-6" />
                    </div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Event Requests</h2>
                </div>
                <Button onClick={() => setWizardOpen(true)} size="lg" className="gap-2">
                    <Sparkles className="h-5 w-5" />
                    Initiate Event
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <Card
                        key={event.id}
                        className="group cursor-pointer border-none shadow-xl bg-gradient-to-br from-white to-blue-50/30 hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
                        onClick={() => setSelectedEvent(event)}
                    >
                        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-blue-400/10 blur-2xl group-hover:bg-blue-400/20 transition-all" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <Badge variant={
                                event.status === 'Approved' || event.status === 'Running' ? 'success' :
                                    event.status === 'Rejected' ? 'destructive' : 'warning'
                            } className="shadow-md">
                                {event.status}
                            </Badge>
                            <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(event.start).toLocaleDateString()}
                            </span>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-700 transition-colors">{event.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="h-4 w-4 text-blue-600" />
                                <span>{event.venueId}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">{event.requesterRole}</span>
                                <span className="text-xs text-gray-600 flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {event.participantCount}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <EventWizard open={wizardOpen} onOpenChange={setWizardOpen} />

            <Dialog open={!!selectedEvent} onOpenChange={(o) => !o && setSelectedEvent(null)}>
                <DialogHeader>
                    <DialogTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{selectedEvent?.title}</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    {selectedEvent && (
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <h4 className="font-bold text-lg border-b pb-2">Event Details</h4>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500 w-24">Type:</span>
                                        <Badge variant="outline">{selectedEvent.type}</Badge>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-gray-500 w-24">Schedule:</span>
                                        <div>
                                            <p>{new Date(selectedEvent.start).toLocaleString()}</p>
                                            <p className="text-xs text-gray-400">to {new Date(selectedEvent.end).toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500 w-24">Venue:</span>
                                        <span className="font-medium">{selectedEvent.venueId}</span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <span className="text-gray-500 w-full font-semibold">Resources:</span>
                                        <div className="space-y-1">
                                            {selectedEvent.mandatoryResources.length > 0 && (
                                                <div>
                                                    <Badge variant="destructive" className="text-xs mr-2">Mandatory</Badge>
                                                    <span className="text-xs">{selectedEvent.mandatoryResources.map(r => `${r.name} (${r.count})`).join(', ')}</span>
                                                </div>
                                            )}
                                            {selectedEvent.optionalResources.length > 0 && (
                                                <div>
                                                    <Badge variant="secondary" className="text-xs mr-2">Optional</Badge>
                                                    <span className="text-xs">{selectedEvent.optionalResources.map(r => `${r.name} (${r.count})`).join(', ')}</span>
                                                </div>
                                            )}
                                            {selectedEvent.mandatoryResources.length === 0 && selectedEvent.optionalResources.length === 0 && (
                                                <span className="text-xs text-gray-400">None requested</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg border-b pb-2 mb-4">Approval Workflow</h4>
                                <ApprovalTimeline
                                    event={selectedEvent}
                                    onApprove={() => handleApprove(selectedEvent)}
                                    onReject={(r) => handleReject(selectedEvent, r)}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </Dialog>
        </div>
    );
}
