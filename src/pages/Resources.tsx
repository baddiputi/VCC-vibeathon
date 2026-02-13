import { useEvents } from "@/context/EventContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function ResourcesPage() {
    const { resources, events } = useEvents();

    // Calculate dynamic allocation based on active events
    // Count allocations from 'Running' events
    const getResourceUsage = (resId: string) => {
        let used = 0;
        events.filter(e => e.status === 'Running').forEach(e => {
            // Check both mandatory and optional resources
            const allResources = [...e.mandatoryResources, ...e.optionalResources];
            const alloc = allResources.find(r => r.id === resId);
            if (alloc) used += alloc.count;
        });
        return used;
    };

    return (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Resource Inventory</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {resources.map(res => {
                    const used = getResourceUsage(res.id);
                    const percent = Math.round((used / res.totalCapacity) * 100);
                    const isCritical = percent >= 90;

                    return (
                        <Card key={res.id}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">{res.name}</CardTitle>
                                {isCritical && <Badge variant="destructive">Critical</Badge>}
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{used} / {res.totalCapacity}</div>
                                <Progress value={percent} className="mt-2" />
                                <p className="text-xs text-muted-foreground mt-2">
                                    {res.totalCapacity - used} available
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
