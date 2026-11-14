import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const modules = [
  { id: 'bus', name: 'Deep-space bus', type: 'Structure', mass: 620, power: 220, cost: 155, data: 0, desc: 'Radiation-hardened frame, avionics & reaction wheels.' },
  { id: 'rtg', name: 'MMRTG pair', type: 'Power', mass: 420, power: 780, cost: 210, data: 0, desc: 'Steady power far from the Sun. Simplified design values.' },
  { id: 'solar', name: 'Roll-out solar array', type: 'Power', mass: 180, power: 900, cost: 125, data: 0, desc: 'Lightweight near the inner system; output fades with distance.' },
  { id: 'ion', name: 'NEXT ion drive', type: 'Propulsion', mass: 210, power: 360, cost: 190, data: 0, desc: 'Efficient cruise propulsion with a substantial power draw.' },
  { id: 'chemical', name: 'Chemical stage', type: 'Propulsion', mass: 310, power: 30, cost: 110, data: 0, desc: 'High-thrust insertion and course correction.' },
  { id: 'telescope', name: 'Coronagraph & telescope', type: 'Science', mass: 190, power: 240, cost: 185, data: 22, desc: 'Studies target light; no real exoplanet imagery is generated.' },
  { id: 'spectrometer', name: 'Compact spectrometer', type: 'Science', mass: 95, power: 155, cost: 120, data: 13, desc: 'Samples a simplified atmospheric spectrum.' },
  { id: 'antenna', name: 'High-gain antenna', type: 'Communications', mass: 135, power: 130, cost: 105, data: 0, desc: 'Directs a narrowband signal back toward Earth.' },
  { id: 'thermal', name: 'Thermal louvers', type: 'Thermal', mass: 80, power: 35, cost: 70, data: 0, desc: 'Keeps sensitive instruments inside their operating range.' },
];
const targets = [
  { id: 'lhs1140', name: 'LHS 1140 b', distance: 40.7, radius: 1.73, star: 0.18, color: '#5bd9d0' },
  { id: 'l9859', name: 'L 98-59 d', distance: 34.6, radius: 1.57, star: 0.31, color: '#f3ab70' },
  { id: 'gj357', name: 'GJ 357 b', distance: 31.4, radius: 1.22, star: 0.34, color: '#89a7ff' },
];
const pages = [
  { id: 'brief', label: 'Mission brief', eyebrow: 'MISSION SETUP / 01', title: 'Define the mission', description: 'Choose a science target and set mission constraints before configuring the vehicle.' },
  { id: 'design', label: 'Spacecraft design', eyebrow: 'VEHICLE INTEGRATION / 02', title: 'Build your spacecraft', description: 'Select systems and instruments. Watch mass, power, data and cost update as you build.' },
  { id: 'flight', label: 'Flight trajectory', eyebrow: 'MISSION CONTROL / 03', title: 'Flight trajectory', description: 'Review a simplified flight path and modeled observation window.' },
  { id: 'results', label: 'Mission results', eyebrow: 'POST-FLIGHT REVIEW / 04', title: 'Mission debrief', description: 'Review performance, science return and the trade-offs behind the result.' },
];
const initialLoad = ['bus', 'rtg', 'telescope', 'antenna', 'thermal'];

function Stars() {
  const stars = useMemo(() => Array.from({ length: 72 }, (_, i) => ({ left: `${(i * 73.13 + 9) % 100}%`, top: `${(i * 41.79 + 3) % 100}%`, delay: `${(i % 9) * -.31}s`, size: i % 17 === 0 ? 3 : 1.5 })), []);
  return <div className="stars" aria-hidden="true">{stars.map((s, i) => <i key={i} style={{ left: s.left, top: s.top, animationDelay: s.delay, width: s.size, height: s.size }} />)}</div>;
}

