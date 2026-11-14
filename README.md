# Mirage Horizon

Browser-playable 2.5D mission-design game. Configure a spacecraft, balance mass, power and budget, select an exoplanet catalog target and focal-distance scenario, then run a mission simulation.

## Run locally

```sh
npm install
npm run dev
```

Build for static hosting / GitHub Pages with `npm run build`; output is in `dist/`.

## Science and simulation disclosure
- Component specifications, power, cost, data rates, mission score and outcomes are simplified game assumptions, not engineering guidance or flight predictions.
- The ring visualization is procedurally generated synthetic art—not an image, surface map or actual Solar Gravitational Lens observation of the selected exoplanet.
- 550 AU is an idealized lower bound discussed in literature, not a universal mission threshold; distance is a scenario setting.
- Target names and displayed values are approximate NASA Exoplanet Archive Planetary Systems table examples. Verify current records before formal submission.

## Sources and acknowledgments
- NASA Exoplanet Archive, Planetary Systems: https://exoplanetarchive.ipac.caltech.edu/ — DOI https://doi.org/10.26133/NEA12. Examples include LHS 1140 b, L 98-59 d and GJ 357 b.
- Landis (2016), Solar Gravitational Lens discussion: https://arxiv.org/abs/1604.06351. Background only; no figures/text reproduced.
- NASA/JPL Horizons API documentation: https://ssd.jpl.nasa.gov/doc/horizons.html. Potential future trajectory context; this demo does not fetch ephemerides.
- Concept based on the supplied API-TEST Mirage Horizon guide, implemented as a standalone non-Unity game in a separate repository.
- AI disclosure: AI assistance generated initial game code, interface copy and synthetic CSS illustrations. Gameplay values are illustrative assumptions.

Static React/Vite app; no server or key required. Google Fonts is an optional external dependency; system fallbacks are provided.
