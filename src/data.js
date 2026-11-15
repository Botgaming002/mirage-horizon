// Game Data for Mirage Horizon: Mission Design Simulator

export const EXOPLANETS = [
  {
    id: 'lhs1140b',
    name: 'LHS 1140 b',
    type: 'Rocky Super-Earth',
    constellation: 'Cetus',
    distanceLy: 40.7,
    radiusEarth: 1.73,
    massEarth: 5.6,
    starType: 'M4.5 V (Red Dwarf)',
    starMass: 0.18,
    eqTempK: 235, // -38°C, potential liquid water with greenhouse effect
    orbitDays: 24.7,
    habitabilityIndex: 88,
    atmosphereConfidence: 'High (Dense atmosphere expected)',
    discoveryMethod: 'Transit (MEarth Project / HARPS)',
    nasaArchiveDoi: '10.26133/NEA12',
    color: '#5bd9d0',
    terrainType: 'Ocean-Continental Hybrid',
    description: 'A rocky super-Earth orbiting in the habitable zone of a calm red dwarf. Prime candidate for detecting liquid water and atmospheric biogases via solar gravitational lensing.',
    scientificGoal: 'Search for H2O absorption bands and biosignature gases (O2/CH4).'
  },
  {
    id: 'l9859d',
    name: 'L 98-59 d',
    type: 'Sub-Neptune / Ocean World',
    constellation: 'Volans',
    distanceLy: 34.6,
    radiusEarth: 1.57,
    massEarth: 2.3,
    starType: 'M3 V (Red Dwarf)',
    starMass: 0.31,
    eqTempK: 416, // Warm
    orbitDays: 7.45,
    habitabilityIndex: 65,
    atmosphereConfidence: 'Very High (Volatile-rich envelope)',
    discoveryMethod: 'Transit (TESS / VLT ESPRESSO)',
    nasaArchiveDoi: '10.26133/NEA12',
    color: '#f3ab70',
    terrainType: 'Supercritical Water / Dense Clouddeck',
    description: 'A volatile-rich transition world between terrestrial planets and gas dwarfs. Offers exceptional signal-to-noise ratio for studying atmospheric photochemistry.',
    scientificGoal: 'Analyze vapor canopy pressure and greenhouse runaway thresholds.'
  },
  {
    id: 'gj357b',
    name: 'GJ 357 b',
    type: 'Hot Terrestrial Planet',
    constellation: 'Hydra',
    distanceLy: 31.4,
    radiusEarth: 1.22,
    massEarth: 1.84,
    starType: 'M2.5 V (Quiet M-Dwarf)',
    starMass: 0.34,
    eqTempK: 525,
    orbitDays: 3.93,
    habitabilityIndex: 42,
    atmosphereConfidence: 'Moderate (Stripped or heavy mineral vapor)',
    discoveryMethod: 'Transit (TESS / CARMENES)',
    nasaArchiveDoi: '10.26133/NEA12',
    color: '#89a7ff',
    terrainType: 'Silicate Basalt & Magma Basins',
    description: 'The closest target in the survey. While too hot for liquid water on the surface, its high thermal emission allows unmatched calibration of our coronagraph optics.',
    scientificGoal: 'Validate exoplanet surface mineral spectroscopy through the SGL.'
  }
];

export const PART_CATEGORIES = [
  { id: 'fairing', name: 'Fairings & Structure', icon: '⬡', color: '#70ddd1' },
  { id: 'payload', name: 'Science Payloads', icon: '◎', color: '#bd9aff' },
  { id: 'power', name: 'Power & Energy', icon: '⚡', color: '#f6cb77' },
  { id: 'comms', name: 'Communications', icon: '📡', color: '#84a8ff' },
  { id: 'tank', name: 'Fuel Tanks', icon: '🛢', color: '#70dfaa' },
  { id: 'engine', name: 'Rocket Engines', icon: '🔥', color: '#ff7c82' },
  { id: 'utility', name: 'Avionics & Utility', icon: '⚙', color: '#e5c07b' }
];

