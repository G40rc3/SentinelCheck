document.addEventListener('DOMContentLoaded', () => {
  S.updateScoreUI();
  const brokers = Object.values(S.get('brokerStatus', {})).filter(v => v === 'done').length;
  const tools = S.get('toolsDone', []).length;
  const aliases = S.get('aliases', []).length;
  const personas = S.get('personas', []).length;
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.innerHTML = v; };
  set('s_brokers', brokers + '<small>/187</small>');
  set('s_tools', tools + '<small>/12</small>');
  set('s_aliases', aliases);
  set('s_personas', personas);
  set('b_brokers', brokers + ' DONE');
  if (brokers > 0) { const b = document.getElementById('b_brokers'); if (b) b.className = 'badge ok'; }
  if (S.get('auditDone', false)) {
    const ab = document.getElementById('b_audit'); if (ab) { ab.textContent = 'DONE'; ab.className = 'badge ok'; }
    const al = document.querySelector('.alert-banner'); if (al) al.style.display = 'none';
  }
});
