export function isCurrentPeriod(startDate, endDate) {
  const now = Date.now();
  return new Date(startDate).getTime() <= now && now <= new Date(endDate).getTime();
}

export function getToggleState(item, entity) {
  if (!isCurrentPeriod(item.startDate, item.endDate)) {
    return { disabled: true, reason: `Only a current ${entity} can be archived or restored` };
  }

  if (!item.isActive && item.archivedBySeason) {
    return { disabled: true, reason: "Restore the season first" };
  }

  return { disabled: false, reason: "" };
}