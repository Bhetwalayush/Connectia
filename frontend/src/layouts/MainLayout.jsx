// Main application layout - Contains navbar, sidebars, and main content area
import { Outlet } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import RightSidebar from "../components/layout/RightSidebar";

function MainLayout() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-100">
      <Navbar /> {/* Top navigation bar */}
      <div className="flex min-h-0 flex-1">
        <Sidebar /> {/* Left navigation sidebar */}
        <main className="min-w-0 flex-1 overflow-y-auto p-5">
          <Outlet /> {/* Page content from routes */}
        </main>
        <RightSidebar /> {/* Right sidebar with recommendations/info */}
      </div>
    </div>
  );
}

export default MainLayout;
