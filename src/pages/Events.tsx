import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EventWizard } from "@/components/events/EventWizard";
import { ApprovalTimeline } from "@/components/events/ApprovalTimeline";
import { ApprovalActions } from "@/components/events/ApprovalActions";
import { ApprovalDialog } from "@/components/events/ApprovalDialog";
import { useState } from "react";
import { Event } from "@/types";
import { Dialog, DialogHeader, DialogTitle, DialogContent } from '@/components/ui/dialog';
import { Calendar, MapPin, Users, Sparkles } from "lucide-react";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { useEvents } from "@/context/EventContext";
import { useAuth } from "@/context/AuthContext";

export default function EventsPage() {
    const { approveEvent, rejectEvent, requestModification } = useEvents();
    const { role } = useAuth();
    const { visibleEvents, canCreateEvent, pendingApprovalEvents } = useRoleAccess();
    const [wizardOpen, setWizardOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
    const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | 'modify'>('approve');

    const handleApprovalAction = (action: 'approve' | 'reject' | 'modify', event: Event) => {
        setSelectedEvent(event);
        setApprovalAction(action);
        setApprovalDialogOpen(true);
    };

    const handleApprovalConfirm = (comment: string) => {
        if (!selectedEvent) return;

        if (approvalAction === 'approve') {
            approveEvent(selectedEvent.id, role, comment || '');
        } else if (approvalAction === 'reject') {
            rejectEvent(selectedEvent.id, role, comment);
        } else if (approvalAction === 'modify') {
            requestModification(selectedEvent.id, comment);
        }

        setApprovalDialogOpen(false);
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
                {canCreateEvent && (
                    <Button onClick={() => setWizardOpen(true)} size="lg" className="gap-2">
                        <Sparkles className="h-5 w-5" />
                        Initiate Event
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg: grid-cols-3 gap-6">
                {visibleEvents.map((event) => (
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

            {/* Pending Approvals Section */}
            {pendingApprovalEvents.length > 0 && (
                <div className="mt-8 space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900">Pending Your Approval ({pendingApprovalEvents.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pendingApprovalEvents.map((event) => (
                            <Card
                                key={event.id}
                                className="border-2 border-amber-300 bg-amber-50/50 shadow-lg cursor-pointer hover:shadow-xl transition-all"
                                onClick={() => setSelectedEvent(event)}
                            >
                                <CardHeader className="pb-3">
                                    <Badge variant="warning" className="w-fit">Pending Review</Badge>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <h4 className="font-bold text-lg">{event.title}</h4>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p className="flex items-center gap-2"><Calendar className="h-4 w-4" />{new Date(event.start).toLocaleDateString()}</p>
                                        <p className="flex items-center gap-2"><MapPin className="h-4 w-4" />{event.venueId}</p>
                                    </div>
                                    <div className="pt-2" onClick={(e) => e.stopPropagation()}>
                                        <ApprovalActions
                                            event={event}
                                            onApprove={() => handleApprovalAction('approve', event)}
                                            onReject={() => handleApprovalAction('reject', event)}
                                            onRequestModification={() => handleApprovalAction('modify', event)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            <EventWizard open={wizardOpen} onOpenChange={setWizardOpen} />

            {/* Approval Dialog */}
            <ApprovalDialog
                open={approvalDialogOpen}
                event={selectedEvent}
                action={approvalAction}
                onConfirm={handleApprovalConfirm}
                onCancel={() => setApprovalDialogOpen(false)}
            />

            {/* Event Details Dialog */}
            <Dialog open={!!selectedEvent && !approvalDialogOpen} onOpenChange={(o) => !o && setSelectedEvent(null)}>
                <DialogContent className="max-w-4xl">
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
                                    <ApprovalTimeline event={selectedEvent} />
                                    <div className="mt-4 pt-4 border-t">
                                        <ApprovalActions
                                            event={selectedEvent}
                                            onApprove={() => handleApprovalAction('approve', selectedEvent)}
                                            onReject={() => handleApprovalAction('reject', selectedEvent)}
                                            onRequestModification={() => handleApprovalAction('modify', selectedEvent)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
