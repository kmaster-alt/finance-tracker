// render + sort + search logic
import { getRecords, deleteRecord } from './state.js';
import { compileRegex, highlight } from './search.js';

let sortKey = 'date', sortDir = 1;

export function renderTable(onEdit) {
  const tbody = document.getElementById('recordsBody');
  const query = document.getElementById('searchInput').value;
  const ci = document.getElementById('caseInsensitive').checked;
  const errorEl = document.getElementById('searchError');

  const re = compileRegex(query, ci ? 'gi' : 'g');
  errorEl.textContent = query && !re ? 'Invalid regex pattern.' : '';

  let rows = [...getRecords()];
  rows.sort((a, b) => {
    if (sortKey === 'amount') return (a.amount - b.amount) * sortDir;
    return a[sortKey] > b[sortKey] ? sortDir : -sortDir;
  });

  if (re) rows = rows.filter(r => re.test(r.description) || re.test(r.category));

  if (rows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" role="status">No matching records found.</td></tr>`;
    return;
  }

  tbody.innerHTML = rows.map(r => `
    <tr>
      <td data-label="Description">${highlight(r.description, re)}</td>
      <td data-label="Amount">$${r.amount.toFixed(2)}</td>
      <td data-label="Category">${highlight(r.category, re)}</td>
      <td data-label="Date">${r.date}</td>
      <td data-label="Actions">
        <button data-edit="${r.id}">Edit</button>
        <button data-delete="${r.id}">Delete</button>
      </td>
    </tr>`).join('');

  tbody.querySelectorAll('[data-edit]').forEach(b => b.onclick = () => onEdit(b.dataset.edit));
  tbody.querySelectorAll('[data-delete]').forEach(b => b.onclick = () => {
    if (confirm('Delete this record?')) { deleteRecord(b.dataset.delete); renderTable(onEdit); }
  });
}

export function setSort(key) {
  sortDir = sortKey === key ? -sortDir : 1;
  sortKey = key;
}

// dashboard stats + cap logic
export function renderStats() {
  const records = getRecords();
  const total = records.length;
  const sum = records.reduce((s, r) => s + r.amount, 0);
  const byCategory = {};
  records.forEach(r => byCategory[r.category] = (byCategory[r.category] || 0) + r.amount);
  const top = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];

  document.getElementById('statsGrid').innerHTML = `
    <div class="stat-card"><strong>${total}</strong><br>Records</div>
    <div class="stat-card"><strong>$${sum.toFixed(2)}</strong><br>Total spent</div>
    <div class="stat-card"><strong>${top ? top[0] : '—'}</strong><br>Top category</div>
    <div class="stat-card"><strong>$${sum ? (sum / (total || 1)).toFixed(2) : '0.00'}</strong><br>Avg / record</div>`;

  const cap = parseFloat(document.getElementById('capInput').value);
  const capStatus = document.getElementById('capStatus');
  if (!isNaN(cap)) {
    const remaining = cap - sum;
    capStatus.setAttribute('aria-live', remaining < 0 ? 'assertive' : 'polite');
    capStatus.textContent = remaining < 0
      ? `Over cap by $${Math.abs(remaining).toFixed(2)}`
      : `$${remaining.toFixed(2)} remaining under cap`;
  } else {
    capStatus.textContent = '';
  }

  const days = [...Array(7)].map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  const daySums = days.map(d => records.filter(r => r.date === d).reduce((s, r) => s + r.amount, 0));
  const max = Math.max(...daySums, 1);
  document.getElementById('trendChart').innerHTML = daySums.map(v =>
    `<div class="trend-bar" style="height:${(v / max) * 100}%" title="$${v.toFixed(2)}"></div>`).join('');
}

export function renderConverted() {
  const sum = getRecords().reduce((s, r) => s + r.amount, 0);
  const eur = parseFloat(document.getElementById('rateEUR').value) || 0;
  const gbp = parseFloat(document.getElementById('rateGBP').value) || 0;
  document.getElementById('statsGrid').insertAdjacentHTML('beforeend', `
    <div class="stat-card">€${(sum * eur).toFixed(2)}<br>Total in EUR</div>
    <div class="stat-card">£${(sum * gbp).toFixed(2)}<br>Total in GBP</div>`);
}