function App() {
  const [selected, setSelected] = useState(initialLoad);
  const [targetId, setTargetId] = useState(targets[0].id);
  const [budget, setBudget] = useState(1050);
  const [distance, setDistance] = useState(650);
  const [phase, setPhase] = useState('brief');
  const [report, setReport] = useState(null);
  const [toast, setToast] = useState('');
  const target = targets.find(t => t.id === targetId);
  const ship = modules.filter(m => selected.includes(m.id));
  const stats = useMemo(() => ship.reduce((a, m) => ({ mass: a.mass + m.mass, power: a.power + m.power, cost: a.cost + m.cost, data: a.data + m.data }), { mass: 0, power: 0, cost: 0, data: 0 }), [ship]);
  const science = ship.some(m => m.type === 'Science');
  const comms = ship.some(m => m.type === 'Communications');
  const propulsion = ship.some(m => m.type === 'Propulsion');
  const powerLoad = ship.reduce((a, m) => a + (m.type === 'Science' ? m.power : m.type === 'Communications' ? m.power * .5 : m.type === 'Propulsion' ? m.power * .55 : m.power * .2), 0);
  const powerMargin = stats.power - powerLoad;
  const budgetLeft = budget - stats.cost;
  const ready = science && comms && propulsion && budgetLeft >= 0 && powerMargin > 0;
  useEffect(() => { if (!toast) return; const id = setTimeout(() => setToast(''), 2400); return () => clearTimeout(id); }, [toast]);

  function toggle(id) { setSelected(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id]); }
  function launch() {
    if (!ready) return;
    const score = Math.max(28, Math.min(98, Math.round(48 + (powerMargin / Math.max(stats.power, 1)) * 22 + (budgetLeft / budget) * 13 + (stats.data > 20 ? 12 : 0) + (distance >= 550 ? 7 : -16) - Math.max(0, stats.mass - 1300) / 100)));
    setReport({ score, success: score >= 58, target: target.name, distance, stats: { ...stats }, budgetLeft, powerMargin });
    setPhase('flight');
    setToast('Mission simulation complete');
  }
  function restart() { setPhase('brief'); setReport(null); }
  function navigate(next) {
    if ((next === 'flight' || next === 'results') && !report) { setToast('Configure your spacecraft and launch first'); return; }
    setPhase(next);
  }

  return <main className="app-shell"><Stars />
    <header className="topbar"><a className="brand" href="#top" aria-label="Mirage Horizon home"><span className="brand-mark">MH</span><span><b>MIRAGE HORIZON</b><small>MISSION DESIGN SIMULATOR</small></span></a><div className="top-right"><span className="live-dot" /> <span>FLIGHT SYSTEMS ONLINE</span><span className="version">BUILD 01.06</span></div></header>
    <section className="hero" id="top"><div className="hero-copy"><div className="eyebrow"><span>✳</span> HUMANITY'S LONGEST DESIGN CHALLENGE</div><h1>DESIGN FOR<br /><em>THE UNKNOWN.</em></h1><p>A one-way journey to the edge of our solar system. Build a spacecraft, balance its limits, and discover what your mission can reveal.</p><div className="hero-meta"><div><span className="meta-icon">⌁</span><span><b>MISSION DISTANCE</b><small>550+ AU · DEEP SPACE</small></span></div><div><span className="meta-icon">◉</span><span><b>SCIENCE WINDOW</b><small>ONE TARGET · ONE CHANCE</small></span></div></div></div><div className="hero-art" aria-label="Illustration of a spacecraft approaching a gravitational lens ring"><div className="orbit orbit-a" /><div className="orbit orbit-b" /><div className="planet-glow" /><div className="planet" /><div className="lens lens-one" /><div className="lens lens-two" /><div className="lens lens-core" /><div className="ship-art"><span className="ship-wing left-wing" /><span className="ship-body" /><span className="ship-wing right-wing" /><span className="ship-spark" /></div><div className="art-label label-ring"><span /> EINSTEIN RING <small>SIMULATED</small></div><div className="art-label label-range">650 AU <small>MISSION PROFILE</small></div><div className="vector-line" /></div></section>
    <nav className="phase-nav page-nav" aria-label="Mission pages">{pages.map((item, index) => <React.Fragment key={item.id}><button type="button" className={`page-tab ${phase === item.id ? 'selected' : ''} ${item.id === 'results' && !report ? 'locked' : ''}`} onClick={() => navigate(item.id)}><span>{item.id === 'results' && report ? '✓' : `0${index + 1}`}</span>{item.label}{item.id === 'results' && report && <i className="tab-dot" />}</button>{index < pages.length - 1 && <span className="tab-chevron" aria-hidden="true">/</span>}</React.Fragment>)}</nav>
    <div className="page-heading"><div><span className="section-kicker">{pages.find(p => p.id === phase).eyebrow}</span><h2>{pages.find(p => p.id === phase).title}</h2><p>{pages.find(p => p.id === phase).description}</p></div><span className="page-count">0{pages.findIndex(p => p.id === phase) + 1} <i>/</i> 04</span></div>

    {phase === 'brief' && <MissionBrief target={target} targetId={targetId} setTargetId={setTargetId} budget={budget} setBudget={setBudget} distance={distance} setDistance={setDistance} stats={stats} budgetLeft={budgetLeft} onContinue={() => setPhase('design')} />}
    {phase === 'design' && <SpacecraftDesign ship={ship} selected={selected} toggle={toggle} stats={stats} powerMargin={powerMargin} budget={budget} budgetLeft={budgetLeft} science={science} comms={comms} propulsion={propulsion} ready={ready} launch={launch} onBack={() => setPhase('brief')} />}
    {phase === 'flight' && <Flight report={report} target={target} distance={distance} onRestart={() => setPhase('design')} onResults={() => setPhase('results')} />}
    {phase === 'results' && <Results report={report} onRestart={restart} onRevise={() => setPhase('design')} />}

    <footer className="footer"><span>◈ MIRAGE HORIZON <i>·</i> A MISSION DESIGN GAME</span><span>SIMULATION VALUES ARE SIMPLIFIED ASSUMPTIONS <i>·</i> NOT ENGINEERING GUIDANCE</span></footer>{toast && <div className="toast">✦ {toast}</div>}
  </main>;
}

