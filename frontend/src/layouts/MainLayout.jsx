import { useCallback, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import RightSidebar from "../components/layout/RightSidebar";
import MobileNavDrawer from "../components/layout/MobileNavDrawer";

function isChatPath(pathname) {
  return pathname === "/messages/new" || /^\/messages\/\d+$/.test(pathname);
}

function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const { pathname } = useLocation();
  const chatOpen = isChatPath(pathname);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-100">
      <Navbar
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((open) => !open)}
      />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main
          className={`min-w-0 flex-1 ${
            chatOpen ? "overflow-hidden p-0" : "overflow-y-auto p-5"
          }`}
        >
          <Outlet />
        </main>
        {!chatOpen && <RightSidebar />}
      </div>
      <MobileNavDrawer open={menuOpen} onClose={closeMenu} />
    </div>
  );
}

export default MainLayout;
