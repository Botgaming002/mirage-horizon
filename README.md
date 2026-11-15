# 🚀 MIRAGE HORIZON: Solar Gravitational Lens Mission Simulator

[![NASA Space Apps Challenge](https://img.shields.io/badge/NASA%20Space%20Apps-Challenge%20Project-0b3d91.svg)](https://www.spaceappschallenge.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React 18](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff.svg)](https://vitejs.dev/)

**MIRAGE HORIZON** is an interactive, browser-playable space mission design game created for the **NASA Space Apps Challenge: Space Mission Design Game**.

As Mission Commander, design, launch, and operate a simulated expedition to the **Solar Gravitational Lens (SGL)** focal region at **650 AU**. Balance payload, mass, power, propulsion and budget while exploring a hypothetical exoplanet-imaging mission.

**[▶ Play Mirage Horizon](https://botgaming002.github.io/mirage-horizon/)** · [Space Mission Design Game challenge](https://www.spaceappschallenge.org/2026/challenges/space-mission-design-game/)

> **Simulation disclosure:** This is an educational game, not mission-planning software. Its trajectories, engineering values, scores, planetary surfaces, atmospheric results and biosignatures are simulated or illustrative—not real observations or engineering predictions.

---

## 🎮 Complete 9-Phase Game Pipeline

The game is structured as a continuous 9-phase mission lifecycle:

```
[01: HOMEPAGE] ➔ [02: STORYLINE] ➔ [03: TUTORIAL] ➔ [04: MISSION BRIEF]
        ⬇
[05: ROCKET CUSTOMIZATION (SFS Style)] ➔ [06: LAUNCH & CRUISE]
        ⬇
[07: EINSTEIN RING EXPERIMENT] ➔ [08: BACK TO EARTH] ➔ [09: DATA ANALYSIS]
```

1. **Homepage:** Cinematic game menu with real-time canvas starfields, glowing Einstein Ring corona diffraction, procedural audio synthesizer, and quick-start actions.
2. **Storyline:** Visual novel narrative featuring Director Maria Chen and Dr. Elena Vasquez detailing why existing space telescopes hit diffraction limits and how the Sun acts as an optical amplifier.
3. **Tutorial:** Step-by-step interactive diagrams teaching relativistic gravitational lensing, the 550–650 AU focal baseline, spacecraft staging rules, and trade-off mechanics.
4. **Mission Brief:** Choose from three target exoplanets (LHS 1140 b, L 98-59 d, GJ 357 b), set focal distance and budget, and review mission objectives and risks.
5. **Rocket Customization (Spaceflight Simulator Style):** Assemble fairings, a command core, propellant tanks, engines and power components. The hangar shows modeled thrust-to-weight ratio, delta-v, power checks and cost.
6. **Launching & Flying:** Interactive T-minus 10s countdown, throttle control, atmospheric ascent with fire/smoke particle physics, stage separation, and 2D orbital cruise map across Mars, Jupiter (gravity assist slingshot), Neptune, and Voyager 1 to 650 AU.
7. **Einstein Ring Experiment:** Use a simulated coronagraph, alignment controls and spectral filters to produce an illustrative reconstruction.
8. **Back to Earth:** A simulated Deep Space Network transmission visualizes the long light-travel delay and packet stream.
9. **Data Analysis of the Result:** Review a simulated score, synthetic surface map, illustrative atmospheric breakdown and engineering trade-offs.

---

## 🛠 Spacecraft Engineering & Staging System (SFS Mechanics)

Inspired by *Spaceflight Simulator* and *Kerbal Space Program*, the customization hangar features:
- **Full Drag-and-Drop & Click-to-Equip:** Drag parts from the inventory onto vertical stage slots or click to mount automatically.
- **Simplified Staging Balance:**
  - **Thrust-to-Weight Ratio ($TWR$):** Rocket must produce enough thrust ($F / mg > 1.0$) to overcome Earth gravity.
  - **Electrical Balance:** Deep-space instruments consume watts continuously. Solar arrays fade drastically past Jupiter ($1/r^2$), requiring Plutonium MMRTGs or compact fission reactors.
  - **Mass vs Delta-V:** Adding mass affects the modeled vehicle's performance.
  - **Financial Discipline:** Stay within the Coalition budget limit.

---

## 🔬 Data, attribution & simulation limits

| Resource | How it relates to the game | Attribution / use conditions |
| --- | --- | --- |
| [NASA Exoplanet Archive — Planetary Systems Table](https://doi.org/10.26133/NEA12) | `src/data.js` includes hard-coded target names and planetary parameters and identifies this table as their source. These values are not fetched live; their individual source references and dates still need verification. | [Archive acknowledgment guidance](https://exoplanetarchive.ipac.caltech.edu/docs/acknowledge.html); acknowledge the underlying literature for each verified value. |
| [NASA Voyager mission](https://science.nasa.gov/mission/voyager/) | The tutorial and flight view use an approximate 160 AU Voyager 1 milestone for scale; it is not live telemetry. | [NASA media usage guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/). |
| [Space Mission Design Game challenge](https://www.spaceappschallenge.org/2026/challenges/space-mission-design-game/) | The challenge frames the mission-design and resource-tradeoff objective. | Check the challenge's **Resources** tab and its applicable terms. |

The target catalog is a starting point, not an observation feed. Habitability scores, atmosphere descriptions, rocket-part specifications, orbital paths, reconstructions and mission outcomes are game models or narrative assumptions. The displayed planet images and biosignatures are **not evidence of a real exoplanet surface or life**.

**Archive acknowledgment:** This project refers to the NASA Exoplanet Archive, operated by the California Institute of Technology under contract with NASA under the Exoplanet Exploration Program. See the [archive's requested acknowledgment and citation](https://exoplanetarchive.ipac.caltech.edu/docs/acknowledge.html).

**Source count:** The code explicitly attributes target parameters to one NASA dataset: the Exoplanet Archive's Planetary Systems Table. The Voyager distance is a fixed illustrative milestone, not a second dataset or live feed. The dataset's individual values and provenance have not been fully verified; for example, the game's 2.3 Earth-mass value for L 98-59 d differs from the current composite table's 1.64 Earth masses (checked November 15, 2026). Catalog solutions and estimates can differ.

**Submission check:** The team still needs to verify the individual data values and sources, and confirm that at least one NASA resource listed in this specific challenge's Resources tab is meaningfully used. A citation alone does not establish eligibility.

### Software and external resources

- [React and React DOM](https://github.com/facebook/react/blob/main/LICENSE) — UI library; MIT license.
- [Vite](https://github.com/vitejs/vite/blob/main/LICENSE) and [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/LICENSE) — build tools; MIT licenses. `package-lock.json` records transitive dependencies; their individual licenses also apply.
- [DM Sans](https://github.com/google/fonts/blob/main/ofl/dmsans/OFL.txt), [DM Mono](https://github.com/google/fonts/blob/main/ofl/dmmono/OFL.txt), and [Space Grotesk](https://github.com/google/fonts/blob/main/ofl/spacegrotesk/OFL.txt) — fonts loaded through Google Fonts; SIL Open Font License 1.1.
- [Shields.io](https://shields.io/) — README badges. The game uses procedurally drawn visuals and synthesized audio; any additional external assets should be attributed by the team.

---

## 💻 Quick Start & Local Execution

### Prerequisites
- Node.js (v18+) & npm

### Installation & Launch
```bash
# Clone the repository
git clone https://github.com/Botgaming002/mirage-horizon.git
cd mirage-horizon

# Install dependencies
npm install

# Start development server
npm run dev
```
Open your browser at `http://localhost:5173`.

### Production Build
```bash
npm run build
```
The compiled, zero-dependency static production bundle will be generated in `dist/`, ready for immediate hosting on **GitHub Pages**, Vercel, or Netlify.

---

## 📁 Repository Structure

```
mirage-horizon/
├── index.html                 # HTML5 entry point
├── package.json               # Node dependencies & build scripts
├── vite.config.js             # Vite bundler configuration
├── src/
│   ├── main.jsx               # React DOM root entry
│   ├── App.jsx                # Global phase state orchestrator
│   ├── audio.js               # Web Audio API sound synthesizer
│   ├── data.js                # Exoplanet dossiers, parts catalog, presets
│   ├── style.css              # Cyberpunk sci-fi HUD theme & responsive styles
│   └── components/
│       ├── Navbar.jsx         # Global status header & handbook modal
│       ├── Homepage.jsx       # Phase 1: Interactive canvas game title screen
│       ├── Storyline.jsx      # Phase 2: Visual novel narrative chapters
│       ├── Tutorial.jsx       # Phase 3: Interactive relativistic optics academy
│       ├── MissionBrief.jsx   # Phase 4: Target selection & mission parameters
│       ├── RocketCustomization.jsx # Phase 5: SFS-style drag-and-drop rocket builder
│       ├── LaunchFlight.jsx   # Phase 6: Countdown, ascent & 650 AU cruise map
│       ├── EinsteinRing.jsx   # Phase 7: SGL coronagraph experiment & optics
│       ├── BackToEarth.jsx    # Phase 8: DSN deep-space telemetry downlink
│       └── DataAnalysis.jsx   # Phase 9: Planetary discovery & score debrief
```

---

## 📜 Credits & License

- Created for the **NASA Space Apps Challenge**.
- Original project code is available under the [MIT License](LICENSE). Third-party resources retain their own licenses and conditions.

### AI disclosure

OpenWork's AI and google antigravity assistant helped with repository redesign/deployment,README documentation and game's source code.
