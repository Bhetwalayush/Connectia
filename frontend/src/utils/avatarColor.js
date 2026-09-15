// Deterministic color per display name, so the same name always renders
// the same color for every viewer. Uses static Tailwind class pairs so
// Tailwind's compiler can see and keep them (no dynamic class construction).
const PALETTE = [
  { bg: "bg-rose-500", ring: "ring-rose-200" },
  { bg: "bg-orange-500", ring: "ring-orange-200" },
  { bg: "bg-amber-500", ring: "ring-amber-200" },
  { bg: "bg-lime-500", ring: "ring-lime-200" },
  { bg: "bg-emerald-500", ring: "ring-emerald-200" },
  { bg: "bg-teal-500", ring: "ring-teal-200" },
  { bg: "bg-cyan-500", ring: "ring-cyan-200" },
  { bg: "bg-sky-500", ring: "ring-sky-200" },
  { bg: "bg-indigo-500", ring: "ring-indigo-200" },
  { bg: "bg-violet-500", ring: "ring-violet-200" },
  { bg: "bg-fuchsia-500", ring: "ring-fuchsia-200" },
  { bg: "bg-pink-500", ring: "ring-pink-200" },
];

export function colorForName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}
