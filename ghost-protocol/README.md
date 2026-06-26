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

---

## Future Work: Scheduler / Broker Follow-Up module

The old Scheduler module has been removed from the public Ghost Protocol left navigation for now. It should be treated as a placeholder for future work, not as a finished public feature.

Current public state:

- Ghost Protocol currently presents 17 public modules.
- The public left navbar should end with `17 Intel Feed`.
- There should be no public `Scheduler` link until the feature is redesigned and tested.
- Do not leave a visible gap such as `16` then `18` in the sidebar.

Planned future state:

- Scheduler may return as the 18th Ghost Protocol module.
- Recommended future navbar label: `18 Broker Follow-Up` or `18 Opt-Out Follow-Up`.
- Avoid the vague public label `Scheduler` unless the page clearly explains what it schedules.

### Original purpose

The intended purpose was not a generic maintenance calendar. The useful future purpose is to help track or repeat data broker opt-out follow-ups after the Broker Opt-Out module has been used.

A static website can safely support:

- Broker follow-up tracking.
- Local browser progress only.
- Dates entered by the user.
- Manual status labels such as `Not started`, `Sent`, `Waiting`, `Followed up`, `Removed`, and `Needs review`.
- Copyable follow-up email templates.
- Links back to the Broker Opt-Out page.
- A clean manual reminder list.

A static website should not claim to support:

- Automatic background email sending.
- Automatic scheduled resending after the browser is closed.
- Reading client inboxes or checking broker replies.
- Server-side storage of client records.
- Cross-device sync.

Those features require backend infrastructure.

### Backend requirements for true automatic broker follow-up

If the future Scheduler is expected to automatically send or resend data broker opt-out emails, the project will need:

- A backend server or automation platform.
- A database for user or client records.
- Authentication and access control.
- Consent tracking for each client.
- Email sending through Gmail, SMTP, or a transactional email provider.
- Scheduled jobs or cron-style automation.
- Delivery logs and retry handling.
- Rate limits and anti-abuse controls.
- Data retention rules.
- A deletion process for client data.
- UK GDPR-compliant privacy documentation.
- Clear wording that Sentinel Check is processing personal data for the opt-out workflow.

Until those pieces exist, the public feature should remain manual and local only.

### Recommended rebuild direction

If this module is rebuilt later, the safest version is a manual follow-up tracker.

Suggested page title:

`Broker Follow-Up`

Suggested intro text:

`Use this page to track broker opt-out follow-ups after using the Broker Opt-Out module. Ghost Protocol does not send emails automatically. It helps you keep track of what was sent, what needs checking, and what should be followed up manually.`

Suggested page elements:

- Broker name.
- Date opt-out request was sent.
- Follow-up due date.
- Status dropdown.
- Notes field.
- Copy follow-up email button.
- Mark as followed up button.
- Mark as removed button.
- Reset broker follow-up button.

Suggested things to avoid:

- `999 days overdue` style warnings.
- Generic maintenance tasks already covered by other modules.
- Calendar export as the main feature.
- Custom reminders that do not connect to the broker workflow.
- Any wording that implies automatic sending without a backend.

### Integration notes for future implementation

When the module is ready:

1. Reintroduce it into `ghost-protocol/js/nav.js` as module 18.
2. Keep `17 Intel Feed` unchanged.
3. Add the new page under `ghost-protocol/pages/`.
4. Use Sentinel Check / Ghost Protocol colours and layout.
5. Keep the wording plain-English and privacy-friendly.
6. Test reset behaviour carefully. Reset Audit should not accidentally wipe long-term broker follow-up records unless a full session reset is explicitly selected.
7. Update this README and any public copy so there are no mismatches between the navbar, module count, and actual pages.

