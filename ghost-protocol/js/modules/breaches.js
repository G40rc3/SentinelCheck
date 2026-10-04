document.addEventListener('DOMContentLoaded', () => {
  renderNav('Breach Monitor');
  renderEmails();
  renderGrave();
});

function addEmail() {
  const val = document.getElementById('emailToCheck').value.trim();
  if (!val || !val.includes('@')) { alert('Enter a valid email address.'); return; }
  const list = S.get('watchEmails', []);
  if (list.find(e => e.email === val)) { alert('Already added.'); return; }
  list.unshift({email: val, id: Date.now(), notes: ''});
  S.set('watchEmails', list);
  document.getElementById('emailToCheck').value = '';
  renderEmails();
}

function removeEmail(id) {
  S.set('watchEmails', S.get('watchEmails', []).filter(e => e.id !== id));
  renderEmails();
}

function renderEmails() {
  const list = S.get('watchEmails', []);
  if (!list.length) {
    document.getElementById('emailList').innerHTML = '<div style="font-size:12px;color:var(--text3);padding:8px 0">No addresses added yet.</div>';
    return;
  }
  document.getElementById('emailList').innerHTML = list.map(e => `
    <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--bg3);border:1px solid var(--border);border-radius:2px">
      <span style="font-family:var(--mono);font-size:12px;color:var(--accent);flex:1">${e.email}</span>
      <a href="https://haveibeenpwned.com/account/${encodeURIComponent(e.email)}" target="_blank" rel="noopener" class="btn-ghost" style="font-size:10px;padding:5px 10px">CHECK ON HIBP ↗</a>
      <a href="https://monitor.mozilla.org/" target="_blank" rel="noopener" class="btn-ghost" style="font-size:10px;padding:5px 10px">MOZILLA MONITOR ↗</a>
      <button class="btn-icon" onclick="removeEmail(${e.id})">✕</button>
    </div>`).join('');
}

function addGrave() {
  const name = document.getElementById('graveName').value.trim();
  const email = document.getElementById('graveEmail').value.trim();
  if (!name) { alert('Enter a service name.'); return; }
  const list = S.get('graveyard', []);
  list.unshift({
    id: Date.now(), name, email,
    diff: document.getElementById('graveDiff').value,
    status: 'todo', added: new Date().toLocaleDateString('en-GB')
  });
  S.set('graveyard', list);
  document.getElementById('graveName').value = '';
  document.getElementById('graveEmail').value = '';
  renderGrave();
}

function setGraveStatus(id, val) {
  const list = S.get('graveyard', []);
  const item = list.find(g => g.id === id);
  if (item) item.status = val;
  S.set('graveyard', list);
  renderGrave();
}

function removeGrave(id) {
  S.set('graveyard', S.get('graveyard', []).filter(g => g.id !== id));
  renderGrave();
}

function renderGrave() {
  const list = S.get('graveyard', []);
  const diffColor = {easy:'var(--green)',medium:'var(--amber)',hard:'var(--red)',impossible:'var(--red)'};
  const diffLabel = {easy:'EASY',medium:'MEDIUM',hard:'HARD',impossible:'IMPOSSIBLE'};
  if (!list.length) {
    document.getElementById('graveList').innerHTML = '<div style="font-size:12px;color:var(--text3);padding:8px 0">No old accounts tracked yet. Add the services you want to delete.</div>';
    return;
  }
  document.getElementById('graveList').innerHTML = `
    <table class="data-table">
      <thead><tr><th>SERVICE</th><th>EMAIL USED</th><th>DIFFICULTY</th><th>ADDED</th><th>STATUS</th><th></th></tr></thead>
      <tbody>${list.map(g => `
        <tr>
          <td class="cell-main">${g.name}</td>
          <td style="font-family:var(--mono);font-size:11px;color:var(--text2)">${g.email||'-'}</td>
          <td><span style="font-family:var(--mono);font-size:9px;color:${diffColor[g.diff]}">${diffLabel[g.diff]}</span></td>
          <td style="font-size:11px;color:var(--text3);font-family:var(--mono)">${g.added}</td>
          <td>
            <select class="form-select" style="padding:4px 8px;font-size:11px;width:120px" onchange="setGraveStatus(${g.id},this.value)">
              <option value="todo" ${g.status==='todo'?'selected':''}>To Delete</option>
              <option value="requested" ${g.status==='requested'?'selected':''}>Requested</option>
              <option value="deleted" ${g.status==='deleted'?'selected':''}>Deleted ✓</option>
            </select>
          </td>
          <td>
            <a href="https://justdeleteme.xyz/#${encodeURIComponent(g.name.toLowerCase())}" target="_blank" rel="noopener" class="btn-icon copy" style="text-decoration:none;font-size:9px;padding:3px 7px">HOW TO DELETE ↗</a>
            <button class="btn-icon" onclick="removeGrave(${g.id})" style="margin-left:4px">✕</button>
          </td>
        </tr>`).join('')}
      </tbody>
    </table>`;
}
