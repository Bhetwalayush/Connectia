function Sidebar() {
  return (
    <aside
      className="
      hidden
      md:block
      w-64
      bg-white
      h-full
      flex-none
      overflow-hidden
      p-5
      border-r
    "
    >
      <ul className="space-y-4">
        <li>Home</li>

        <li>Explore</li>

        <li>Messages</li>

        <li>Notifications</li>

        <li>Profile</li>
      </ul>
    </aside>
  );
}

export default Sidebar;