function MissionBrief({ target, targetId, setTargetId, budget, setBudget, distance, setDistance, stats, budgetLeft, onContinue }) {
  return <section className="workspace brief-page"><div className="column mission-column"><div className="section-head"><div><span className="section-kicker">01 / SCIENCE OBJECTIVE</span><h2>Choose your destination</h2></div><span className="step-chip">MISSION BRIEF</span></div>
    <div className="target-list">{targets.map(t => <button key={t.id} className={`target-card ${targetId === t.id ? 'chosen' : ''}`} onClick={() => setTargetId(t.id)}><span className="target-orb" style={{ '--planet': t.color }}><i /></span><span className="target-info"><b>{t.name}</b><small>{t.distance} LIGHT YEARS · {t.radius} R⊕</small></span><span className="target-star">M★ {t.star} M☉</span><span className="radio">{targetId === t.id && <i />}</span></button>)}</div>
    <div className="range-box"><div className="range-heading"><span><b>FOCAL DISTANCE</b><small>Solar Gravitational Lens scenario</small></span><strong>{distance}<small>AU</small></strong></div><input aria-label="Focal distance in AU" type="range" min="400" max="900" step="10" value={distance} onChange={e => setDistance(+e.target.value)} style={{ '--range': `${(distance - 400) / 5}%` }} /><div className="range-labels"><span>400 AU</span><span>550 AU · IDEALIZED FOCUS BEGINS</span><span>900 AU</span></div><p className="hint"><span>ⓘ</span> 550 AU is an idealized lower bound in the literature—not a universal threshold. Actual mission geometry is complex.</p></div>
    <div className="budget-box"><div className="budget-title"><span><b>MISSION BUDGET</b><small>Design allocation</small></span><strong>{budget.toLocaleString()} <small>CR</small></strong></div><input aria-label="Mission budget" type="range" min="700" max="1600" step="50" value={budget} onChange={e => setBudget(+e.target.value)} style={{ '--range': `${(budget - 700) / 9}%` }} /><div className="budget-foot"><span>Spent <b>{stats.cost} CR</b></span><span>Available <b className={budgetLeft < 0 ? 'negative' : ''}>{budgetLeft} CR</b></span></div></div>
    <button className="launch-button page-continue" onClick={onContinue}>CONTINUE TO SPACECRAFT DESIGN <span>↗</span></button></div>
    <aside className="brief-side-panel"><div className="readout-head"><span className="live-dot" /> MISSION SNAPSHOT</div><div className="ship-preview"><div className="preview-grid" /><div className="preview-orbit" /><div className="preview-ship"><span className="pv-wing" /><span className="pv-core" /><span className="pv-wing" /><span className="pv-thrust" /></div><div className="preview-caption">ILLUSTRATIVE VEHICLE · NOT TO SCALE</div></div><div className="brief-stat"><span>SELECTED TARGET</span><b>{target.name}</b></div><div className="brief-stat"><span>MISSION BUDGET</span><b>{budget.toLocaleString()} CR</b></div><div className="brief-note">Mission choices interact: science instruments improve capability but add mass, power draw, cost and data volume.</div></aside></section>;
}

