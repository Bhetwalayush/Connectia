import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

function Navbar({ menuOpen, onMenuToggle }) {
  return (
    <nav className="z-10 flex h-16 flex-none items-center gap-3 border-b bg-white px-4 md:px-6">
      <button
        type="button"
        onClick={onMenuToggle}
        className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="mobile-nav"
      >
        {menuOpen ? (
          <HiOutlineX className="h-6 w-6" />
        ) : (
          <HiOutlineMenu className="h-6 w-6" />
        )}
      </button>
      <h1 className="text-2xl font-bold text-blue-600">Connectia</h1>
    </nav>
  );
}

export default Navbar;
