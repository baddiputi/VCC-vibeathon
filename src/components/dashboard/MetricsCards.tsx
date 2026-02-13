import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Event, Venue, ResourceItem } from "@/types";
import { Activity, Clock, AlertTriangle, Building, TrendingUp } from "lucide-react";

interface MetricsCardsProps {
    events: Event[];
    venues: Venue[];
    resources: ResourceItem[];
}

export function MetricsCards({ events, venues, resources }: MetricsCardsProps) {
    const activeEvents = events.filter(e => e.status === 'Running').length;
    const pendingApprovals = events.filter(e => e.status.startsWith('Pending')).length;

    const occupiedVenues = events.filter(e => e.status === 'Running').length;
    const occupancyRate = Math.round((occupiedVenues / venues.length) * 100);

    const criticalAlerts = resources.filter(r => r.allocated >= r.totalCapacity).length;

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="relative overflow-hidden border-none shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-blue-100">Active Events</CardTitle>
                    <Activity className="h-5 w-5 text-blue-200" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{activeEvents}</div>
                    <p className="text-xs text-blue-100 flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3" />
                        Happening right now
                    </p>
                </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-none shadow-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-amber-100">Pending Approvals</CardTitle>
                    <Clock className="h-5 w-5 text-amber-200 animate-pulse" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{pendingApprovals}</div>
                    <p className="text-xs text-amber-100 mt-1">
                        Requires attention
                    </p>
                </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-none shadow-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-purple-100">Venue Occupancy</CardTitle>
                    <Building className="h-5 w-5 text-purple-200" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{occupancyRate}%</div>
                    <p className="text-xs text-purple-100 mt-1">{occupiedVenues} / {venues.length} venues in use</p>
                    <div className="mt-3 h-2 w-full bg-white/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white rounded-full transition-all duration-500"
                            style={{ width: `${occupancyRate}%` }}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-none shadow-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-rose-100">Critical Alerts</CardTitle>
                    <AlertTriangle className="h-5 w-5 text-rose-200 animate-bounce" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{criticalAlerts}</div>
                    <p className="text-xs text-rose-100 mt-1">
                        Resource shortages
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
