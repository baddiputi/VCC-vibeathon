import { useState } from 'react';
import { Event } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ApprovalDialogProps {
    open: boolean;
    event: Event | null;
    action: 'approve' | 'reject' | 'modify';
    onConfirm: (comment: string) => void;
    onCancel: () => void;
}

export function ApprovalDialog({
    open,
    event,
    action,
    onConfirm,
    onCancel
}: ApprovalDialogProps) {
    const [comment, setComment] = useState('');

    const handleConfirm = () => {
        onConfirm(comment);
        setComment('');
    };

    const handleCancel = () => {
        onCancel();
        setComment('');
    };

    if (!event) return null;

    const actionConfig = {
        approve: {
            title: 'Approve Event',
            label: 'Approval Comment (Optional)',
            placeholder: 'Add any notes or comments...',
            confirmText: 'Approve Event',
            confirmClass: 'bg-green-600 hover:bg-green-700'
        },
        reject: {
            title: 'Reject Event',
            label: 'Rejection Reason (Required)',
            placeholder: 'Please provide a reason for rejection...',
            confirmText: 'Reject Event',
            confirmClass: 'bg-red-600 hover:bg-red-700'
        },
        modify: {
            title: 'Request Modification',
            label: 'Modification Request (Required)',
            placeholder: 'Describe what needs to be changed...',
            confirmText: 'Request Modification',
            confirmClass: 'bg-blue-600 hover:bg-blue-700'
        }
    }[action];

    const isRequiredFieldFilled = action === 'approve' || comment.trim().length > 0;

    return (
        <Dialog open={open} onOpenChange={handleCancel}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{actionConfig.title}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Event Details</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                            <p><span className="font-medium">Title:</span> {event.title}</p>
                            <p><span className="font-medium">Date:</span> {new Date(event.start).toLocaleDateString()}</p>
                            <p><span className="font-medium">Venue:</span> {event.venueId}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="comment">{actionConfig.label}</Label>
                        <Textarea
                            id="comment"
                            placeholder={actionConfig.placeholder}
                            value={comment}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
                            rows={4}
                            className="resize-none"
                        />
                        {action !== 'approve' && !comment.trim() && (
                            <p className="text-xs text-red-500">This field is required</p>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={!isRequiredFieldFilled}
                        className={actionConfig.confirmClass}
                    >
                        {actionConfig.confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
