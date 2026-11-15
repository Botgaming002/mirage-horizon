// Realistic Rocket Parts Catalog modeled after Spaceflight Simulator (SFS) & Real Spaceflight Physics
// Enhanced with higher thruster power for an accessible, fun launch experience

export const SFS_PARTS = [
  // COMMAND & PAYLOAD
  {
    id: 'sfs_capsule',
    name: 'Command & Probe Core',
    category: 'command',
    type: 'Command',
    dryMass: 1.2, // tonnes
    wetMass: 1.2,
    cost: 120,
    width: 2,
    height: 1.8,
    desc: 'Autonomous deep-space avionics core with star-tracker attitude control and coronagraph optics bay.',
    iconSvg: 'capsule'
  },
  {
    id: 'sfs_nosecone',
    name: 'Aerodynamic Fairing Cone',
    category: 'fairing',
    type: 'Nosecone',
    dryMass: 0.6,
    wetMass: 0.6,
    cost: 50,
    dragCoeff: 0.06,
    width: 2,
    height: 1.4,
    desc: 'Streamlined composite fairing that prevents atmospheric Max-Q structural breakup.',
    iconSvg: 'nosecone'
  },
  {
    id: 'sfs_booster_nose',
    name: 'Radial Booster Nosecone',
    category: 'fairing',
    type: 'Radial Nosecone',
    dryMass: 0.5,
    wetMass: 0.5,
    cost: 40,
    dragCoeff: 0.08,
    width: 1.5,
    height: 1.6,
    desc: 'Slanted aerodynamic nosecone for side strap-on booster tanks.',
    iconSvg: 'booster_nose'
  },

  // STRUCTURAL & DECOUPLERS
  {
    id: 'sfs_decoupler',
    name: 'Staging Decoupler Ring',
    category: 'structure',
    type: 'Decoupler',
    dryMass: 0.3,
    wetMass: 0.3,
    cost: 30,
    width: 2,
    height: 0.5,
    desc: 'Pneumatic separation ring to jettison spent booster stages in flight.',
    iconSvg: 'decoupler'
  },
  {
    id: 'sfs_interstage',
    name: 'Interstage Truss',
    category: 'structure',
    type: 'Truss',
    dryMass: 0.4,
    wetMass: 0.4,
    cost: 45,
    width: 2,
    height: 1.2,
    desc: 'Open-lattice structural cage allowing hot-staging ignition of upper stage engines.',
    iconSvg: 'interstage'
  },

  // FUEL TANKS (Liquid Hydrolox / Kerolox)
  {
    id: 'sfs_tank_small',
    name: 'Fuel Tank (Small - 10t)',
    category: 'tanks',
    type: 'Fuel Tank',
    dryMass: 0.8,
    fuelMass: 9.2,
    wetMass: 10.0,
    cost: 70,
    width: 2,
    height: 1.5,
    desc: 'Upper-stage cryogenic propellant tank for orbital circularization.',
    iconSvg: 'tank_small'
  },
  {
    id: 'sfs_tank_med',
    name: 'Fuel Tank (Medium - 20t)',
    category: 'tanks',
    type: 'Fuel Tank',
    dryMass: 1.6,
    fuelMass: 18.4,
    wetMass: 20.0,
    cost: 120,
    width: 2,
    height: 2.5,
    desc: 'Intermediate stage propellant tank with internal slosh baffles.',
    iconSvg: 'tank_med'
  },
  {
    id: 'sfs_tank_large',
    name: 'Fuel Tank (Large Core - 36t)',
    category: 'tanks',
    type: 'Fuel Tank',
    dryMass: 2.8,
    fuelMass: 33.2,
    wetMass: 36.0,
    cost: 190,
    width: 2,
    height: 4.0,
    desc: 'Heavy main booster core tank for sustained first-stage ascent.',
    iconSvg: 'tank_large'
  },
  {
    id: 'sfs_booster_tank',
    name: 'Radial Strap-on Tank (18t)',
    category: 'tanks',
    type: 'Side Tank',
    dryMass: 1.5,
    fuelMass: 16.5,
    wetMass: 18.0,
    cost: 110,
    width: 1.5,
    height: 3.0,
    desc: 'Side-mounted propellant tank with integrated hardpoint clamps.',
    iconSvg: 'tank_booster'
  },

  // HIGH-POWER ENGINES (Buffed for exciting, forgiving launches!)
  {
    id: 'sfs_engine_titan',
    name: 'Titan Heavy Lifter Engine',
    category: 'engines',
    type: 'Main Engine',
    dryMass: 2.8,
    wetMass: 2.8,
    cost: 220,
    thrustKn: 2400, // Buffed from 1200 kN -> 2400 kN!
    ispSea: 380,
    ispVac: 430,
    width: 2,
    height: 1.8,
    desc: 'Massive first-stage engine delivering 2,400 kN of thrust to easily lift heavy rockets off Earth.',
    iconSvg: 'engine_titan'
  },
  {
    id: 'sfs_engine_hawk',
    name: 'Hawk Booster Engine',
    category: 'engines',
    type: 'Booster Engine',
    dryMass: 1.8,
    wetMass: 1.8,
    cost: 160,
    thrustKn: 1600, // Buffed from 850 kN -> 1600 kN!
    ispSea: 350,
    ispVac: 400,
    width: 1.5,
    height: 1.5,
    desc: 'High-thrust compact engine providing 1,600 kN for strap-on side boosters.',
    iconSvg: 'engine_hawk'
  },
  {
    id: 'sfs_engine_frontier',
    name: 'Frontier Vacuum Engine',
    category: 'engines',
    type: 'Upper Stage',
    dryMass: 1.0,
    wetMass: 1.0,
    cost: 140,
    thrustKn: 650, // Buffed from 280 kN -> 650 kN!
    ispSea: 260,
    ispVac: 520,  // Superb 520s vacuum ISP for huge Delta-V!
    width: 2,
    height: 1.6,
    desc: 'High-expansion vacuum bell engine optimized for orbital injection and trans-Jupiter burns.',
    iconSvg: 'engine_frontier'
  },
  {
    id: 'sfs_engine_ion',
    name: 'NEXT Xenon Ion Drive',
    category: 'engines',
    type: 'Interstellar Cruise',
    dryMass: 0.6,
    wetMass: 0.6,
    cost: 210,
    thrustKn: 60, // Buffed from 15 kN -> 60 kN!
    ispSea: 80,
    ispVac: 5500, // 5,500s ISP
    width: 1.5,
    height: 1.2,
    desc: 'Electromagnetic ion thruster for sustained interplanetary acceleration to 650 AU.',
    iconSvg: 'engine_ion'
  },

  // POWER & DEEP SPACE
  {
    id: 'sfs_rtg',
    name: 'MMRTG Nuclear Core',
    category: 'power',
    type: 'RTG',
    dryMass: 0.7,
    wetMass: 0.7,
    cost: 180,
    powerW: 850,
    width: 1.5,
    height: 1.0,
    desc: 'Plutonium decay thermal battery. Vital for surviving 650 AU where sunlight is near zero.',
    iconSvg: 'rtg'
  },
  {
    id: 'sfs_solar_wings',
    name: 'Deployable Solar Arrays',
    category: 'power',
    type: 'Solar Wings',
    dryMass: 0.3,
    wetMass: 0.3,
    cost: 70,
    powerW: 1000,
    width: 2,
    height: 1.0,
    desc: 'Lightweight panels for near-Earth operations.',
    iconSvg: 'solar_wings'
  }
];

