import React, { useState } from 'react';
import { SFS_PARTS, BUILDING_GUIDELINE_STEPS, calculateRocketPhysics } from '../sfsPhysics';
import { PartSvg } from './RocketSvgRenderer';
import { sound } from '../audio';

export default function RocketCustomization({
  budget = 2500,
  onLaunch,
  onOpenMenu
}) {
  // Start with completely EMPTY stacks as requested!
  const [centerStack, setCenterStack] = useState([]);
  const [leftBooster, setLeftBooster] = useState([]);
  const [rightBooster, setRightBooster] = useState([]);

  // Selected column for click-to-add ('center', 'left', 'right')
  const [activeColumn, setActiveColumn] = useState('center');
  const [symmetryMode, setSymmetryMode] = useState(true);
  const [showTelemetryModal, setShowTelemetryModal] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [guideDismissed, setGuideDismissed] = useState(false);

  const getPartsFromIds = (ids) => ids.map(id => SFS_PARTS.find(p => p.id === id)).filter(Boolean);

  const centerParts = getPartsFromIds(centerStack);
  const leftParts = getPartsFromIds(leftBooster);
  const rightParts = getPartsFromIds(rightBooster);

  // Calculate real aerospace physics
  const physics = calculateRocketPhysics(centerParts, leftParts, rightParts, budget);

  // Find active guideline step
  const allGuidelineDone = BUILDING_GUIDELINE_STEPS.every(s => s.checkFn(centerParts, leftParts));
  const currentGuidelineIndex = BUILDING_GUIDELINE_STEPS.findIndex(s => !s.checkFn(centerParts, leftParts));
  const currentGuideline = currentGuidelineIndex !== -1
    ? BUILDING_GUIDELINE_STEPS[currentGuidelineIndex]
    : BUILDING_GUIDELINE_STEPS[BUILDING_GUIDELINE_STEPS.length - 1];

  // Drag and Drop handlers
  const handleDragStart = (e, partId) => {
    e.dataTransfer.setData('text/plain', partId);
  };

  const handleDrop = (e, targetColumn) => {
    e.preventDefault();
    const partId = e.dataTransfer.getData('text/plain');
    if (!partId) return;
    addPartToColumn(partId, targetColumn);
  };

  const addPartToColumn = (partId, column) => {
    sound.snap();
    if (column === 'center') {
      setCenterStack(prev => [...prev, partId]);
    } else if (column === 'left' || column === 'right') {
      if (symmetryMode) {
        setLeftBooster(prev => [...prev, partId]);
        setRightBooster(prev => [...prev, partId]);
      } else if (column === 'left') {
        setLeftBooster(prev => [...prev, partId]);
      } else {
        setRightBooster(prev => [...prev, partId]);
      }
    }
  };

  const removePartFromColumn = (column, index, e) => {
    if (e) e.stopPropagation();
    sound.click();
    if (column === 'center') {
      setCenterStack(prev => prev.filter((_, i) => i !== index));
    } else if (symmetryMode && (column === 'left' || column === 'right')) {
      setLeftBooster(prev => prev.filter((_, i) => i !== index));
      setRightBooster(prev => prev.filter((_, i) => i !== index));
    } else if (column === 'left') {
      setLeftBooster(prev => prev.filter((_, i) => i !== index));
    } else {
      setRightBooster(prev => prev.filter((_, i) => i !== index));
    }
  };

  const clearRocket = () => {
    sound.click();
    setCenterStack([]);
    setLeftBooster([]);
    setRightBooster([]);
  };

  const filteredCatalog = activeCategory === 'all'
    ? SFS_PARTS
    : SFS_PARTS.filter(p => p.category === activeCategory);

  // Dynamic contextual hints
  const getDynamicHints = () => {
    const hints = [];

    if (centerStack.length === 0) {
      hints.push({
        title: 'Start by Building Your Main Core',
        tone: 'yellow',
        icon: '🚀',
        text: 'Your launchpad is currently empty. Follow the step-by-step guide to place your nosecone, capsule, and fuel tanks.',
        solution: 'Click the recommended parts below to quickly build your core stack:',
        actions: [
          { label: '+ Add Aerodynamic Fairing', partId: 'sfs_nosecone', col: 'center' },
          { label: '+ Add Probe Core', partId: 'sfs_capsule', col: 'center' },
          { label: '+ Add MMRTG Power', partId: 'sfs_rtg', col: 'center' },
          { label: '+ Add Large Fuel Tank', partId: 'sfs_tank_large', col: 'center' },
          { label: '+ Add Titan Engine', partId: 'sfs_engine_titan', col: 'center' }
        ]
      });
      return hints;
    }

    const reqDeltaV = physics.requiredDeltaV || 4200;
    if (physics.deltaV < reqDeltaV) {
      hints.push({
        title: 'Need More Delta-V (ΔV)?',
        tone: 'yellow',
        icon: '⛽',
        text: `Your current Delta-V is ${physics.deltaV.toLocaleString()} m/s (Goal: ≥ ${reqDeltaV.toLocaleString()} m/s for orbital insertion & solar escape).`,
        solution: 'Add more propellant or use high-ISP vacuum engines:',
        actions: [
          { label: '+ Add Large Tank (36t) to Core', partId: 'sfs_tank_large', col: 'center' },
          { label: '+ Add Booster Tanks (18t)', partId: 'sfs_booster_tank', col: 'left' },
          { label: '+ Mount Frontier Vacuum Engine (520s ISP)', partId: 'sfs_engine_frontier', col: 'center' }
        ]
      });
    }

    if (physics.twr < 1.25) {
      hints.push({
        title: 'Need More Thrust / TWR?',
        tone: 'red',
        icon: '🔥',
        text: `Liftoff TWR is ${physics.twr} (Need ≥ 1.25). Rocket needs more sea-level thrust to overcome gravity drag.`,
        solution: 'Mount higher-thrust booster engines:',
        actions: [
          { label: '+ Mount Titan Engine (2,400 kN)', partId: 'sfs_engine_titan', col: 'center' },
          { label: '+ Add Hawk Engines to Boosters (1,600 kN)', partId: 'sfs_engine_hawk', col: 'left' }
        ]
      });
    }

    if (!physics.checks.hasNosecone.passed) {
      hints.push({
        title: 'Missing Aerodynamic Fairing Cone!',
        tone: 'red',
        icon: '▲',
        text: 'Rocket will suffer structural breakup at supersonic Max-Q without an aerodynamic fairing.',
        solution: 'Place a streamlined nosecone on top of the main core:',
        actions: [
          { label: '+ Add Aerodynamic Fairing', partId: 'sfs_nosecone', col: 'center' }
        ]
      });
    }

    if (!physics.checks.deepSpacePower.passed) {
      hints.push({
        title: 'Missing Deep-Space Nuclear Power (MMRTG)!',
        tone: 'red',
        icon: '☢',
        text: 'Solar panels fail past Jupiter (5.2 AU). At 650 AU, an MMRTG is mandatory.',
        solution: 'Equip an MMRTG Nuclear Battery core:',
        actions: [
          { label: '+ Equip MMRTG Nuclear Core', partId: 'sfs_rtg', col: 'center' }
        ]
      });
    }

    if (physics.canLaunch) {
      hints.push({
        title: 'All Aerospace Checks Nominal!',
        tone: 'green',
        icon: '✅',
        text: `Your custom rocket produces TWR ${physics.twr} and ${physics.deltaV.toLocaleString()} m/s Delta-V with nuclear deep-space power.`,
        solution: 'You are completely flight-ready! Press the Launch button at the top right.',
        actions: []
      });
    }

    return hints;
  };

  const dynamicHints = getDynamicHints();

  return (
    <div className="sfs-viewport">
      {/* SFS TOPBAR */}
      <header className="sfs-topbar">
        <button className="sfs-icon-btn menu-btn" onClick={onOpenMenu} title="Hangar Menu">
          <span className="hamburger-bars" />
        </button>

        <div className="sfs-top-center">
          <button className="sfs-preset-pill clear" onClick={clearRocket} title="Reset launchpad to empty">
            🗑 Clear All
          </button>
          {!guideDismissed && (
            <span className="sfs-step-indicator">
              {allGuidelineDone ? (
                <span className="hud-green">✓ Assembly Complete (Flight Ready)</span>
              ) : (
                <>
                  <b>Step {currentGuidelineIndex + 1}/5:</b> {currentGuideline.title}
                </>
              )}
            </span>
          )}
        </div>

        <div className="sfs-top-right">
          <button
            className={`sfs-hint-btn ${!physics.canLaunch ? 'hint-pulse' : ''}`}
            onClick={() => {
              sound.beep(1100);
              setShowHintModal(true);
            }}
            title="Click for Aerospace Engineering Hints"
          >
            💡 HINT {!physics.canLaunch && `(${dynamicHints.length})`}
          </button>

          <button
            className={`sfs-launch-btn ${physics.canLaunch ? 'launch-ready' : 'launch-disabled'}`}
            onClick={() => {
              if (physics.canLaunch) {
                sound.launchRoar(4);
                onLaunch(physics);
              } else {
                sound.beep(300);
                setShowHintModal(true);
              }
            }}
          >
            Launch 🚀
          </button>
        </div>
      </header>

      {/* INTERACTIVE PART-BY-PART BUILDING GUIDELINE (Above Canvas) */}
      {!guideDismissed && (
        <div className={`sfs-assembly-guide-banner ${allGuidelineDone ? 'guide-completed' : ''}`}>
          <div className="guide-icon">{allGuidelineDone ? '🎉' : '🛠'}</div>
          <div className="guide-content">
            <div className="guide-title-row">
              <span className="guide-step-tag">
                {allGuidelineDone ? 'READY FOR LAUNCH' : `STEP ${currentGuidelineIndex + 1} OF 5`}
              </span>
              <b className="guide-title-text">
                {allGuidelineDone ? 'Rocket Assembly Complete!' : currentGuideline.title}
              </b>
              <button
                className="guide-dismiss-btn"
                onClick={() => setGuideDismissed(true)}
                title="Hide Guideline Banner"
              >
                ✕ Dismiss Guide
              </button>
            </div>

            <p className="guide-desc-text">
              {allGuidelineDone
                ? 'All critical modules are installed. Liftoff TWR is nominal and your rocket has ample Delta-V to reach Earth orbit and ignite the solar escape trajectory to 650 AU.'
                : currentGuideline.desc}
            </p>

            {!allGuidelineDone ? (
              <div className="guide-quick-actions">
                <span className="quick-add-label">Quick Add:</span>
                <div className="quick-add-buttons">
                  {currentGuideline.recommendedPartIds.map(pid => {
                    const partObj = SFS_PARTS.find(p => p.id === pid);
                    if (!partObj) return null;
                    return (
                      <button
                        key={pid}
                        className="guide-add-chip"
                        onClick={() => addPartToColumn(pid, currentGuideline.step === 5 ? 'left' : 'center')}
                      >
                        + {partObj.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="guide-quick-actions">
                <button
                  className="guide-add-chip launch-chip"
                  onClick={() => {
                    if (physics.canLaunch) {
                      sound.launchRoar(4);
                      onLaunch(physics);
                    }
                  }}
                >
                  🚀 Launch Mission Now →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MAIN SFS BLUEPRINT ASSEMBLY WORKBENCH */}
      <div className="sfs-workbench">
        {/* LEFT PARTS DRAWER */}
        <aside className="sfs-parts-drawer">
          <div className="sfs-catalog-scroll">
            {filteredCatalog.map(part => (
              <div
                key={part.id}
                className="sfs-part-item"
                draggable
                onDragStart={(e) => handleDragStart(e, part.id)}
                onClick={() => addPartToColumn(part.id, activeColumn)}
                title={`${part.name} - ${part.desc} (${part.wetMass}t, ${part.cost} CR)`}
              >
                <div className="sfs-part-preview">
                  <PartSvg type={part.iconSvg} width={48} height={48} />
                </div>
                <div className="sfs-part-caption">
                  <small>{part.type}</small>
                  <span>{part.wetMass}t</span>
                </div>
              </div>
            ))}
          </div>

          <div className="sfs-drawer-tools">
            <button
              className={`sfs-tool-btn ${symmetryMode ? 'active' : ''}`}
              onClick={() => { sound.click(); setSymmetryMode(!symmetryMode); }}
              title="Mirror Booster Symmetry"
            >
              ⧉ Symmetry: {symmetryMode ? 'ON' : 'OFF'}
            </button>
            <div className="sfs-filter-pills">
              <button className={activeCategory === 'all' ? 'active' : ''} onClick={() => setActiveCategory('all')}>All</button>
              <button className={activeCategory === 'tanks' ? 'active' : ''} onClick={() => setActiveCategory('tanks')}>Tanks</button>
              <button className={activeCategory === 'engines' ? 'active' : ''} onClick={() => setActiveCategory('engines')}>Engines</button>
            </div>
          </div>
        </aside>

        {/* CENTER BLUEPRINT GRID */}
        <main className="sfs-blueprint-canvas" onDragOver={(e) => e.preventDefault()}>
          <div className="sfs-grid-lines" />

          {/* ACTIVE TARGET SELECTOR TABS */}
          <div className="sfs-column-toggles">
            <button
              className={`col-toggle-btn ${activeColumn === 'left' ? 'active' : ''}`}
              onClick={() => { sound.click(); setActiveColumn('left'); }}
            >
              ◀ Left Booster ({leftBooster.length})
            </button>
            <button
              className={`col-toggle-btn ${activeColumn === 'center' ? 'active' : ''}`}
              onClick={() => { sound.click(); setActiveColumn('center'); }}
            >
              ▲ Main Core ({centerStack.length})
            </button>
            <button
              className={`col-toggle-btn ${activeColumn === 'right' ? 'active' : ''}`}
              onClick={() => { sound.click(); setActiveColumn('right'); }}
            >
              Right Booster ({rightBooster.length}) ▶
            </button>
          </div>

          {/* ROCKET STAGING DISPLAY */}
          <div className="sfs-rocket-rig">
            {/* 1. LEFT BOOSTER COLUMN */}
            <div
              className={`sfs-stage-col booster-col left ${activeColumn === 'left' ? 'active-col' : ''}`}
              onDrop={(e) => handleDrop(e, 'left')}
              onClick={() => setActiveColumn('left')}
            >
              {leftParts.length === 0 ? (
                <div className="sfs-empty-dropzone">
                  <small>+ Drop Booster</small>
                </div>
              ) : (
                <div className="sfs-parts-column">
                  {leftParts.map((part, idx) => (
                    <div
                      key={`left-${idx}`}
                      className="sfs-mounted-module"
                      onClick={(e) => removePartFromColumn('left', idx, e)}
                      title={`Click to remove ${part.name}`}
                    >
                      <PartSvg type={part.iconSvg} width={58} height={58} isSide={true} flipped={false} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RADIAL STRUT CONNECTORS (Left) */}
            {leftParts.length > 0 && centerParts.length > 0 && (
              <div className="sfs-strut-bracket left-bracket">
                <div className="strut-line" />
                <div className="strut-line" />
              </div>
            )}

            {/* 2. CENTER MAIN STACK */}
            <div
              className={`sfs-stage-col center-col ${activeColumn === 'center' ? 'active-col' : ''}`}
              onDrop={(e) => handleDrop(e, 'center')}
              onClick={() => setActiveColumn('center')}
            >
              {centerParts.length === 0 ? (
                <div className="sfs-empty-dropzone center empty-start">
                  <span className="drop-plus">🚀</span>
                  <b>Launchpad Empty</b>
                  <p>Drag parts from left or click guideline buttons above to assemble your rocket part-by-part!</p>
                </div>
              ) : (
                <div className="sfs-parts-column">
                  {centerParts.map((part, idx) => (
                    <div
                      key={`center-${idx}`}
                      className="sfs-mounted-module"
                      onClick={(e) => removePartFromColumn('center', idx, e)}
                      title={`Click to remove ${part.name}`}
                    >
                      <PartSvg type={part.iconSvg} width={76} height={76} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RADIAL STRUT CONNECTORS (Right) */}
            {rightParts.length > 0 && centerParts.length > 0 && (
              <div className="sfs-strut-bracket right-bracket">
                <div className="strut-line" />
                <div className="strut-line" />
              </div>
            )}

            {/* 3. RIGHT BOOSTER COLUMN */}
            <div
              className={`sfs-stage-col booster-col right ${activeColumn === 'right' ? 'active-col' : ''}`}
              onDrop={(e) => handleDrop(e, 'right')}
              onClick={() => setActiveColumn('right')}
            >
              {rightParts.length === 0 ? (
                <div className="sfs-empty-dropzone">
                  <small>+ Drop Booster</small>
                </div>
              ) : (
                <div className="sfs-parts-column">
                  {rightParts.map((part, idx) => (
                    <div
                      key={`right-${idx}`}
                      className="sfs-mounted-module"
                      onClick={(e) => removePartFromColumn('right', idx, e)}
                      title={`Click to remove ${part.name}`}
                    >
                      <PartSvg type={part.iconSvg} width={58} height={58} isSide={true} flipped={true} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* SFS RIGHT SIDE CONTROLS */}
        <aside className="sfs-right-controls">
          <button
            className="sfs-ctrl-btn"
            onClick={() => setShowHintModal(true)}
            title="Aerospace Hints"
          >
            💡
          </button>
          <button
            className="sfs-ctrl-btn"
            onClick={() => setShowTelemetryModal(true)}
            title="Telemetry & Physics Data"
          >
            📊
          </button>
          <button
            className="sfs-ctrl-btn"
            onClick={() => {
              sound.click();
              if (activeColumn === 'center') setCenterStack(prev => [...prev].reverse());
              if (activeColumn === 'left') setLeftBooster(prev => [...prev].reverse());
              if (activeColumn === 'right') setRightBooster(prev => [...prev].reverse());
            }}
            title="Invert Stage Order"
          >
            🔄
          </button>
        </aside>
      </div>

      {/* SFS BOTTOM HUD */}
      <footer className="sfs-telemetry-hud">
        <div className="sfs-hud-metric">
          <small>LIFTOFF TWR</small>
          <b className={physics.twr >= 1.25 ? 'hud-green' : 'hud-red'}>
            {physics.twr}
          </b>
          <span className="hud-sub">{physics.twr >= 1.25 ? 'Nominal (≥1.25)' : 'Needs ≥ 1.25'}</span>
        </div>

        <div className="sfs-hud-metric">
          <small>DELTA-V (ΔV)</small>
          <b className={physics.deltaV >= (physics.requiredDeltaV || 4200) ? 'hud-green' : 'hud-red'}>
            {physics.deltaV.toLocaleString()} m/s
          </b>
          <span className="hud-sub">
            {physics.deltaV >= (physics.requiredDeltaV || 4200)
              ? `✓ Nominal (Goal: ≥ ${(physics.requiredDeltaV || 4200).toLocaleString()} m/s)`
              : `Goal: ≥ ${(physics.requiredDeltaV || 4200).toLocaleString()} m/s`}
          </span>
        </div>

        <div className="sfs-hud-metric">
          <small>TOTAL MASS</small>
          <b>{physics.totalWetMass} t</b>
          <span className="hud-sub">Dry: {physics.totalDryMass} t</span>
        </div>

        <div className="sfs-hud-metric">
          <small>LIFTOFF THRUST</small>
          <b>{physics.totalLiftoffThrust} kN</b>
          <span className="hud-sub">Titan & Hawk</span>
        </div>

        <div className="sfs-hud-metric">
          <small>MISSION BUDGET</small>
          <b className={physics.budgetLeft >= 0 ? 'hud-cyan' : 'hud-red'}>
            {physics.totalCost} / {budget} CR
          </b>
          <span className="hud-sub">{physics.budgetLeft >= 0 ? `${physics.budgetLeft} CR available` : 'Over Budget!'}</span>
        </div>

        <button
          className="sfs-check-btn"
          onClick={() => setShowHintModal(true)}
        >
          {physics.canLaunch ? '✅ All Systems Go' : '💡 See What to Add'}
        </button>
      </footer>

      {/* HINT MODAL */}
      {showHintModal && (
        <div className="sfs-modal-backdrop" onClick={() => setShowHintModal(false)}>
          <div className="sfs-modal-box hint-modal-box" onClick={e => e.stopPropagation()}>
            <div className="sfs-modal-header">
              <h3>💡 AEROSPACE ENGINEERING HINTS</h3>
              <button className="sfs-modal-close" onClick={() => setShowHintModal(false)}>✕</button>
            </div>

            <div className="sfs-modal-body">
              <p className="sfs-modal-intro">
                Review specific component recommendations to optimize your rocket’s Delta-V, TWR, and deep-space survival:
              </p>

              <div className="sfs-hints-container">
                {dynamicHints.map((hint, idx) => (
                  <div key={idx} className={`sfs-hint-card tone-${hint.tone}`}>
                    <div className="sfs-hint-card-head">
                      <span className="hint-icon">{hint.icon}</span>
                      <b>{hint.title}</b>
                    </div>
                    <p className="hint-desc">{hint.text}</p>
                    <p className="hint-sol">{hint.solution}</p>

                    {hint.actions.length > 0 && (
                      <div className="hint-action-buttons">
                        {hint.actions.map((act, aIdx) => (
                          <button
                            key={aIdx}
                            className="hint-quick-add-btn"
                            onClick={() => {
                              addPartToColumn(act.partId, act.col);
                            }}
                          >
                            {act.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="sfs-modal-footer">
              <button
                className="sfs-launch-btn launch-ready"
                onClick={() => setShowHintModal(false)}
              >
                Close & Continue Building
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TELEMETRY READINESS MODAL */}
      {showTelemetryModal && (
        <div className="sfs-modal-backdrop" onClick={() => setShowTelemetryModal(false)}>
          <div className="sfs-modal-box" onClick={e => e.stopPropagation()}>
            <div className="sfs-modal-header">
              <h3>🚀 DETAILED FLIGHT TELEMETRY</h3>
              <button className="sfs-modal-close" onClick={() => setShowTelemetryModal(false)}>✕</button>
            </div>

            <div className="sfs-modal-body">
              <div className="sfs-checks-list">
                {Object.entries(physics.checks).map(([key, check]) => (
                  <div key={key} className={`sfs-check-row ${check.passed ? 'pass' : 'fail'}`}>
                    <span className="check-icon">{check.passed ? '✓' : '✕'}</span>
                    <div className="check-text">
                      <b>{check.label}</b>
                      <p>{check.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sfs-modal-footer">
              <button
                className="sfs-launch-btn launch-ready"
                onClick={() => setShowTelemetryModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
