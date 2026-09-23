# The Grimsby Institute

A bespoke Victorian institutional website for the H-31 story and the October 24, 2026 dinner.

Live site: https://collective001.github.io/GrimsbyInstitute/

## Publish and update

GitHub Pages uses the existing `main` branch configuration. Both the repository root and `/docs` contain an identical static site, supporting either Pages source setting. Both are generated from the same source; don't edit generated HTML directly.

1. Edit `content/journals.json`. Every entry has a number, Roman numeral, whimsical date, original heading, text, signature, and `published` flag. Preserve the author's text and paragraph breaks. Display titles are archive labels, not changes to the original journal headings.
2. Update `content/site.json` when the latest report changes the case status or the doctor's location. Update the illustrative `assets/route-map.svg` only as published travel advances.
3. Run `python3 scripts/build.py`, then `python3 scripts/verify.py`.
4. Commit and push to `main`; GitHub Pages publishes the changes.

No dependencies or frontend framework required. For a local preview: `python3 -m http.server 8000`.

**Unpublished material:** `published:false` excludes an entry from the built website, but this is a PUBLIC repository. Keep actual secret future text outside this repository until ready to release it. This flag is editorial convenience, not access control.

## RSVP

The invitation currently asks guests to confirm directly with their host. No form submission is simulated. Set `rsvpUrl` in `content/site.json` to a real hosted RSVP form when the host chooses a destination, then rebuild. Guest responses must not be committed to this public repository.

## Art and accessibility

Custom generated Institute frontispiece; code-native crest, seasonal overlay, ornaments, evidence illustration, and schematic animated route map. Assets are committed locally, including fonts. Text is selectable and readable without JavaScript. Map animation respects reduced motion; entry navigation works without scripts. The map is intentionally illustrative, not a navigational chart.

The spoken admission phrase is “Today belongs to the rat.” There is no website password gate. The public invitation includes only Covington, Kentucky, never the private street address.