function SpacecraftDesign({ ship, selected, toggle, stats, powerMargin, budget, budgetLeft, science, comms, propulsion, ready, launch, onBack }) {
  return <section className="workspace design-page"><div className="column build-column"><div className="section-head"><div><span className="section-kicker">02 / SPACECRAFT SYSTEMS</span><h2>Build your explorer</h2></div><span className="build-total">{ship.length} SYSTEMS</span></div><div className="module-grid">{modules.map(m => <button key={m.id} className={`module-card ${selected.includes(m.id) ? 'installed' : ''}`} onClick={() => toggle(m.id)} aria-pressed={selected.includes(m.id)}><span className={`module-icon icon-${m.type.toLowerCase()}`}>{iconFor(m.type)}</span><span className="module-type">{m.type}</span><b>{m.name}</b><small>{m.desc}</small><span className="module-stats"><i>{m.mass} <small>KG</small></i><i>{m.power} <small>W</small></i><i>{m.cost} <small>CR</small></i></span><span className={`install-indicator ${selected.includes(m.id) ? 'on' : ''}`}>{selected.includes(m.id) ? '✓' : '+'}</span></button>)}</div><div className="design-tip"><span>✳</span><p><b>DESIGN NOTE</b> {powerMargin <= 0 ? 'Your power system cannot support this load. Add a generator or remove power-hungry systems.' : !propulsion ? 'Select a propulsion system to give your mission a way to reach its target.' : 'Every kilogram and watt matters. Trade efficiency against capability to extend your mission.'}</p></div><button className="text-button" onClick={onBack}>← BACK TO MISSION BRIEF</button></div>
    <aside className="column readout-column"><div className="readout-head"><span className="live-dot" /> LIVE TELEMETRY <span>●</span></div><div className="ship-preview"><div className="preview-grid" /><div className="preview-orbit" /><div className="preview-ship"><span className="pv-wing" /><span className="pv-core" /><span className="pv-wing" /><span className="pv-thrust" /></div><div className="preview-caption">CONFIGURATION VIEW <small>NOT TO SCALE</small></div></div><div className="readout-stats"><Metric name="TOTAL MASS" value={stats.mass.toLocaleString()} unit="kg" tone="blue" /><Metric name="POWER AVAILABLE" value={stats.power.toLocaleString()} unit="W" tone="green" /><Metric name="POWER MARGIN" value={`${powerMargin >= 0 ? '+' : ''}${Math.round(powerMargin)}`} unit="W" tone={powerMargin > 0 ? 'green' : 'red'} /><Metric name="DATA CAPACITY" value={stats.data.toString()} unit="Mb/day" tone="purple" /></div><div className="readout-budget"><div><span>PROJECTED COST</span><b>{stats.cost} <small>/ {budget} CR</small></b></div><div className="cost-track"><i style={{ width: `${Math.min(100, stats.cost / budget * 100)}%`, background: budgetLeft < 0 ? 'var(--red)' : undefined }} /></div><div className="cost-status"><span>{budgetLeft >= 0 ? 'WITHIN ALLOCATION' : 'OVER BUDGET'}</span><span>{budgetLeft} CR LEFT</span></div></div><div className="checklist"><b>MISSION READINESS</b>{[[science, 'Science payload'], [comms, 'Deep-space comms'], [propulsion, 'Cruise propulsion'], [powerMargin > 0, 'Positive power margin'], [budgetLeft >= 0, 'Within budget']].map(([ok, text]) => <div key={text}><span className={ok ? 'check-ok' : 'check-no'}>{ok ? '✓' : '×'}</span>{text}</div>)}</div><div className="design-actions"><button className="launch-button" onClick={launch} disabled={!ready}>INITIATE MISSION <span>↗</span></button><p className="launch-note">{ready ? 'SYSTEMS NOMINAL · READY FOR FLIGHT' : 'RESOLVE READINESS CHECKS TO PROCEED'}</p></div></aside></section>;
}

