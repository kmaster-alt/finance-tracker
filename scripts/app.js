import { addRecord, updateRecord, replaceAll, subscribe, getRecords } from './state.js';
import { validateRecord } from './validators.js';
import { renderTable, renderStats, renderConverted, setSort } from './ui.js';
import { isValidImport } from './storage.js';

const form = document.getElementById('recordForm');
const fields = ['description', 'amount', 'category', 'date'];

fields.forEach(f => {
  document.getElementById(f).addEventListener('input', () => {
    const data = Object.fromEntries(fields.map(k => [k, document.getElementById(k).value]));
    const errors = validateRecord(data);
    document.getElementById(f + 'Error').textContent = errors[f] || '';
  });
});

function edit(id) {
  const r = getRecords().find(r => r.id === id);
  if (!r) return;
  document.getElementById('recordId').value = r.id;
  fields.forEach(f => document.getElementById(f).value = r[f]);
}

function refresh() {
  renderTable(edit);
  renderStats();
  renderConverted();
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const data = Object.fromEntries(fields.map(f => [f, document.getElementById(f).value]));
  const errors = validateRecord(data);
  fields.forEach(f => document.getElementById(f + 'Error').textContent = errors[f] || '');
  if (Object.keys(errors).length) return;

  const id = document.getElementById('recordId').value;
  if (id) updateRecord(id, data); else addRecord(data);
  form.reset();
  document.getElementById('recordId').value = '';
});

document.getElementById('searchInput').addEventListener('input', refresh);
document.getElementById('caseInsensitive').addEventListener('change', refresh);
document.getElementById('capInput').addEventListener('input', refresh);
document.getElementById('rateEUR').addEventListener('input', refresh);
document.getElementById('rateGBP').addEventListener('input', refresh);
document.querySelectorAll('[data-sort]').forEach(btn =>
  btn.addEventListener('click', () => { setSort(btn.dataset.sort); refresh(); }));

document.getElementById('exportBtn').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(getRecords(), null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'finance-export.json';
  a.click();
});

document.getElementById('importFile').addEventListener('change', e => {
  const file = e.target.files[0];
  const status = document.getElementById('ioStatus');
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!isValidImport(data)) throw new Error('bad shape');
      replaceAll(data);
      status.textContent = 'Import successful.';
    } catch {
      status.textContent = 'Import failed: invalid JSON structure.';
    }
  };
  reader.readAsText(file);
});

subscribe(refresh);

if (getRecords().length === 0) {
  fetch('./seed.json')
    .then(r => r.json())
    .then(data => replaceAll(data))
    .catch(() => {});
}

refresh();