// Step-by-step assembly guideline definition for players
export const BUILDING_GUIDELINE_STEPS = [
  {
    step: 1,
    title: 'Aerodynamic Cap & Probe Core',
    desc: 'Place a Nosecone on top to reduce Max-Q drag, followed by the Command & Probe Core to control the vehicle.',
    recommendedPartIds: ['sfs_nosecone', 'sfs_capsule'],
    category: 'fairing',
    checkFn: (centerParts) => centerParts.some(p => p.id === 'sfs_nosecone') && centerParts.some(p => p.id === 'sfs_capsule')
  },
  {
    step: 2,
    title: 'Deep-Space Nuclear Power (MMRTG)',
    desc: 'Attach an MMRTG Nuclear Core. Solar panels lose 99% power past Jupiter, making RTG power mandatory at 650 AU.',
    recommendedPartIds: ['sfs_rtg'],
    category: 'power',
    checkFn: (centerParts) => centerParts.some(p => p.id === 'sfs_rtg')
  },
  {
    step: 3,
    title: 'Upper Vacuum Stage',
    desc: 'Mount a Fuel Tank (Small or Medium) and the Frontier Vacuum Engine for high-efficiency space maneuvers.',
    recommendedPartIds: ['sfs_tank_small', 'sfs_engine_frontier'],
    category: 'engines',
    checkFn: (centerParts) => centerParts.some(p => p.category === 'tanks') && centerParts.some(p => p.id === 'sfs_engine_frontier' || p.id === 'sfs_engine_ion')
  },
  {
    step: 4,
    title: 'Main Booster Stage',
    desc: 'Add a Large Core Fuel Tank (36t) and mount the Titan Heavy Lifter Engine (2,400 kN) at the base.',
    recommendedPartIds: ['sfs_tank_large', 'sfs_engine_titan'],
    category: 'engines',
    checkFn: (centerParts) => centerParts.some(p => p.id === 'sfs_engine_titan')
  },
  {
    step: 5,
    title: 'Optional: Strap-On Side Boosters',
    desc: 'Turn on Symmetry and add Radial Booster Nosecones + Side Tanks + Hawk Engines for massive liftoff TWR!',
    recommendedPartIds: ['sfs_booster_nose', 'sfs_booster_tank', 'sfs_engine_hawk'],
    category: 'tanks',
    checkFn: (centerParts, leftParts) => leftParts.length >= 2
  }
];