function iconFor(type) { return ({ Structure: '⬡', Power: 'ϟ', Propulsion: '◈', Science: '◎', Communications: '⌁', Thermal: '◇' })[type] || '◈'; }
function Metric({ name, value, unit, tone }) { return <div className="metric"><span>{name}</span><b className={`tone-${tone}`}>{value}<small>{unit}</small></b></div>; }

function Flight({ report, target, distance, onRestart, onResults }) {
  const [tick, setTick] = useState(0);
  const [trim, setTrim] = useState(50);
  const [playing, setPlaying] = useState(true);
  useEffect(() => { if (!playing) return; const id = setInterval(() => setTick(x => (x + 1) % 1000), 80); return () => clearInterval(id); }, [playing]);
  return <section className="flight-screen flight-page"><div className="flight-top"><div><span className="section-kicker">MISSION CONTROL / FLIGHT PHASE</span><h2>{report?.success ? 'Signal acquired.' : 'Mission review.'}</h2><p>{report?.success ? 'The spacecraft reached its simplified observation window. Review the science returned by your design.' : 'The mission fell short of its design threshold. Review the trade-offs and try again.'}</p></div><span className={`flight-status ${report?.success ? '' : 'status-warn'}`}><i />{report?.success ? 'DATA RECEIVED' : 'MISSION DEBRIEF'}</span></div>
    <div className="flight-visual trajectory-view"><div className="flight-stars" /><div className="flight-axis axis-x" /><div className="flight-axis axis-y" /><div className="flight-sun" /><div className="flight-ring ring-a" /><div className="flight-ring ring-b" /><div className="flight-ring ring-c" /><div className="flight-planet" /><div className="trajectory-orbit orbit-1" /><div className="trajectory-orbit orbit-2" /><div className="trajectory-orbit orbit-3" /><div className="trajectory-path" style={{ '--trim': `${trim}%` }} /><div className="flight-spacecraft" style={{ transform: `translate(${Math.min(tick * .22, 155)}px,${Math.sin(tick / 13) * 18 + (trim - 50) * .25}px)` }}><i /><b /><i /></div><div className="trajectory-label label-origin">SUN / SOLAR SYSTEM<small>DEPARTURE REGION</small></div><div className="trajectory-label label-target">{target.name}<small>CATALOG TARGET</small></div><div className="trajectory-label label-sgl">SGL OBSERVATION REGION<small>SIMPLIFIED SCENARIO</small></div><div className="flight-distance">{distance} AU <small>NOT TO SCALE</small></div></div>
    <div className="trajectory-controls"><button className="secondary-button" onClick={() => setPlaying(!playing)}>{playing ? 'Ⅱ PAUSE' : '▶ PLAY'}</button><div className="trajectory-range"><div className="range-heading"><span><b>TRAJECTORY TRIM</b><small>Adjust modeled path alignment</small></span><strong>{trim}%</strong></div><input aria-label="Trajectory trim" type="range" min="0" max="100" value={trim} onChange={e => setTrim(+e.target.value)} /></div><div className="flight-readout"><span>SIM TIME <b>{(tick / 10).toFixed(1)} d</b></span><span>RANGE <b>{Math.round(tick * distance / 1000)} AU</b></span></div></div>
    <div className="flight-summary"><div><span>DESTINATION</span><b>{target.name}</b></div><div><span>MODELED OUTCOME</span><b>{report?.success ? 'OBSERVATION WINDOW REACHED' : 'REVIEW DESIGN TRADE-OFFS'}</b></div><div><span>SIMULATION NOTICE</span><b>NOT A FLIGHT PREDICTION</b></div></div><div className="flight-actions"><button className="secondary-button" onClick={onRestart}>← REVISE SPACECRAFT</button><button className="launch-button" onClick={onResults}>VIEW MISSION RESULTS <span>↗</span></button></div></section>;
}

