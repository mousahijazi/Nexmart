export const toMinorUnits = (amount) => Math.round(Number(amount) * 100);
export const fromMinorUnits = (minorUnits) => minorUnits / 100;