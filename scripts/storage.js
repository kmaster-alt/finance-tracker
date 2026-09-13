// localStorage logic
import { patterns } from './validators.js';

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
  if (!Array.isArray(data)) return false;
  return data.every(r =>
    typeof r.id === 'string' &&
    patterns.description.test(r.description) &&
    typeof r.amount === 'number' &&
    patterns.category.test(r.category) &&
    patterns.date.test(r.date)
  );
}