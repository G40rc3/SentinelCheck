document.addEventListener('DOMContentLoaded', () => { renderNav('Intel Feed'); renderReads(); });

function addRead() {
  const title = document.getElementById('readTitle').value.trim();
  const url = document.getElementById('readUrl').value.trim();
  if (!title) { alert('Add a title.'); return; }
  const reads = S.get('readList', []);
  reads.unshift({id: Date.now(), title, url, saved: new Date().toLocaleDateString('en-GB'), read: false});
  S.set('readList', reads);
  document.getElementById('readTitle').value = '';
  document.getElementById('readUrl').value = '';
  renderReads();
}

function toggleRead(id) {
  const reads = S.get('readList', []);
  const item = reads.find(r => r.id === id);
  if (item) item.read = !item.read;
  S.set('readList', reads);
  renderReads();
}

function removeRead(id) {
  S.set('readList', S.get('readList', []).filter(r => r.id !== id));
  renderReads();
}

function renderReads() {
  const reads = S.get('readList', []);
  if (!reads.length) {
    document.getElementById('readList').innerHTML = '<div style="font-size:12px;color:var(--text3);padding:8px 0">No articles saved yet.</div>';
    return;
  }
  document.getElementById('readList').innerHTML = reads.map(r => `
    <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)">
      <button onclick="toggleRead(${r.id})" style="width:20px;height:20px;flex-shrink:0;background:${r.read?'var(--green)':'transparent'};border:1px solid ${r.read?'var(--green)':'var(--border2)'};color:${r.read?'#03110f':'var(--text3)'};font-size:10px;cursor:pointer;border-radius:2px">
        ${r.read?'✓':''}
      </button>
      <div style="flex:1">
        <div style="font-size:13px;${r.read?'text-decoration:line-through;color:var(--text3)':''}">${r.title}</div>
        ${r.url ? `<a href="${r.url}" target="_blank" rel="noopener" style="font-family:var(--mono);font-size:10px;color:var(--accent)">${r.url.slice(0,60)}${r.url.length>60?'...':''} ↗</a>` : ''}
      </div>
      <span style="font-family:var(--mono);font-size:10px;color:var(--text3)">${r.saved}</span>
      <button class="btn-icon" onclick="removeRead(${r.id})">✕</button>
    </div>`).join('');
}