export const ROCKET_PARTS = [
  // FAIRINGS & STRUCTURE
  {
    id: 'fairing_aero',
    name: 'Titanium Aerodynamic Fairing',
    category: 'fairing',
    type: 'Fairing',
    mass: 140,
    cost: 75,
    power: 0,
    powerUse: 0,
    drag: 0.12,
    desc: 'Streamlined composite nose cone that shields science instruments during atmospheric ascent.',
    hint: 'Essential at the top of your rocket for aerodynamic launch.',
    icon: '▲'
  },
  {
    id: 'fairing_heavy',
    name: 'Shielded Deep-Space Bus',
    category: 'fairing',
    type: 'Bus',
    mass: 380,
    cost: 160,
    power: 0,
    powerUse: 40,
    drag: 0.22,
    desc: 'Heavy-duty spacecraft truss structure with lead-tantalum radiation shielding for 40-year interstellar survival.',
    hint: 'Provides superior structural integrity in deep radiation belts.',
    icon: '⬢'
  },

  // SCIENCE PAYLOADS
  {
    id: 'payload_coronagraph',
    name: 'Off-Axis SGL Coronagraph',
    category: 'payload',
    type: 'Telescope',
    mass: 220,
    cost: 240,
    power: 0,
    powerUse: 180,
    dataRate: 28, // Mb/day
    desc: 'High-precision optical coronagraph designed to block the blinding solar glare and image the Einstein Ring.',
    hint: 'Primary instrument needed to resolve exoplanet continents and clouds!',
    icon: '🔭'
  },
  {
    id: 'payload_spectrometer',
    name: 'Cryogenic IR Spectrometer',
    category: 'payload',
    type: 'Spectrometer',
    mass: 120,
    cost: 160,
    power: 0,
    powerUse: 130,
    dataRate: 16,
    desc: 'Splits Einstein Ring starlight into spectral wavelengths to detect Water (H2O), Oxygen (O2), and Methane (CH4).',
    hint: 'Unlocks atmospheric chemical signature analysis in the final report.',
    icon: '🌈'
  },
  {
    id: 'payload_polarimeter',
    name: 'Planetary Polarimeter',
    category: 'payload',
    type: 'Sensor',
    mass: 85,
    cost: 110,
    power: 0,
    powerUse: 75,
    dataRate: 10,
    desc: 'Measures polarized surface glint to confirm open oceans and atmospheric aerosols.',
    hint: 'Boosts habitability index confidence score.',
    icon: '✨'
  },

  // POWER
  {
    id: 'power_mmrtg',
    name: 'Next-Gen MMRTG Pair',
    category: 'power',
    type: 'RTG',
    mass: 360,
    cost: 230,
    power: 750, // Generates 750W
    powerUse: 0,
    desc: 'Plutonium-238 radioisotope thermoelectric generators. Provides reliable electrical power even at 650+ AU.',
    hint: 'Best choice for 650 AU where solar light is negligible.',
    icon: '☢'
  },
  {
    id: 'power_solar',
    name: 'Roll-Out Solar Array (ROSA)',
    category: 'power',
    type: 'Solar',
    mass: 150,
    cost: 120,
    power: 850,
    powerUse: 0,
    desc: 'Ultra-lightweight solar panels. Tremendous power inside 5 AU, but power drops by 1/r² in deep space.',
    hint: 'Lightweight for launch, but will fade drastically beyond Saturn!',
    icon: '☀️'
  },
  {
    id: 'power_fission',
    name: 'Kilopower Compact Fission Core',
    category: 'power',
    type: 'Reactor',
    mass: 480,
    cost: 320,
    power: 1200,
    powerUse: 0,
    desc: 'Stirling-cycle micro nuclear reactor. Unmatched power for high-bandwidth transmitters and ion thrusters.',
    hint: 'Heavy and expensive, but guarantees 100% positive power margin.',
    icon: '⚛'
  },

  // COMMUNICATIONS
  {
    id: 'comms_hga',
    name: '3.7m Deployable High-Gain Dish',
    category: 'comms',
    type: 'Antenna',
    mass: 145,
    cost: 140,
    power: 0,
    powerUse: 120,
    bandwidthMultiplier: 1.2,
    desc: 'Carbon-composite parabolic reflector tuned to Ka-band frequencies for communicating across 650 AU.',
    hint: 'Required to beam Einstein Ring high-resolution data back to Earth.',
    icon: '📡'
  },
  {
    id: 'comms_laser',
    name: 'Deep-Space Lasercomm Terminal',
    category: 'comms',
    type: 'Optical',
    mass: 190,
    cost: 210,
    power: 0,
    powerUse: 220,
    bandwidthMultiplier: 2.5,
    desc: 'Infrared optical laser transmitter capable of 10x higher data throughput than standard radio dishes.',
    hint: 'Provides the fastest data transmission during the Back to Earth phase.',
    icon: '⚡'
  },

  // FUEL TANKS
  {
    id: 'tank_small',
    name: 'Hydrolox Fuel Tank - Stage 2',
    category: 'tank',
    type: 'Tank',
    mass: 450,
    cost: 110,
    fuelCapacity: 1800,
    desc: 'Cryogenic liquid hydrogen/oxygen upper stage tank for solar escape burn.',
    hint: 'Ideal for spacecraft insertion and cruise acceleration.',
    icon: '🧪'
  },
  {
    id: 'tank_booster',
    name: 'Heavy Booster Tank - Stage 1',
    category: 'tank',
    type: 'Tank',
    mass: 950,
    cost: 190,
    fuelCapacity: 4500,
    desc: 'High-density propellant core designed for the initial atmospheric climb.',
    hint: 'Essential to lift heavy payloads off the launchpad.',
    icon: '🛢'
  },

  // ENGINES
  {
    id: 'engine_chem',
    name: 'Vulkan Hydrolox Engine',
    category: 'engine',
    type: 'Chemical',
    mass: 320,
    cost: 170,
    thrustKn: 650, // kN
    isp: 450, // seconds
    power: 0,
    powerUse: 25,
    desc: 'High-thrust chemical rocket engine providing the muscle needed to break free from Earth orbit.',
    hint: 'High thrust to ensure TWR > 1.2 for a successful launch.',
    icon: '🚀'
  },
  {
    id: 'engine_ion',
    name: 'NEXT-C Ion Propulsion Drive',
    category: 'engine',
    type: 'Electric',
    mass: 190,
    cost: 220,
    thrustKn: 12, // High ISP, low thrust
    isp: 4200,
    power: 0,
    powerUse: 340,
    desc: 'High-efficiency xenon ion engine that can thrust continuously for 15 years to reach 650 AU in record time.',
    hint: 'Requires high electrical power, but provides huge long-term speed.',
    icon: '⚡'
  },

  // UTILITY
  {
    id: 'util_reaction',
    name: 'Precision Reaction Wheels & Star Tracker',
    category: 'utility',
    type: 'Attitude',
    mass: 65,
    cost: 70,
    power: 0,
    powerUse: 45,
    pointingAccuracy: 0.98,
    desc: 'Sub-arcsecond pointing control to keep the coronagraph locked on the Einstein Ring center.',
    hint: 'Significantly improves telescope alignment accuracy!',
    icon: '🎯'
  },
  {
    id: 'util_thermal',
    name: 'Automated Thermal Louvers & Aerogel',
    category: 'utility',
    type: 'Thermal',
    mass: 75,
    cost: 60,
    power: 0,
    powerUse: 20,
    desc: 'Prevents cryogenic instrument sensor freeze in deep interstellar vacuum (3 Kelvin).',
    hint: 'Reduces equipment degradation over the 40-year flight.',
    icon: '❄'
  }
];

