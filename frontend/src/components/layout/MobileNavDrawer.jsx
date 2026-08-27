import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { HiOutlineX } from "react-icons/hi";

import AppNav from "./AppNav";
import SuggestionPanel from "./SuggestionPanel";

function MobileNavDrawer({ open, onClose }) {
  const location = useLocation();
  const previousPathRef = useRef(location.pathname);

  useEffect(() => {
    if (previousPathRef.current === location.pathname) return;
    previousPathRef.current = location.pathname;
    onClose();
  }, [location.pathname, onClose]);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    function handleResize() {
      if (window.innerWidth >= 768) onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40"
        aria-label="Close menu"
        onClick={onClose}
      />
      <aside
        id="mobile-nav"
        className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-white shadow-xl"
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <p className="text-lg font-bold text-blue-600">Menu</p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
            aria-label="Close menu"
          >
            <HiOutlineX className="h-6 w-6" />
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4">
          <div className="min-h-0 flex-1">
            <AppNav onNavigate={onClose} />
          </div>
          <div className="mt-6 border-t pt-4">
            <SuggestionPanel onNavigate={onClose} />
          </div>
        </div>
      </aside>
    </div>
  );
}

export default MobileNavDrawer;
