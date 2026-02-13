import { useState } from 'react';
import { Dialog, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useEvents } from '@/context/EventContext';
import { useAuth } from '@/context/AuthContext';
import { Event, ResourceAllocation } from '@/types';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Simplified for prototype
const EVENT_TYPES = ['Workshop', 'Seminar', 'Cultural', 'Meeting', 'Guest Lecture'];

interface EventWizardProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EventWizard({ open, onOpenChange }: EventWizardProps) {
    const { venues, resources, events, addEvent } = useEvents();
    const { role } = useAuth();
    const [step, setStep] = useState(1);

    // Form State
    const [title, setTitle] = useState('');
    const [type, setType] = useState(EVENT_TYPES[0]);
    const [participants, setParticipants] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedVenue, setSelectedVenue] = useState('');
    const [selectedResources, setSelectedResources] = useState<ResourceAllocation[]>([]);

    // Computed Checks
    const isConflict = () => {
        if (!selectedVenue || !startDate || !endDate) return false;
        // Simple overlap check
        const start = new Date(startDate);
        const end = new Date(endDate);

        return events.some(e => {
            if (e.venueId !== selectedVenue) return false;
            // Only consider Approved or Running events for hard conflicts, 
            // but for "Warning" maybe check Pending too.
            // Requirement: "Show 'Conflict' warning text immediately if the date overlaps with an existing confirmed event."
            if (e.status === 'Rejected' || e.status === 'Completed') return false;

            const eStart = new Date(e.start);
            const eEnd = new Date(e.end);
            return (start < eEnd && end > eStart);
        });
    }

    const getResourceError = (resId: string, count: number) => {
        const res = resources.find(r => r.id === resId);
        if (!res) return null;
        if (count > res.totalCapacity) return "Hard capacity limit exceeded";
        return null; // For prototype, we assume static global availability for now
    }

    const handleResourceChange = (resId: string, count: number) => {
        setSelectedResources(prev => {
            const existing = prev.find(p => p.id === resId);
            if (existing) {
                // Remove if 0
                if (count <= 0) return prev.filter(p => p.id !== resId);
                return prev.map(p => p.id === resId ? { ...p, count } : p);
            }
            if (count > 0) {
                const res = resources.find(r => r.id === resId);
                return [...prev, { id: resId, name: res?.name || '', count }];
            }
            return prev;
        });
    }

    const handleSubmit = () => {
        const newEvent: Event = {
            id: `evt-${Date.now()}`,
            title,
            type,
            start: new Date(startDate).toISOString(),
            end: new Date(endDate).toISOString(),
            venueId: selectedVenue,
            participantCount: participants,
            resources: selectedResources,
            status: 'Submitted', // Initial status
            requesterRole: role,
        };
        addEvent(newEvent);
        onOpenChange(false);
        // Reset form
        setStep(1);
        setTitle('');
        setStartDate('');
        setEndDate('');
        setSelectedVenue('');
        setSelectedResources([]);
        setParticipants(0);
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <div className="flex flex-col gap-4">
                <DialogHeader>
                    <DialogTitle>New Event Request (Step {step}/5)</DialogTitle>
                    <Progress value={(step / 5) * 100} className="h-2 mt-2" />
                </DialogHeader>

                <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto px-1">
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="title">Event Title</Label>
                                <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. AI Symposium" />
                            </div>
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="type">Event Type</Label>
                                <Select value={type} onChange={e => setType(e.target.value)}>
                                    {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </Select>
                            </div>
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="participants">Expected Participants</Label>
                                <Input type="number" id="participants" value={participants} onChange={e => setParticipants(parseInt(e.target.value))} />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="start">Start Date & Time</Label>
                                <Input type="datetime-local" id="start" value={startDate} onChange={e => setStartDate(e.target.value)} />
                            </div>
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="end">End Date & Time</Label>
                                <Input type="datetime-local" id="end" value={endDate} onChange={e => setEndDate(e.target.value)} />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="venue">Select Venue</Label>
                                <Select value={selectedVenue} onChange={e => setSelectedVenue(e.target.value)}>
                                    <option value="">-- Select Venue --</option>
                                    {venues.map(v => <option key={v.id} value={v.id}>{v.name} (Cap: {v.capacity})</option>)}
                                </Select>
                            </div>
                            {isConflict() && (
                                <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                                    <AlertTriangle className="h-4 w-4" />
                                    <span className="font-medium">Conflict Detected: This venue is already booked for the selected time.</span>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-4">
                            <Label>Resource Requirements</Label>
                            <div className="border rounded-md p-4 space-y-4 bg-muted/20">
                                {resources.map(res => {
                                    const allocation = selectedResources.find(r => r.id === res.id);
                                    const count = allocation?.count || 0;
                                    const error = getResourceError(res.id, count);

                                    return (
                                        <div key={res.id} className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <Label className="font-normal">{res.name} (Max: {res.totalCapacity})</Label>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="number"
                                                        className={cn("w-20 h-8 text-right", error && "border-destructive focus-visible:ring-destructive")}
                                                        value={count}
                                                        onChange={e => handleResourceChange(res.id, parseInt(e.target.value) || 0)}
                                                        min={0}
                                                    />
                                                </div>
                                            </div>
                                            {error && <span className="text-xs text-destructive">{error}</span>}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {step === 5 && (
                        <div className="space-y-4">
                            <div className="rounded-md bg-muted p-4 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Title:</span>
                                    <span className="font-medium">{title}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Venue:</span>
                                    <span className="font-medium">{venues.find(v => v.id === selectedVenue)?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Resources:</span>
                                    <span className="font-medium">{selectedResources.length > 0 ? selectedResources.map(r => `${r.count} ${r.name}`).join(', ') : 'None'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Requester:</span>
                                    <span className="font-medium">{role}</span>
                                </div>
                                {isConflict() && (
                                    <div className="text-destructive text-sm font-bold mt-2">
                                        Warning: Submitting with Venue Conflict!
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    {step > 1 && <Button variant="outline" onClick={prevStep}>Back</Button>}
                    {step < 5 ? (
                        <Button onClick={nextStep} disabled={step === 1 && !title || step === 3 && !selectedVenue}>Next</Button>
                    ) : (
                        <Button onClick={handleSubmit} className="bg-primary">Submit Request</Button>
                    )}
                </DialogFooter>
            </div>
        </Dialog>
    );
}