export const PRESET_BUILDS = [
  {
    name: 'Explorer Prime (Recommended)',
    desc: 'Balanced deep-space flagship with high-thrust booster, ion cruise drive, MMRTG power, and dual spectrometers.',
    parts: [
      'fairing_aero',
      'payload_coronagraph',
      'payload_spectrometer',
      'power_mmrtg',
      'comms_hga',
      'util_reaction',
      'tank_small',
      'tank_booster',
      'engine_chem'
    ]
  },
  {
    name: 'Optical Courier (Fast Transit)',
    desc: 'Lightweight build with laser optical communications and dual ion drives for maximum cruise velocity.',
    parts: [
      'fairing_aero',
      'payload_coronagraph',
      'power_mmrtg',
      'comms_laser',
      'util_reaction',
      'tank_small',
      'engine_ion'
    ]
  },
  {
    name: 'Heavy Science Titan',
    desc: 'Comprehensive multi-spectral suite powered by a fission reactor, capable of maximum data discovery.',
    parts: [
      'fairing_heavy',
      'payload_coronagraph',
      'payload_spectrometer',
      'payload_polarimeter',
      'power_fission',
      'comms_laser',
      'util_thermal',
      'tank_booster',
      'engine_chem'
    ]
  }
];

export const STORY_CHAPTERS = [
  {
    id: 'intro',
    title: 'ACT I: THE LIMITS OF HUMAN VISION',
    speaker: 'Flight Director Maria Chen',
    avatar: '👩‍🚀',
    role: 'Global Space Exploration Directorate',
    text: 'Commander, welcome to Mission Control. For over two centuries, humanity has stared at distant stars asking if we are alone. Even the James Webb Space Telescope could only show us exoplanets as single, blurred pixels.',
    subtext: 'Earth-based radio arrays have picked up tantalizing bio-signatures, but conventional optics cannot resolve continents, clouds, or oceans across light-years.'
  },
  {
    id: 'einstein',
    title: 'ACT II: THE COSMIC LENS',
    speaker: 'Dr. Elena Vasquez',
    avatar: '🔬',
    role: 'Chief Relativistic Astrophysicist',
    text: 'Albert Einstein’s General Relativity showed that massive objects warp spacetime. Our own Sun acts as a monumental gravitational lens—bending and focusing the light from distant planetary systems into an Einstein Ring with over 100,000,000x magnification!',
    subtext: 'To use this natural cosmic telescope, our spacecraft must reach the solar gravitational focal line—beginning at 550 AU and optimizing around 650 AU, far beyond Pluto and Voyager 1.'
  },
  {
    id: 'assignment',
    title: 'ACT III: THE APPOINTMENT',
    speaker: 'Flight Director Maria Chen',
    avatar: '👩‍🚀',
    role: 'Global Space Exploration Directorate',
    text: 'Commander, you have been appointed to oversee Project MIRAGE HORIZON. You will select our target exoplanet, custom-build the spacecraft component-by-component, execute the launch, align with the Einstein Ring, and relay humanity’s first real exoplanet surface portrait back to Earth.',
    subtext: 'Every engineering decision carries consequences: mass limits acceleration, instruments consume power, and every dollar spent comes from our global budget. The journey begins now.'
  }
];

