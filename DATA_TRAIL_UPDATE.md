# Data Trail Lab integration

This package contains your complete supplied website backup with Data Trail Lab integrated. It has not been uploaded to your live Hostinger website.

## Upload only these changes
Back up the live files first. Upload the following into the same public website folder that contains your current index.html:

Replace:
- learning-hub.html
- ghost-protocol/pages/brokers.html
- sitemap.xml

Add:
- learning-tools.v1.css
- the entire data-trail-lab/ folder

Keep the folder structure. Do not upload the outer website-integrated folder as a new subfolder. Other files from the supplied backup are unchanged and do not need to be re-uploaded. This avoids overwriting any newer live changes outside the integration.

## What changed
- Data Trail Lab appears first beside Ghost Protocol in the featured Learning Hub area; cards stack on smaller screens.
- A searchable Privacy resource card uses the approved description.
- Broker Opt-Out links to the lab.
- The lab has a Learning Hub return link and canonical URL.
- The sitemap includes /data-trail-lab/.
- A separate Learning Hub stylesheet confines layout changes to its featured area.
- The lab uses system font fallbacks instead of externally hosted Google Fonts, and its progress/cube styling is compatible with the site's strict security policy. Existing security configuration is unchanged.
- No lab styles or simulation scripts are loaded on other pages.

## Verification
Local links, duplicate IDs, the Privacy card, sitemap syntax and JavaScript syntax checked. Automated simulation checks passed for five-fragment compilation, grey traffic, direct browser compromise, server shutdown, extension removal and pause.
All existing files compared against the supplied backup: only the three replacement files listed above differ.

After uploading, open /learning-hub.html and /data-trail-lab/ on desktop and mobile. Check the Privacy filter, search for Data Trail Lab, follow the Broker Opt-Out link, and try the simulation. The final hosted layout has not been visually reviewed in a browser here.

## Rollback
Restore the three replacement files from your original backup. Remove learning-tools.v1.css and data-trail-lab/ if no longer needed. All other files remain as supplied.
