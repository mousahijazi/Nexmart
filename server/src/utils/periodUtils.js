export const isCurrentPeriod = (startDate, endDate) => {
  const now = new Date();
  return new Date(startDate) <= now && now <= new Date(endDate);
};