// Realistic Flight Physics Calculator
export function calculateRocketPhysics(centerParts, leftParts, rightParts, budget = 2500) {
  const allParts = [...centerParts, ...leftParts, ...rightParts];

  let totalDryMass = 0;
  let totalWetMass = 0;
  let totalLiftoffThrust = 0;
  let totalCost = 0;
  let hasNosecone = false;
  let hasCapsule = false;
  let hasRTG = false;
  let hasUpperVacuumEngine = false;
  let hasIonEngine = false;
  let hasBoosters = leftParts.length > 0 || rightParts.length > 0;
  let hasDecoupler = allParts.some(p => p.type === 'Decoupler' || p.type === 'Truss');

  allParts.forEach(p => {
    totalDryMass += p.dryMass || 0;
    totalWetMass += p.wetMass || 0;
    totalCost += p.cost || 0;

    if (p.id === 'sfs_engine_titan' || p.id === 'sfs_engine_hawk') {
      totalLiftoffThrust += p.thrustKn || 0;
    }
    if (p.id === 'sfs_engine_frontier') hasUpperVacuumEngine = true;
    if (p.id === 'sfs_engine_ion') hasIonEngine = true;
    if (p.category === 'fairing') hasNosecone = true;
    if (p.category === 'command') hasCapsule = true;
    if (p.id === 'sfs_rtg') hasRTG = true;
  });

  const liftoffWeightKn = totalWetMass * 9.81;
  const twr = liftoffWeightKn > 0 ? Number((totalLiftoffThrust / liftoffWeightKn).toFixed(2)) : 0;

  // Mass ratio of propellant
  const massRatio = totalDryMass > 0 ? totalWetMass / totalDryMass : 1;

  // Realistic Staged Delta-V calculation:
  // Base effective Isp for hydrolox booster stage
  let effectiveIsp = 410;
  if (hasUpperVacuumEngine) effectiveIsp += 60; // Frontier vacuum bell efficiency (470s)
  if (hasIonEngine) effectiveIsp += 140; // High-efficiency Xenon cruise boost

  // Staging multiplier: when side boosters or upper stages decouple, dry mass of burnt stages drops away
  let stagingMultiplier = 1.0;
  if (hasBoosters) stagingMultiplier += 0.25; // Booster jettison significantly boosts upper-stage mass ratio
  if (hasDecoupler) stagingMultiplier += 0.15; // Clean stage decoupling

  const deltaV = Math.round(effectiveIsp * 9.81 * Math.log(Math.max(1.01, massRatio)) * stagingMultiplier);

  // Proportional Delta-V requirement:
  // In real aerospace physics with Oberth effect & planetary gravity assist:
  // Earth ascent to LEO (~3,500 m/s) + Oberth solar escape injection (~700 m/s) = 4,200 m/s total!
  const requiredDeltaV = 4200;

  const checks = {
    hasCapsule: {
      passed: hasCapsule,
      label: 'Command / Probe Core Installed',
      detail: hasCapsule ? 'Avionics and coronagraph optics bay nominal.' : 'Missing probe core! Add Command & Probe Core to steer the rocket.'
    },
    hasNosecone: {
      passed: hasNosecone,
      label: 'Aerodynamic Fairing / Nosecone',
      detail: hasNosecone ? 'Max-Q drag coefficient: 0.06 (Pass)' : 'CRITICAL: No fairing! Rocket will break apart at Max-Q.'
    },
    twr: {
      passed: twr >= 1.25,
      label: `Liftoff TWR: ${twr} (Required: ≥ 1.25)`,
      detail:
        twr >= 1.25
          ? `Superb thrust for liftoff (TWR ${twr}).`
          : twr >= 1.0
          ? `TWR ${twr} is borderline. Add Hawk or Titan engines for a safer climb.`
          : `CRITICAL: TWR ${twr} < 1.0! Rocket is too heavy for engines.`
    },
    deltaV: {
      passed: deltaV >= requiredDeltaV,
      label: `Total Delta-V: ${deltaV.toLocaleString()} m/s (Goal: ≥ ${requiredDeltaV.toLocaleString()} m/s)`,
      detail:
        deltaV >= requiredDeltaV
          ? `Excellent propellant reserves (${deltaV.toLocaleString()} m/s). Ready for orbital insertion & solar escape burn!`
          : `Low Delta-V! Rocket has ${deltaV.toLocaleString()} m/s (Goal: ≥ ${requiredDeltaV.toLocaleString()} m/s). Add fuel tanks or an upper-stage Frontier engine.`
    },
    deepSpacePower: {
      passed: hasRTG,
      label: 'Deep-Space RTG Power System',
      detail: hasRTG
        ? 'Nuclear MMRTG installed. Continuous electrical power at 650 AU.'
        : 'CRITICAL: No MMRTG! Solar panels lose 99% power past Jupiter.'
    },
    budget: {
      passed: totalCost <= budget,
      label: `Budget Allocation: ${totalCost} / ${budget} CR`,
      detail: totalCost <= budget ? 'Within Coalition funding limits.' : `Over budget by ${totalCost - budget} CR!`
    }
  };

  const canLaunch = Object.values(checks).every(c => c.passed);

  return {
    totalDryMass: Number(totalDryMass.toFixed(1)),
    totalWetMass: Number(totalWetMass.toFixed(1)),
    totalLiftoffThrust,
    twr,
    deltaV,
    requiredDeltaV,
    totalCost,
    budgetLeft: budget - totalCost,
    checks,
    canLaunch
  };
}
