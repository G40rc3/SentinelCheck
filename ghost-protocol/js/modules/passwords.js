document.addEventListener('DOMContentLoaded', () => { renderNav('Password & 2FA'); renderChecklist(); });

const ITEMS = [
  {id:'pw01',impact:'high',title:'Install a password manager (Bitwarden)',desc:'Without a password manager you inevitably reuse passwords. One breach exposes every account with that password.',fix:'Install Bitwarden (free). Import any saved browser passwords. Use it for all new logins.',link:'https://bitwarden.com'},
  {id:'pw02',impact:'high',title:'Audit and replace all reused passwords',desc:'Reused passwords are the single biggest account takeover risk. Every account should have a unique, randomly generated password.',fix:'Bitwarden → Tools → Reports → Reused Passwords. Change every flagged one.'},
  {id:'pw03',impact:'high',title:'Replace SMS 2FA with authenticator app on email',desc:'Your email is the master key to everything: password resets all go there. It must have the strongest 2FA possible.',fix:'Gmail/ProtonMail/Outlook: Security settings → 2-step verification → switch to Authenticator App or Security Key.'},
  {id:'pw04',impact:'high',title:'Enable 2FA on all financial accounts',desc:'Bank, crypto, PayPal, investment accounts. These are the highest-value targets for attackers.',fix:'Log into each financial account → Security → Two-Factor Authentication → enable authenticator app.'},
  {id:'pw05',impact:'high',title:'Set a carrier account PIN against SIM swapping',desc:'SIM swapping lets attackers steal your phone number by calling your carrier. A PIN prevents them.',fix:'Call your carrier or log into your online account → set a SIM lock or account PIN/passphrase. Keep it somewhere safe.'},
  {id:'pw06',impact:'high',title:'Delete all saved passwords from your browser',desc:'Chrome, Firefox, Edge all offer to save passwords: but browser-stored passwords are far less secure than a dedicated manager.',fix:'Browser settings → Passwords → delete all. Bitwarden will fill them instead.'},
  {id:'pw07',impact:'med',title:'Enable 2FA on social media accounts',desc:'Social account takeovers are common and can be used to impersonate you or harvest your contacts.',fix:'Facebook, Instagram, Twitter/X, LinkedIn: Security settings → Two-Factor → Authenticator App.'},
  {id:'pw08',impact:'med',title:'Set up emergency access / backup codes',desc:'If you lose your phone or hardware key you could be locked out of everything. Backup codes prevent this.',fix:'Every service with 2FA offers backup codes. Download and store them encrypted in Bitwarden or printed and locked away.'},
  {id:'pw09',impact:'med',title:'Use a passphrase for your password manager master password',desc:'The master password unlocks everything. It must be memorable but impossible to brute-force.',fix:'Use a 5 to 6 word passphrase: "correct-horse-battery-staple-purple". Not a dictionary word or name.'},
  {id:'pw10',impact:'med',title:'Check for weak passwords in Bitwarden',desc:'Short or simple passwords even when unique are still guessable.',fix:'Bitwarden → Tools → Password Weakness Report → change any flagged ones.'},
  {id:'pw11',impact:'med',title:'Enable 2FA on your password manager itself',desc:'Your password manager is the highest-value target. Lock it with the strongest 2FA you have.',fix:'Bitwarden → Account Settings → Two-step Login → use Authenticator App or hardware key.'},
  {id:'pw12',impact:'med',title:'Audit accounts that still use only a password (no 2FA)',desc:'Bitwarden shows which accounts have 2FA enabled. Enable it everywhere possible.',fix:'Bitwarden → Tools → Inactive Two-Step Login Report → enable 2FA on every listed account.'},
  {id:'pw13',impact:'med',title:'Stop using "Login with Google/Facebook"',desc:'SSO links your accounts to Google or Meta and lets them track which services you use.',fix:'For any SSO account: go to the service → account settings → disconnect social login → set email + password instead.'},
  {id:'pw14',impact:'low',title:'Consider a hardware security key for critical accounts',desc:'A YubiKey completely eliminates phishing as an attack vector for accounts it protects.',fix:'Buy a YubiKey 5 NFC (~£50). Enable it on: Google, GitHub, Bitwarden, ProtonMail. It works with NFC on phones too.',link:'https://www.yubico.com'},
  {id:'pw15',impact:'low',title:'Enable passkeys where available',desc:'Passkeys replace passwords entirely with cryptographic keys. Immune to phishing and credential stuffing.',fix:'Sites like Google, GitHub, Apple, and PayPal now support passkeys. Enable in security settings where offered.'},
  {id:'pw16',impact:'low',title:'Use Bitwarden\'s built-in breach alert',desc:'Bitwarden checks your stored passwords against known breach databases.',fix:'Bitwarden → Tools → Data Breach Report → enter your email addresses to check.'},
  {id:'pw17',impact:'low',title:'Set a long device PIN or use biometrics for phone',desc:'Your phone PIN is the last line of defence if someone has your device.',fix:'Use a 6+ digit PIN or alphanumeric passcode. Fingerprint/Face ID is fine for convenience on top of a strong PIN.'},
  {id:'pw18',impact:'low',title:'Never store passwords in plaintext (notes, spreadsheets)',desc:'Unencrypted password lists in Google Docs, Apple Notes, or spreadsheets are easily compromised.',fix:'Move all passwords into Bitwarden. Delete the plaintext file and empty the trash.'},
  {id:'pw19',impact:'low',title:'Use separate email for high-security accounts',desc:'Your bank and primary email should use a different address than public signups.',fix:'Set up a ProtonMail address used only for banking, government, and critical accounts. Don\'t use it for anything else.'},
  {id:'pw20',impact:'low',title:'Review and revoke old OAuth app permissions',desc:'Apps you granted password-less access to years ago may still have it.',fix:'Google: myaccount.google.com/permissions. GitHub: Settings → Applications. Review and revoke any unused apps.'},
];