function Results({ report, onRestart, onRevise }) {
  if (!report) return <section className="flight-screen"><div className="results-banner"><div><span className="section-kicker">NO FLIGHT REPORT</span><h2>Run a simulation to see mission results.</h2><p>Your score and debrief will appear here after the flight phase.</p></div></div><button className="launch-button results-button" onClick={onRevise}>RETURN TO SPACECRAFT DESIGN <span>↗</span></button></section>;
  return <section className="flight-screen results-page"><div className="results-banner"><div><span className="section-kicker">MISSION DEBRIEF / {report.success ? 'SUCCESS' : 'LESSON LEARNED'}</span><h2>{report.success ? 'A mission within reach.' : 'A mission to learn from.'}</h2><p>{report.success ? 'Your design met the simplified mission-performance threshold.' : 'The spacecraft fell below the success threshold. Use these trade-offs to decide what to improve.'}</p></div><div className="score-ring"><b>{report.score}</b><small>MISSION SCORE</small></div></div>
    <div className="results-grid"><div className="result-card score-card"><span>MISSION PERFORMANCE</span><strong>{report.score}<small>/100</small></strong><div className="score-track"><i style={{ width: `${report.score}%` }} /></div><small>{report.success ? 'SUCCESS THRESHOLD REACHED' : 'BELOW SUCCESS THRESHOLD'}</small></div><div className="result-card"><span>SCIENCE RETURN</span><b>{report.stats.data} <small>Mb/day</small></b><p>{report.stats.data > 20 ? 'Strong modeled instrument coverage.' : 'Limited instrument coverage; consider a complementary payload.'}</p></div><div className="result-card"><span>ENGINEERING TRADE</span><b>{report.stats.mass.toLocaleString()} <small>kg · {report.powerMargin} W margin</small></b><p>{report.budgetLeft} CR unspent. These values are simplified game mechanics.</p></div></div>
    <div className="debrief-explain"><span className="section-kicker">WHY THIS RESULT?</span><p>The score combines power margin, budget remaining, science data capacity, focal-distance scenario and total mass. This is a learning simulation—not engineering guidance.</p></div><div className="synthetic-notice"><span>NOTE</span><p><b>SIMULATED OUTPUT</b> The ring is procedural synthetic art, not an exoplanet image, surface map or actual Solar Gravitational Lens observation.</p></div><div className="flight-actions"><button className="secondary-button" onClick={onRevise}>← REVISE SPACECRAFT</button><button className="launch-button" onClick={onRestart}>START A NEW MISSION <span>↗</span></button></div></section>;
}

createRoot(document.getElementById('root')).render(<App />);
