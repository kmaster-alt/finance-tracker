const KEY = 'finance-tracker:data';

export function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch { return []; }
}

export function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function isValidImport(data) {
  return Array.isArray(data) && data.every(r =>
    r.id && r.description && typeof r.amount === 'number' && r.category && r.date);
}