import React, { useState } from 'react';
import { sound } from '../audio';
import { EXOPLANETS } from '../data';

export default function MissionBrief({
  selectedTarget,
  setSelectedTarget,
  focalDistance,
  setFocalDistance,
  budget,
  setBudget,
  onNext
}) {
  const [activeTab, setActiveTab] = useState('targets'); // 'targets' | 'parameters' | 'risks'

  const currentPlanet = EXOPLANETS.find(p => p.id === selectedTarget) || EXOPLANETS[0];

  const handleSelectPlanet = (planet) => {
    sound.click();
    setSelectedTarget(planet.id);
  };

  const getFocalAssessment = (dist) => {
    if (dist < 550) return { tone: 'red', text: 'Sub-optimal: Light rays have not fully converged. Blurry Einstein Ring.' };
    if (dist <= 680) return { tone: 'green', text: 'Optimal Sweet Spot: Excellent balance between corona glare reduction and transit time.' };
    return { tone: 'yellow', text: 'Extended Distance: Ultra-sharp optics, but transit time increases by 12+ years.' };
  };

  const focalEval = getFocalAssessment(focalDistance);

  return (
    <section className="brief-wrapper">
      <div className="brief-container">
        {/* Classified Docket Header */}
        <div className="classified-banner">
          <div className="classified-stamp">TOP SECRET // EYES ONLY</div>
          <div className="classified-info">
            <span>PROJECT: MIRAGE HORIZON</span>
            <span>DIRECTIVE: SGL-EXO-2147</span>
            <span>CLEARANCE: LEVEL 5</span>
          </div>
        </div>

        <div className="brief-title-row">
          <div>
            <span className="section-kicker">04 / STRATEGIC MISSION BRIEFING</span>
            <h2>Select Target Exoplanet & Mission Profile</h2>
          </div>
          <button
            className="primary-btn pulse-glow"
            onClick={() => {
              sound.success();
              onNext();
            }}
          >
            Open Rocket Hangar 🚀
          </button>
        </div>

        {/* Tab Controls */}
        <div className="brief-subtabs">
          <button
            className={`subtab-btn ${activeTab === 'targets' ? 'active' : ''}`}
            onClick={() => { sound.click(); setActiveTab('targets'); }}
          >
            🪐 Target Exoplanets ({EXOPLANETS.length})
          </button>
          <button
            className={`subtab-btn ${activeTab === 'parameters' ? 'active' : ''}`}
            onClick={() => { sound.click(); setActiveTab('parameters'); }}
          >
            ⚙ Mission Constraints & Sliders
          </button>
          <button
            className={`subtab-btn ${activeTab === 'risks' ? 'active' : ''}`}
            onClick={() => { sound.click(); setActiveTab('risks'); }}
          >
            ⚠️ Risk Matrix & Timeline
          </button>
        </div>

        {/* TAB 1: TARGET EXOPLANETS */}
        {activeTab === 'targets' && (
          <div className="targets-section">
            <div className="targets-grid">
              {EXOPLANETS.map(planet => {
                const isSelected = planet.id === selectedTarget;
                return (
                  <div
                    key={planet.id}
                    className={`target-card-large ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectPlanet(planet)}
                  >
                    <div className="planet-orb-wrap">
                      <div
                        className="planet-orb"
                        style={{
                          background: `radial-gradient(circle at 35% 35%, #fff 0%, ${planet.color} 50%, #0d1629 100%)`,
                          boxShadow: `0 0 24px ${planet.color}66`
                        }}
                      />
                      <span className="habitability-badge">
                        HABITABILITY: {planet.habitabilityIndex}%
                      </span>
                    </div>

                    <div className="planet-card-body">
                      <div className="planet-title-row">
                        <h4>{planet.name}</h4>
                        <span className="dist-tag">{planet.distanceLy} LY</span>
                      </div>
                      <p className="planet-type">{planet.type} · {planet.constellation}</p>
                      <p className="planet-desc">{planet.description}</p>

                      <div className="planet-stats-grid">
                        <div>
                          <small>Radius</small>
                          <b>{planet.radiusEarth} R⊕</b>
                        </div>
                        <div>
                          <small>Mass</small>
                          <b>{planet.massEarth} M⊕</b>
                        </div>
                        <div>
                          <small>Eq. Temp</small>
                          <b>{planet.eqTempK} K ({planet.eqTempK - 273}°C)</b>
                        </div>
                        <div>
                          <small>Host Star</small>
                          <b>{planet.starMass} M☉</b>
                        </div>
                      </div>

                      <div className="planet-goal-box">
                        <b>🎯 Primary Science Objective:</b> {planet.scientificGoal}
                      </div>

                      <button
                        className={`select-planet-btn ${isSelected ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPlanet(planet);
                        }}
                      >
                        {isSelected ? '✓ Assigned Mission Target' : 'Select Target Planet'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="data-source-note">
              <span>ⓘ</span> <b>NASA Data Provenance:</b> Planetary catalog parameters extracted from the NASA Exoplanet Archive (Planetary Systems Table, DOI {currentPlanet.nasaArchiveDoi}). All mission simulation metrics are simplified models for gameplay.
            </div>
          </div>
        )}

        {/* TAB 2: PARAMETERS & SLIDERS */}
        {activeTab === 'parameters' && (
          <div className="parameters-section">
            <div className="params-grid">
              {/* Focal Distance Slider */}
              <div className="param-card">
                <div className="param-header">
                  <div>
                    <h4>SGL Focal Distance Scenario</h4>
                    <p className="param-desc">Distance from the Sun where the coronagraph will intercept the Einstein Ring.</p>
                  </div>
                  <div className="param-value-chip">
                    <b>{focalDistance}</b> <small>AU</small>
                  </div>
                </div>

                <input
                  type="range"
                  min="450"
                  max="900"
                  step="10"
                  value={focalDistance}
                  onChange={(e) => setFocalDistance(Number(e.target.value))}
                  className="game-slider"
                />

                <div className="slider-ticks">
                  <span>450 AU (Pre-focus)</span>
                  <span>550 AU (Theoretical Start)</span>
                  <span>650 AU (Optimal)</span>
                  <span>900 AU (Far Field)</span>
                </div>

                <div className={`param-status-box status-${focalEval.tone}`}>
                  <b>Analysis:</b> {focalEval.text}
                </div>

                <div className="science-callout">
                  <b>🔬 Relativistic Note:</b> At 550 AU, light rays grazing the Sun's photosphere first converge. As distance increases to 650+ AU, the apparent solar disk shrinks, dramatically lowering solar corona noise and improving contrast.
                </div>
              </div>

              {/* Budget Allocation Slider */}
              <div className="param-card">
                <div className="param-header">
                  <div>
                    <h4>Coalition Budget Allocation</h4>
                    <p className="param-desc">Financial resources available to manufacture and launch your spacecraft.</p>
                  </div>
                  <div className="param-value-chip">
                    <b>{budget}</b> <small>CR</small>
                  </div>
                </div>

                <input
                  type="range"
                  min="800"
                  max="1600"
                  step="50"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="game-slider budget-slider"
                />

                <div className="slider-ticks">
                  <span>800 CR (Tight)</span>
                  <span>1,150 CR (Standard)</span>
                  <span>1,600 CR (Flagship)</span>
                </div>

                <div className="budget-advice-box">
                  {budget < 1000 && (
                    <p>⚠️ <b>Strict Budget Mode:</b> You must prioritize lightweight components and single-instrument payloads.</p>
                  )}
                  {budget >= 1000 && budget <= 1350 && (
                    <p>✅ <b>Balanced Budget Mode:</b> Sufficient funds for RTG power systems, dual spectrometers, and reliable chemical boosters.</p>
                  )}
                  {budget > 1350 && (
                    <p>🌟 <b>Flagship Budget Mode:</b> Enables advanced fission reactors, deep-space laser communications, and multi-spectral arrays.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Checklist of Mission Objectives */}
            <div className="objectives-card">
              <h4>Primary Mission Objectives</h4>
              <div className="obj-grid">
                <div className="obj-item">
                  <span className="obj-icon">1</span>
                  <div>
                    <b>Earth Atmospheric Breakout</b>
                    <p>Achieve launch vehicle TWR &gt; 1.0 with positive delta-V margin.</p>
                  </div>
                </div>
                <div className="obj-item">
                  <span className="obj-icon">2</span>
                  <div>
                    <b>Interstellar Cruise to {focalDistance} AU</b>
                    <p>Survive cosmic radiation, micrometeorites, and RTG power decay.</p>
                  </div>
                </div>
                <div className="obj-item">
                  <span className="obj-icon">3</span>
                  <div>
                    <b>Einstein Ring Acquisition</b>
                    <p>Deploy coronagraph to occult the Sun and center on exoplanet focal line.</p>
                  </div>
                </div>
                <div className="obj-item">
                  <span className="obj-icon">4</span>
                  <div>
                    <b>Spectroscopic Analysis & Surface Mapping</b>
                    <p>Deconvolve Einstein Ring photons to detect liquid oceans and biosignatures.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: RISKS & TIMELINE */}
        {activeTab === 'risks' && (
          <div className="risks-section">
            <div className="timeline-card">
              <h4>Estimated 40-Year Flight Timeline</h4>
              <div className="mission-timeline">
                <div className="tl-step">
                  <span className="tl-year">Year 0</span>
                  <div className="tl-content">
                    <b>Launch & Trans-Jupiter Insertion</b>
                    <p>Burn chemical stage to achieve solar escape trajectory.</p>
                  </div>
                </div>
                <div className="tl-step">
                  <span className="tl-year">Year 2.5</span>
                  <div className="tl-content">
                    <b>Jupiter Gravity Assist Slingshot</b>
                    <p>Gain +12 km/s speed boost from Jupiter’s gravity well.</p>
                  </div>
                </div>
                <div className="tl-step">
                  <span className="tl-year">Year 15</span>
                  <div className="tl-content">
                    <b>Cross Kuiper Belt & Heliopause</b>
                    <p>Surpass Voyager 1 (160 AU) and enter pristine interstellar vacuum.</p>
                  </div>
                </div>
                <div className="tl-step">
                  <span className="tl-year">Year 32</span>
                  <div className="tl-content">
                    <b>Arrival at SGL Focal Zone ({focalDistance} AU)</b>
                    <p>Orient coronagraph, ignite ion decelerators, and lock telescope.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="risk-matrix-card">
              <h4>Mission Risk Matrix & Mitigation</h4>
              <div className="risk-grid">
                <div className="risk-item">
                  <span className="risk-badge badge-high">HIGH RISK</span>
                  <b>Solar Corona Noise</b>
                  <p>Turbulent solar plasma can wash out faint exoplanet light. Mitigate by choosing an SGL distance &ge; 550 AU with high-contrast coronagraph optics.</p>
                </div>
                <div className="risk-item">
                  <span className="risk-badge badge-med">MEDIUM RISK</span>
                  <b>Power Source Half-Life</b>
                  <p>Solar panels produce near zero power beyond 10 AU. Plutonium RTGs lose ~4W per year. Ensure surplus initial power margin.</p>
                </div>
                <div className="risk-item">
                  <span className="risk-badge badge-high">HIGH RISK</span>
                  <b>Pointing Jitter & Drift</b>
                  <p>At 650 AU, the exoplanet focal cylinder is narrow. Equip reaction wheels and star trackers for sub-arcsecond stabilization.</p>
                </div>
                <div className="risk-item">
                  <span className="risk-badge badge-low">MANAGED RISK</span>
                  <b>Deep Space Telemetry Delay</b>
                  <p>Radio signals take ~3.7 days round-trip. Autonomous onboard computer systems must handle real-time station keeping.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Button at bottom */}
        <div className="brief-footer">
          <div className="brief-selected-summary">
            <span>Selected Target: <b>{currentPlanet.name}</b> ({currentPlanet.distanceLy} LY)</span>
            <span>Scenario: <b>{focalDistance} AU</b></span>
            <span>Budget: <b>{budget} CR</b></span>
          </div>

          <button
            className="primary-btn launch-to-hangar-btn"
            onClick={() => {
              sound.success();
              onNext();
            }}
          >
            Accept Brief & Build Rocket →
          </button>
        </div>
      </div>
    </section>
  );
}
