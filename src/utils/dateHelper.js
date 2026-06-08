export const toLocalDateString = (date) => {
  // takes Date obj and formats to YYYY-MM-DD
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const stringToDateObject = (string) => {
  if (string === null || string === undefined) return;
  else if (string instanceof Date) return string;

  else if (string && typeof string === 'string') {
    const [year, month, day] = string.split('T')[0].split('-').map(Number);
    return string = new Date(year, month - 1, day);
  } else {
    throw new TypeError('Must be a string');
  }
};
