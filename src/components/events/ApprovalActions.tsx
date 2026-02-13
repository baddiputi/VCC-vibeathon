import { Event } from '@/types';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Edit3 } from 'lucide-react';

interface ApprovalActionsProps {
    event: Event;
    onApprove: () => void;
    onReject: () => void;
    onRequestModification?: () => void;
}

export function ApprovalActions({
    event,
    onApprove,
    onReject,
    onRequestModification
}: ApprovalActionsProps) {
    const { canApproveEvent } = useRoleAccess();

    if (!canApproveEvent(event)) return null;

    return (
        <div className="flex gap-2">
            <Button
                onClick={onApprove}
                variant="default"
                className="bg-green-600 hover:bg-green-700 text-white"
                size="sm"
            >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
            </Button>
            <Button
                onClick={onReject}
                variant="destructive"
                size="sm"
            >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
            </Button>
            {onRequestModification && (
                <Button
                    onClick={onRequestModification}
                    variant="outline"
                    size="sm"
                >
                    <Edit3 className="mr-2 h-4 w-4" />
                    Request Modification
                </Button>
            )}
        </div>
    );
}
