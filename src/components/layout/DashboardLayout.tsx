import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            <Sidebar className="hidden w-64 md:block flex-shrink-0" />
            <div className="flex flex-1 flex-col min-w-0">
                <Header />
                <main className="flex-1 space-y-4 p-8 pt-6 overflow-y-auto bg-slate-50/50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
