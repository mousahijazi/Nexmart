// todo
const PALETTE = ["var(--color-green-dark)", "var(--color-gold)", "var(--color-muted)", "var(--color-green-light)"];

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function CustomerAvatar({ name, status, index = 0 }) {
  const bg = status === "Suspended" ? "var(--color-red)" : PALETTE[index % PALETTE.length];

  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
      style={{ backgroundColor: bg }}
    >
      {getInitials(name)}
    </span>
  );
}