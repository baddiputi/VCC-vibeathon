import { Event, EventStatus } from "@/types";
import { CheckCircle, Circle, XCircle, Clock, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth, Role } from "@/context/AuthContext";

interface TimelineProps {
    event: Event;
    onApprove: () => void;
    onReject: (reason: string) => void;
}

const STEPS = [
    { label: 'Submitted', role: 'Coordinator', status: 'Submitted' },
    { label: 'HOD Approval', role: 'HOD', status: 'Pending HOD' },
    { label: 'Dean Approval', role: 'Dean', status: 'Pending Dean' },
    { label: 'Head Approval', role: 'Head', status: 'Pending Head' },
    { label: 'Finalized', role: 'Admin', status: 'Approved' },
];

export function ApprovalTimeline({ event, onApprove, onReject }: TimelineProps) {
    const { role } = useAuth();

    // Logic to determine current active step index
    // 0: Submitted
    // 1: Pending HOD
    // 2: Pending Dean
    // 3: Pending Head
    // 4: Approved
    // -1: Rejected

    let currentStepIndex = 0;
    if (event.status === 'Pending HOD') currentStepIndex = 1;
    else if (event.status === 'Pending Dean') currentStepIndex = 2;
    else if (event.status === 'Pending Head') currentStepIndex = 3;
    else if (event.status === 'Approved' || event.status === 'Running' || event.status === 'Completed') currentStepIndex = 4;
    else if (event.status === 'Rejected') currentStepIndex = -1;

    const isRejected = currentStepIndex === -1;



    return (
        <div className="relative space-y-8 p-4">
            {STEPS.map((step, index) => {
                let statusColor = "text-muted-foreground";
                let icon = <Circle className="h-6 w-6" />;

                if (isRejected && event.rejectionReason && index > 0) {
                    // If rejected, steps after the failure are gray/red
                    // We need to find WHERE it was rejected.
                    // For simplicity, if rejected, show red X at the top or at the specific step if we tracked it.
                    // Here we just mark the timeline as broken.
                }

                if (!isRejected) {
                    if (index < currentStepIndex) {
                        statusColor = "text-emerald-500";
                        icon = <CheckCircle className="h-6 w-6" />;
                    } else if (index === currentStepIndex) {
                        statusColor = "text-amber-500";
                        icon = <Clock className="h-6 w-6 animate-pulse" />;
                    }
                } else {
                    // If rejected, simplistic view:
                    statusColor = "text-muted-foreground";
                }

                const isActiveActionStep = !isRejected && index === currentStepIndex;
                const canUserAct = isActiveActionStep && (role === step.role || role === 'Admin'); // Admin override

                return (
                    <div key={step.label} className="relative flex items-start gap-4">
                        {index !== STEPS.length - 1 && (
                            <div className="absolute left-3 top-8 h-full w-0.5 bg-border -z-10" />
                        )}

                        <div className={cn("bg-background p-1 rounded-full border-2",
                            isRejected ? "border-muted" :
                                index <= currentStepIndex ? "border-primary" : "border-muted"
                        )}>
                            <div className={statusColor}>{icon}</div>
                        </div>

                        <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-sm">{step.label}</h4>
                                <span className="text-xs text-muted-foreground">{step.role}</span>
                            </div>

                            {/* Action Buttons */}
                            {canUserAct && index > 0 && (
                                <div className="flex gap-2 mt-2">
                                    <Button size="sm" variant="default" className="w-24 bg-emerald-600 hover:bg-emerald-700" onClick={onApprove}>
                                        Approve
                                    </Button>
                                    <Button size="sm" variant="destructive" className="w-24" onClick={() => {
                                        const reason = prompt("Enter Rejection Reason:");
                                        if (reason) onReject(reason);
                                    }}>
                                        Reject
                                    </Button>
                                </div>
                            )}

                            {isRejected && index === 0 && (
                                <div className="text-destructive text-sm font-medium bg-destructive/10 p-2 rounded">
                                    Rejected: {event.rejectionReason}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
