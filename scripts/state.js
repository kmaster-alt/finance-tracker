import { load, save } from './storage.js';

let records = load();
const subscribers = [];

export function getRecords() { return records; }
export function subscribe(fn) { subscribers.push(fn); }
function notify() { subscribers.forEach(fn => fn(records)); save(records); }

export function addRecord(data) {
  const now = new Date().toISOString();
  records.push({ id: 'txn_' + Date.now(), ...data, amount: parseFloat(data.amount), createdAt: now, updatedAt: now });
  notify();
}

export function updateRecord(id, data) {
  records = records.map(r => r.id === id ? { ...r, ...data, amount: parseFloat(data.amount), updatedAt: new Date().toISOString() } : r);
  notify();
}

export function deleteRecord(id) {
  records = records.filter(r => r.id !== id);
  notify();
}

export function replaceAll(newRecords) {
  records = newRecords;
  notify();
}