# 🚀 MIRAGE HORIZON: Solar Gravitational Lens Mission Simulator

[![NASA Space Apps Challenge](https://img.shields.io/badge/NASA%20Space%20Apps-Challenge%20Project-0b3d91.svg)](https://www.spaceappschallenge.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React 18](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff.svg)](https://vitejs.dev/)

**MIRAGE HORIZON** is an interactive, browser-playable space mission design game created for the **NASA Space Apps Challenge: Space Mission Design Game**.

Instead of a passive website, *Mirage Horizon* puts the player in the role of Mission Commander to design, launch, and execute a deep-space expedition to the **Solar Gravitational Lens (SGL)** focal line at **650 AU**. Utilizing our Sun's massive gravitational field as a natural cosmic magnifying glass, the mission seeks to resolve humanity's first surface portrait and atmospheric biosignatures of a distant exoplanet,to play on github page please visit https://botgaming002.github.io/mirage-horizon/.

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
4. **Mission Brief:** Strategic classified docket with 3 target exoplanets from the NASA Exoplanet Archive (LHS 1140 b, L 98-59 d, GJ 357 b), focal distance & budget sliders, objectives checklist, and risk matrix.
5. **Rocket Customization (Spaceflight Simulator Style):** Drag-and-drop vertical assembly hangar. Mount fairings, science payloads (coronagraph, spectrometer, polarimeter), power sources (MMRTG, fission reactor, solar), antennas, propellant tanks, and high-thrust/ion engines. Live telemetry validates Thrust-to-Weight Ratio (TWR > 1.0), electrical power margin, and budget.
6. **Launching & Flying:** Interactive T-minus 10s countdown, throttle control, atmospheric ascent with fire/smoke particle physics, stage separation, and 2D orbital cruise map across Mars, Jupiter (gravity assist slingshot), Neptune, and Voyager 1 to 650 AU.
7. **Einstein Ring Experiment:** The scientific climax! Coronagraph Lyot mask occults the Sun. Players use directional reaction thrusters to center telescope crosshairs on the focal line, apply multi-spectral filters (Visible, Thermal IR, Spectrometer), and integrate photon exposures to deconvolve the exoplanet's surface.
8. **Back to Earth:** Deep Space Network (DSN) telemetry transmission across 650 AU with real-time 3.7-day light delay visualization, packet stream flow, and ground station antenna locking.
9. **Data Analysis of the Result:** Comprehensive mission scoring (0–100 with Grade S/A/B/C/D), reconstructed surface map showing continents and ocean glint, atmospheric chemical breakdown (N₂, O₂, H₂O, CO₂, CH₄ biosignatures), habitability index, and engineering trade-off debrief.

---

## 🛠 Spacecraft Engineering & Staging System (SFS Mechanics)

Inspired by *Spaceflight Simulator* and *Kerbal Space Program*, the customization hangar features:
- **Full Drag-and-Drop & Click-to-Equip:** Drag parts from the inventory onto vertical stage slots or click to mount automatically.
- **Physical Staging Balance:**
  - **Thrust-to-Weight Ratio ($TWR$):** Rocket must produce enough thrust ($F / mg > 1.0$) to overcome Earth gravity.
  - **Electrical Balance:** Deep-space instruments consume watts continuously. Solar arrays fade drastically past Jupiter ($1/r^2$), requiring Plutonium MMRTGs or compact fission reactors.
  - **Mass vs Delta-V:** Excessive mass slows down the 40-year interstellar cruise.
  - **Financial Discipline:** Stay within the Coalition budget limit.
- **1-Click Pre-Built Templates:** Quick-start with *Explorer Prime (Balanced)*, *Optical Courier (Fast Transit)*, or *Heavy Science Titan*.

---

## 🔬 Scientific Background & Data Sources

- **Solar Gravitational Lens (SGL):** Under General Relativity, the Sun's mass bends light grazing its limb to a focal axis beginning at $\sim 550\text{ AU}$. At $650\text{ AU}$, solar corona plasma noise is reduced, enabling a magnification factor of $\sim 10^{11}$—theoretically capable of resolving $\sim 10\text{ km}$ surface features on an exoplanet 40 light-years away.
- **NASA Exoplanet Archive:** Planetary targets (LHS 1140 b, L 98-59 d, GJ 357 b) incorporate catalog radius, mass, stellar type, equilibrium temperature, and orbital period data (Table DOI: [10.26133/NEA12](https://doi.org/10.26133/NEA12)).
- **NASA Horizons & Voyager Telemetry:** Mission flight milestones reflect historical Voyager 1 trajectory scales (Heliopause crossing at $\sim 120\text{ AU}$, current distance $\sim 160\text{ AU}$).
- *Disclosure:* Component specifications, orbital trajectories, and procedurally reconstructed surface images are educational simulation models created for gameplay.

---

## 💻 Quick Start & Local Execution

### Prerequisites
- Node.js (v18+) & npm

### Installation & Launch
```bash
# Clone the repository
git clone https://github.com/your-username/mirage-horizon.git
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
- Distributed under the **MIT License**.
