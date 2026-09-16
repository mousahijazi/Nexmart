// todo
const SEGMENT_STYLE = {
  Retail: {
    color: "var(--color-green-light)",
    bg: "color-mix(in srgb, var(--color-green-light) 16%, transparent)",
  },
  "Merchant B2B": {
    color: "var(--color-gold)",
    bg: "color-mix(in srgb, var(--color-gold) 22%, transparent)",
  },
};

export default function CustomerSegmentBadge({ segment }) {
  const style = SEGMENT_STYLE[segment] ?? {
    color: "var(--color-muted)",
    bg: "var(--color-sand)",
  };

  return (
    <span
      className="inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ color: style.color, backgroundColor: style.bg }}
    >
      {segment}
    </span>
  );
}