export function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function daysBetween(startIso, endIso) {
  const ms = new Date(endIso) - new Date(startIso);
  return Math.ceil(ms / 86400000);
}