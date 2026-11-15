import React, { useState } from 'react';
import { sound } from '../audio';

export default function Navbar({ currentPhase, target, budget, spent }) {
  const [muted, setMuted] = useState(!sound.isEnabled());
  const [showHelp, setShowHelp] = useState(false);

  const toggleMute = () => {
    const isNowMuted = !sound.toggle();
    setMuted(isNowMuted);
    if (!isNowMuted) sound.beep(880);
  };

  // Phase name display for current step only (NO jumping tabs)
  const phaseNames = {
    homepage: 'Title Menu',
    storyline: 'Act I-III: Storyline',
    tutorial: 'Flight Academy',
    brief: 'Mission Briefing',
    customization: 'SFS Vehicle Hangar',
    flight: 'Atmospheric Ascent & Cruise',
    experiment: 'SGL Einstein Ring',
    earth: 'DSN Telemetry Downlink',
    analysis: 'Science Debrief'
  };

  return (
    <>
      <header className="game-header">
        <div className="header-left">
          <div className="brand" style={{ userSelect: 'none' }}>
            <span className="brand-mark">MH</span>
            <div>
              <b>MIRAGE HORIZON</b>
              <small>SOLAR GRAVITATIONAL LENS SIMULATOR</small>
            </div>
          </div>
        </div>

        {/* Current Mission Status display (NO stage-jumping buttons) */}
        <div className="header-phase-indicator">
          <span className="live-dot" />
          <span className="phase-indicator-label">CURRENT PHASE:</span>
          <b>{phaseNames[currentPhase] || 'Mission Active'}</b>
        </div>

        <div className="header-right">
          {target && (
            <div className="header-target-badge">
              <span className="target-dot" style={{ background: target.color }} />
              <span>{target.name}</span>
            </div>
          )}

          <button
            className="icon-btn"
            onClick={toggleMute}
            title={muted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label="Toggle Audio"
          >
            {muted ? '🔇' : '🔊'}
          </button>

          <button
            className="icon-btn help-btn"
            onClick={() => { sound.click(); setShowHelp(true); }}
            title="Mission Handbook"
          >
            📖 Guide
          </button>
        </div>
      </header>

      {/* Guide / Handbook Modal */}
      {showHelp && (
        <div className="modal-backdrop" onClick={() => setShowHelp(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🚀 MIRAGE HORIZON — MISSION HANDBOOK</h3>
              <button className="close-btn" onClick={() => setShowHelp(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p><b>Objective:</b> Design and fly an interstellar spacecraft to the <b>Solar Gravitational Lens (SGL)</b> focal point at 650 AU to image a distant exoplanet.</p>

              <h4>Flight Stages</h4>
              <ol>
                <li><b>Storyline & Tutorial:</b> Learn about relativistic gravitational lensing and why the Sun acts as a 100,000,000x cosmic magnifying glass.</li>
                <li><b>Mission Brief:</b> Review targets (LHS 1140 b, L 98-59 d, GJ 357 b) and flight parameters.</li>
                <li><b>Rocket Customization (SFS Style):</b> Build your launch vehicle with booster stages. Keep TWR &ge; 1.25 and Delta-V &ge; 12,500 m/s!</li>
                <li><b>Cinematic Launch:</b> Watch your rocket blast off through the atmosphere and enter space.</li>
                <li><b>Einstein Ring Experiment:</b> Center the coronagraph on the focal cylinder and deconvolve exoplanet surface photons.</li>
                <li><b>Deep Space Downlink:</b> Transmit scientific data across 650 AU back to the Deep Space Network.</li>
                <li><b>Post-Flight Debrief:</b> Discover continents, oceans, and atmospheric biosignatures!</li>
              </ol>
            </div>
            <div className="modal-footer">
              <button className="primary-btn" onClick={() => { sound.click(); setShowHelp(false); }}>Understood, Commander</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
