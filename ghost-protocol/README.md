# Ghost Protocol: Privacy Dashboard

A local privacy operations dashboard. No server, no tracking, no cloud. Runs entirely in your browser. All data stays on your machine in localStorage.

## How to open it

1. Unzip / open the `ghost-protocol` folder in VS Code
2. Right-click `index.html` → **Open with Live Server** (install the Live Server extension if you don't have it)
  : OR
   Just double-click `index.html` in your file explorer to open it in your browser

That's it. No install, no Node, no Python.

---

## What's inside

| Page | What it does |
|---|---|
| `index.html` | Overview dashboard + exposure score |
| `pages/audit.html` | Exposure audit: answers questions, scores your risk, tells you exactly what to fix |
| `pages/arsenal.html` | 12 tools to install, ordered by impact. Mark them off as you go. |
| `pages/brokers.html` | 187 data brokers with opt-out links + pre-written opt-out email template |
| `pages/aliases.html` | Log your email aliases: track which service gets which address |
| `pages/personas.html` | Generate fake identities for throwaway signups |

---

## Recommended order

1. **Audit first**: run the exposure audit to see your current risk score
2. **Install tools**: uBlock Origin and Firefox Multi-Account Containers are the two highest-impact things you can do today, for free
3. **Start broker opt-outs**: aim for 5 per day. The high-risk ones (Spokeo, Acxiom, BeenVerified, Whitepages, LexisNexis) first
4. **Set up email aliases**: SimpleLogin or AnonAddy, free tier is enough to start
5. **Use personas**: for any signup where you don't legally need to give real info

---

## The tools the Arsenal page links to

All free unless noted:

- **uBlock Origin**: https://ublockorigin.com (tracker/ad blocker, highest impact)
- **Firefox**: https://mozilla.org/firefox (privacy-respecting browser)
- **Firefox Multi-Account Containers**: isolates sites from each other
- **SimpleLogin**: https://simplelogin.io (email aliases, free tier)
- **AdNauseam**: https://adnauseam.io (blocks + pollutes ad profiles)
- **Mullvad VPN**: https://mullvad.net (€5/month, no-log, audited)
- **Bitwarden**: https://bitwarden.com (password manager, free)
- **TrackMeNot**: https://cs.nyu.edu/trackmenot/ (search noise)
- **Privacy Badger** (EFF): https://privacybadger.org
- **ProtonMail**: https://proton.me (encrypted email)
- **DuckDuckGo**: https://duckduckgo.com (non-tracking search)
- **Portmaster**: https://safing.io/portmaster/ (system-level DNS firewall)

---

## Privacy of the dashboard itself

- Zero network requests made by this dashboard
- All your data (aliases, personas, broker progress) stored in browser localStorage only
- Nothing leaves your machine
- Safe to use on a local file:// URL or via Live Server on localhost

---

## Legal note on broker opt-outs

In the UK you have the right to erasure under UK GDPR (Article 17).
In the EU this is GDPR Article 17.
In California this is the CCPA.
Many brokers will try to make this difficult. The pre-written email template in the Broker Opt-Out page cites your legal rights explicitly.
