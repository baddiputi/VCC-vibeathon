import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useAuth, ROLES, Role } from "@/context/AuthContext";
import { Bell, Search, User, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function Header() {
    const { role, setRole } = useAuth();

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white/80 backdrop-blur-xl px-6 shadow-lg shadow-blue-500/10">
            <div className="w-full flex-1">
                <form>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
                        <Input
                            type="search"
                            placeholder="Search events, venues, resources..."
                            className="w-full bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 pl-10 md:w-[350px] lg:w-[450px] focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                </form>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rond-lg border border-blue-200 shadow-sm">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700 hidden md:inline-block">Simulate:</span>
                    <Select
                        value={role}
                        onChange={(e) => setRole(e.target.value as Role)}
                        className="w-[140px] h-9 border-blue-300 focus:ring-2 focus:ring-purple-400"
                    >
                        {ROLES.map((r) => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </Select>
                </div>
                <Button variant="ghost" size="icon" className="relative hover:bg-blue-100">
                    <Bell className="h-5 w-5 text-blue-600" />
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs">
                        3
                    </Badge>
                    <span className="sr-only">Notifications</span>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                    <User className="h-5 w-5 text-white" />
                    <span className="sr-only">Profile</span>
                </Button>
            </div>
        </header>
    );
}