export const TUTORIAL_SLIDES = [
  {
    title: '1. What is an Einstein Ring?',
    badge: 'RELATIVISTIC OPTICS',
    diagram: 'lens',
    content: 'When a distant exoplanet, our Sun, and our spacecraft line up in an exact line, the Sun’s gravitational field bends light rays around its rim. Instead of a single blurry point, the light wraps into a glowing halo known as an Einstein Ring.',
    tip: '💡 The Einstein Ring concentrates starlight by millions of times, allowing us to resolve 10 km surface features across dozens of light-years!'
  },
  {
    title: '2. The 550–650 AU Focal Line',
    badge: 'MISSION PROFILE',
    diagram: 'distance',
    content: 'Because the Sun is so large, light rays skimming its surface don’t converge until at least 550 Astronomical Units away (1 AU = Earth-Sun distance). At 650 AU, the spacecraft enters a prime sweet spot with reduced solar corona glare.',
    tip: '💡 Voyager 1 took 40+ years to reach ~160 AU. Your spacecraft needs an efficient propulsion system to make the journey feasible!'
  },
  {
    title: '3. Building Your Rocket (SFS Style)',
    badge: 'VEHICLE ASSEMBLY',
    diagram: 'assembly',
    content: 'In the Rocket Customization hangar, drag and snap parts from the catalog into your launch vehicle stack. Your rocket must balance 3 critical engineering rules:',
    rules: [
      'Thrust-to-Weight Ratio (TWR > 1.0): Needs enough engine thrust to escape Earth gravity.',
      'Positive Power Margin: RTGs or Solar panels must produce more Watts than your payload consumes.',
      'Budget & Mass: Keep total spacecraft cost within your allocated credit limit.'
    ],
    tip: '💡 You can drag parts onto the rocket slots or click to quickly equip/unequip them.'
  },
  {
    title: '4. The Mission Execution Loop',
    badge: 'FLIGHT OPERATIONS',
    diagram: 'loop',
    content: 'Once built, you will pilot the mission across all phases: countdown & staging, solar system cruise, coronagraph alignment on the Einstein Ring, deep-space data transmission, and final spectral analysis of alien atmospheres.',
    tip: '💡 Ready to make history? Review the Mission Brief to choose your planetary destination!'
  }
];
