import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { HiOutlineX } from "react-icons/hi";

import AppNav from "./AppNav";
import SuggestionPanel from "./SuggestionPanel";

function MobileNavDrawer({ open, onClose }) {
  const location = useLocation();
  const previousPathRef = useRef(location.pathname);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

  useEffect(() => {
    if (previousPathRef.current === location.pathname) return;
    previousPathRef.current = location.pathname;
    onClose();
    setSuggestionsOpen(false);
  }, [location.pathname, onClose]);

  useEffect(() => {
    if (!open && !suggestionsOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
        setSuggestionsOpen(false);
      }
    }

    function handleResize() {
      if (window.innerWidth >= 768) {
        onClose();
        setSuggestionsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [open, suggestionsOpen, onClose]);

  function handleOpenSuggestions() {
    onClose();
    setSuggestionsOpen(true);
  }

  return (
    <>
      {open && (
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
              <AppNav
                onNavigate={onClose}
                onOpenSuggestions={handleOpenSuggestions}
              />
            </div>
          </aside>
        </div>
      )}

      {suggestionsOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40"
            aria-label="Close suggestions"
            onClick={() => setSuggestionsOpen(false)}
          />
          <aside className="absolute inset-y-0 right-0 flex w-72 max-w-[85vw] flex-col bg-white shadow-xl">
            <div className="flex h-16 items-center justify-between border-b px-4">
              <p className="text-lg font-bold text-blue-600">Suggestions</p>
              <button
                type="button"
                onClick={() => setSuggestionsOpen(false)}
                className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
                aria-label="Close suggestions"
              >
                <HiOutlineX className="h-6 w-6" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <SuggestionPanel onNavigate={() => setSuggestionsOpen(false)} />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

export default MobileNavDrawer;
