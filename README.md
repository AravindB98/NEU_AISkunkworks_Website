# neu_skunkworks_website

A simple static website for NEU Skunkworks.

## Contents

- `index.html` - main landing page
- `projects.html` - current and past projects
- `manifesto.html` - mission statement or manifesto
- `people.html` - crew roster, institutional dossier, and contact
- `events.html` - events and conversational intake terminal
- `scripts/main.js` - site behavior (mobile nav, crew TOC, light/dark toggle)
- `scripts/intake.js` - intake terminal on events page
- `styles/` - CSS styles for layout, components, tokens, and crew page

## Local Preview

Open any `.html` file directly in your browser, or use a simple local server for a better development workflow.

### Recommended

```powershell
cd d:\Projects\neu_skunkworks_website
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Notes

- This is a static website, with no build step required.
- Add any assets, tooling, or environment files to `.gitignore` as needed.

## Theme

- Palette: white / black / Northeastern red (`#c8102e`), with yellow (`--signal`) for highlights and the mascot's circuitry. All colors live in `styles/tokens.css`.
- Light/dark: the toggle in the header sets `data-theme` on `<html>` and remembers the choice in `localStorage` (`skunkworks-theme`). With no saved choice the site follows the OS setting. A small inline script in each page's `<head>` applies the theme before paint so there is no flash.

## Mascot

The running skunk next to the logo is an inline SVG in each page's header, animated entirely in CSS (`.skunk*` rules at the end of `styles/components.css`). One 12-second loop: sits by the logo, runs out along the circuit trace, sits, turns, runs home, sits facing the logo. Visitors with "reduce motion" enabled see it sitting still.

If you change the SVG, update it in all five HTML files — the markup is identical in each.

## Typography

IBM Plex Sans for all text (headings and body), IBM Plex Mono only inside the intake terminal. Loaded from Google Fonts; set in `styles/tokens.css` (`--sans`, `--code`).

## Joining

"Join us" in the header, the home hero, the Crew page CTA and every footer link to the Microsoft Forms membership form.

## Home hero twister

`scripts/twister.js` (home page only) draws a spinning funnel of circuit rings and three skunks that spiral up it, each wearing smart goggles, an LED collar, a wrist watch, and a tail drone. Geometry and timing constants are at the top of the file; the look lives under "Twister animation" in `styles/pages-index.css`. It pauses when scrolled out of view or when the tab is hidden, and shows a still frame for visitors with "reduce motion" enabled.
