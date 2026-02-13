import { navItems } from "@/constants/nav";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Sidebar({ className }: { className?: string }) {
    const location = useLocation();

    return (
        <div className={cn("pb-12 min-h-screen border-r bg-gradient-to-b from-white to-blue-50/50 shadow-xl", className)}>
            <div className="space-y-4 py-4">
                <div className="px-4 py-4">
                    <div className="flex items-center gap-2 mb-2 px-2">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                CampusEvent
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                Resource Management
                            </p>
                        </div>
                    </div>
                </div>
                <div className="px-3 py-2">
                    <div className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className={cn(
                                        "group flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-all",
                                        isActive
                                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50 scale-105"
                                            : "hover:bg-blue-50 hover:text-blue-700 hover:scale-105 text-gray-700"
                                    )}
                                >
                                    <item.icon className={cn("mr-3 h-5 w-5", isActive && "animate-pulse")} />
                                    {item.title}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
