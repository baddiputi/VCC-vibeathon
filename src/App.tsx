import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { EventProvider } from "@/context/EventContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
import Events from "@/pages/Events";
import Resources from "@/pages/Resources";
import Venues from "@/pages/Venues";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <EventProvider>
          <Routes>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="events" element={<Events />} />
              <Route path="resources" element={<Resources />} />
              <Route path="venues" element={<Venues />} />
              <Route path="*" element={<div className="p-4">Page not found</div>} />
            </Route>
          </Routes>
        </EventProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