function renderChecklist() {
  const done = S.get('pwDone', []);
  document.getElementById('pw_done').textContent = done.length;
  const sorted = [...ITEMS.filter(i=>i.impact==='high'), ...ITEMS.filter(i=>i.impact==='med'), ...ITEMS.filter(i=>i.impact==='low')];
  document.getElementById('pwChecklist').innerHTML = sorted.map(item => {
    const isDone = done.includes(item.id);
    return `<div style="display:flex;gap:12px;padding:13px 0;border-bottom:1px solid var(--border);align-items:flex-start">
      <button onclick="toggle('${item.id}')" style="width:22px;height:22px;flex-shrink:0;margin-top:2px;background:${isDone?'var(--green)':'transparent'};border:1px solid ${isDone?'var(--green)':'var(--border2)'};color:${isDone?'#03110f':'var(--text3)'};font-size:11px;cursor:pointer;border-radius:2px;transition:all .15s">${isDone?'✓':''}</button>
      <div style="flex:1">
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:3px">
          <span style="font-size:13px;font-weight:500;${isDone?'text-decoration:line-through;color:var(--text3)':''}">${item.title}</span>
          <span class="badge ${item.impact==='high'?'danger':item.impact==='med'?'warn':'muted'}">${item.impact.toUpperCase()}</span>
        </div>
        <div style="font-size:12px;color:var(--text2);margin-bottom:4px">${item.desc}</div>
        <div style="font-size:11px;font-family:var(--mono);color:var(--accent)">FIX: ${item.fix}${item.link?` <a href="${item.link}" target="_blank" rel="noopener" style="color:var(--accent)">[link ↗]</a>`:''}</div>
      </div>
    </div>`;
  }).join('');
}

function toggle(id) {
  const done = S.get('pwDone', []);
  const i = done.indexOf(id); if (i===-1) done.push(id); else done.splice(i,1);
  S.set('pwDone', done); renderChecklist(); S.updateScoreUI(); renderNav('Password & 2FA');
}
