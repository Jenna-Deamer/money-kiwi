export const formatDateToIso = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const parseIsoDateToLocalDate = (value) => {
  if (value == null) return;
  if (value instanceof Date) return value;

  if (typeof value === 'string') {
    const [year, month, day] = value.split('T')[0].split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  throw new TypeError('Must be a string');
};

export const normalizeDateInputToLocalDate = (dateInput) => {
  const d = new Date(dateInput);
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
};
