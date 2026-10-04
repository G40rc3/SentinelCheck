document.addEventListener('DOMContentLoaded', () => { renderNav('Email Aliases'); renderAliases(); });

function showAddForm() { document.getElementById('addForm').style.display='block'; document.getElementById('newAlias').focus(); }
function hideAddForm() { document.getElementById('addForm').style.display='none'; }

function addAlias() {
  const alias = document.getElementById('newAlias').value.trim();
  const service = document.getElementById('newService').value.trim();
  if (!alias || !service) { alert('Alias address and service name are required.'); return; }
  const aliases = S.get('aliases', []);
  aliases.unshift({
    id: Date.now(),
    alias, service,
    notes: document.getElementById('newNotes').value.trim(),
    status: document.getElementById('newStatus').value,
    created: new Date().toLocaleDateString('en-GB')
  });
  S.set('aliases', aliases);
  hideAddForm();
  document.getElementById('newAlias').value = '';
  document.getElementById('newService').value = '';
  document.getElementById('newNotes').value = '';
  renderAliases();
  S.updateScoreUI();
  renderNav('Email Aliases');
}

function deleteAlias(id) {
  if (!confirm('Delete this alias?')) return;
  S.set('aliases', S.get('aliases', []).filter(a => a.id !== id));
  renderAliases();
  S.updateScoreUI();
  renderNav('Email Aliases');
}

function setAliasStatus(id, status) {
  const aliases = S.get('aliases', []);
  const a = aliases.find(a => a.id === id);
  if (a) a.status = status;
  S.set('aliases', aliases);
  renderAliases();
}

function copyAlias(text) {
  navigator.clipboard.writeText(text);
}

function renderAliases() {
  const aliases = S.get('aliases', []);
  document.getElementById('aliasCount').textContent = aliases.length + ' saved';
  if (aliases.length === 0) {
    document.getElementById('aliasList').innerHTML = '<div style="padding:20px;text-align:center;color:var(--text3);font-size:13px">No aliases logged yet. Add your first one above.</div>';
    return;
  }
  const statusColor = {clean:'var(--green)',spam:'var(--red)',blocked:'var(--text3)'};
  const statusLabel = {clean:'CLEAN',spam:'COMPROMISED',blocked:'BLOCKED'};
  document.getElementById('aliasList').innerHTML = `
    <div  class="responsive-grid" style="display:grid;grid-template-columns:2fr 1.2fr 1fr 1.2fr auto;gap:12px;padding:8px 0;font-family:var(--mono);font-size:9px;color:var(--text3);letter-spacing:.1em;border-bottom:1px solid var(--border)">
      <span>ALIAS</span><span>SERVICE</span><span>CREATED</span><span>STATUS</span><span></span>
    </div>
    ${aliases.map(a => `
    <div  class="responsive-grid" style="display:grid;grid-template-columns:2fr 1.2fr 1fr 1.2fr auto;gap:12px;padding:12px 0;border-bottom:1px solid var(--border);align-items:center">
      <span style="font-family:var(--mono);font-size:11px;color:var(--accent);word-break:break-all">${a.alias}
        <button class="btn-icon copy" onclick="copyAlias('${a.alias}')" style="margin-left:4px;font-size:9px;padding:2px 6px">COPY</button>
      </span>
      <span style="font-size:13px">${a.service}${a.notes?`<div style="font-size:10px;color:var(--text3)">${a.notes}</div>`:''}</span>
      <span style="font-family:var(--mono);font-size:10px;color:var(--text3)">${a.created}</span>
      <span>
        <select class="form-select" style="padding:4px 8px;font-size:10px" onchange="setAliasStatus(${a.id},this.value)">
          <option value="clean" ${a.status==='clean'?'selected':''}>✓ Clean</option>
          <option value="spam" ${a.status==='spam'?'selected':''}>⚠ Compromised</option>
          <option value="blocked" ${a.status==='blocked'?'selected':''}>✗ Blocked</option>
        </select>
      </span>
      <button class="btn-icon" onclick="deleteAlias(${a.id})">✕</button>
    </div>`).join('')}`;
}
