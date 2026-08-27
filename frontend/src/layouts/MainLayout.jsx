import { useCallback, useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import RightSidebar from "../components/layout/RightSidebar";
import MobileNavDrawer from "../components/layout/MobileNavDrawer";

function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-100">
      <Navbar
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((open) => !open)}
      />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="min-w-0 flex-1 overflow-y-auto p-5">
          <Outlet />
        </main>
        <RightSidebar />
      </div>
      <MobileNavDrawer open={menuOpen} onClose={closeMenu} />
    </div>
  );
}

export default MainLayout;
