import SuggestionPanel from "./SuggestionPanel";

function RightSidebar() {
  return (
    <aside className="hidden h-full w-72 flex-none overflow-y-auto border-l bg-white p-5 xl:block">
      <SuggestionPanel />
    </aside>
  );
}

export default RightSidebar;
