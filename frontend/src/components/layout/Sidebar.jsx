import AppNav from "./AppNav";

function Sidebar() {
  return (
    <aside className="hidden h-full w-64 flex-none flex-col overflow-hidden border-r bg-white p-5 md:flex">
      <AppNav />
    </aside>
  );
}

export default Sidebar;
