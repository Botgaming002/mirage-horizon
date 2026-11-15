import React, { useState, useEffect } from 'react';
import { sound } from '../audio';

export default function DataAnalysis({
  target,
  focalDistance,
  budget,
  stats,
  experimentData,
  onRedesign,
  onNewMission
}) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [copied, setCopied] = useState(false);

  // Calculate final score components
  const quality = experimentData?.imageQuality || 85;
  const alignment = experimentData?.alignment || 90;
  const powerBonus = stats?.powerMargin > 100 ? 20 : 15;
  const budgetBonus = stats?.budgetLeft >= 0 ? 20 : 5;
  const scienceBonus = Math.min(25, Math.round((stats?.dataRate || 20) * 0.9));
  const focalBonus = focalDistance >= 550 && focalDistance <= 700 ? 15 : 10;

  const totalScore = Math.max(30, Math.min(99, Math.round(
    (quality * 0.3) + (powerBonus) + (budgetBonus) + (scienceBonus) + (focalBonus)
  )));

  const getGrade = (s) => {
    if (s >= 90) return { grade: 'S', label: 'FLIGHT FLAGSHIP EXCELLENCE', color: '#70ddd1' };
    if (s >= 80) return { grade: 'A', label: 'EXEMPLARY MISSION DESIGN', color: '#70dfaa' };
    if (s >= 70) return { grade: 'B', label: 'NOMINAL SUCCESS', color: '#84a8ff' };
    if (s >= 60) return { grade: 'C', label: 'ACCEPTABLE MARGINS', color: '#f6cb77' };
    return { grade: 'D', label: 'BELOW OPTIMAL THRESHOLD', color: '#ff7c82' };
  };

  const gradeInfo = getGrade(totalScore);

  // Count up animation
  useEffect(() => {
    sound.success();
    let curr = 0;
    const interval = setInterval(() => {
      curr += 2;
      if (curr >= totalScore) {
        setAnimatedScore(totalScore);
        clearInterval(interval);
      } else {
        setAnimatedScore(curr);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [totalScore]);

  // Atmospheric gas makeup based on target exoplanet
  const atmosphericGases = target?.id === 'lhs1140b' ? [
    { gas: 'Nitrogen (N₂)', pct: 72, color: '#84a8ff' },
    { gas: 'Oxygen (O₂)', pct: 18, color: '#70dfaa' },
    { gas: 'Water Vapor (H₂O)', pct: 6, color: '#70ddd1' },
    { gas: 'Carbon Dioxide (CO₂)', pct: 3, color: '#f6cb77' },
    { gas: 'Methane (CH₄ - Biosignature)', pct: 1, color: '#bd9aff' }
  ] : target?.id === 'l9859d' ? [
    { gas: 'Water Vapor (H₂O Steam)', pct: 54, color: '#70ddd1' },
    { gas: 'Hydrogen / Helium', pct: 28, color: '#84a8ff' },
    { gas: 'Carbon Dioxide (CO₂)', pct: 14, color: '#f6cb77' },
    { gas: 'Methane (CH₄)', pct: 4, color: '#bd9aff' }
  ] : [
    { gas: 'Carbon Dioxide (CO₂)', pct: 86, color: '#f6cb77' },
    { gas: 'Nitrogen (N₂)', pct: 10, color: '#84a8ff' },
    { gas: 'Sulfur Dioxide (SO₂)', pct: 3.5, color: '#ff7c82' },
    { gas: 'Mineral Vapor', pct: 0.5, color: '#e5aa70' }
  ];

  const handleCopyReport = () => {
    sound.click();
    const text = `🚀 MIRAGE HORIZON MISSION DEBRIEF
Target: ${target?.name} (${target?.distanceLy} LY)
Focal Distance: ${focalDistance} AU
Mission Score: ${totalScore}/100 [Grade ${gradeInfo.grade} - ${gradeInfo.label}]
Habitability Index: ${target?.habitabilityIndex}%
Reconstructed Resolution: ${quality}%
Payload Bandwidth: ${stats?.dataRate} Mb/day
Budget Margin: ${stats?.budgetLeft} CR unspent`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <section className="analysis-wrapper">
      <div className="analysis-container">
        {/* Header */}
        <div className="analysis-header">
          <div>
            <span className="section-kicker">09 / POST-FLIGHT SCIENTIFIC DEBRIEF</span>
            <h2>Exoplanet Discovery Dossier: {target?.name}</h2>
          </div>
          <div className="analysis-header-actions">
            <button className="secondary-btn" onClick={handleCopyReport}>
              {copied ? '✓ Report Copied!' : '📋 Copy Mission Certificate'}
            </button>
          </div>
        </div>

        {/* TOP ROW: SCORE & RECONSTRUCTED EXOPLANET HERO */}
        <div className="hero-results-grid">
          {/* Mission Score Card */}
          <div className="score-badge-card">
            <div className="score-top">
              <span>OVERALL MISSION PERFORMANCE</span>
              <span className="grade-badge" style={{ color: gradeInfo.color, borderColor: gradeInfo.color }}>
                GRADE {gradeInfo.grade}
              </span>
            </div>

            <div className="score-number-row">
              <span className="big-score" style={{ color: gradeInfo.color }}>
                {animatedScore}
              </span>
              <small>/ 100</small>
            </div>

            <div className="score-verdict" style={{ color: gradeInfo.color }}>
              {gradeInfo.label}
            </div>

            <p className="score-summary">
              {totalScore >= 80
                ? 'Your spacecraft architecture successfully balanced mass, propulsion, and cryogenic instrumentation to return unprecedented planetary data!'
                : 'Mission objectives accomplished! Review the engineering trade-offs below to optimize your next flight configuration.'}
            </p>

            {/* Score Component Bars */}
            <div className="score-breakdown">
              <div className="sb-item">
                <span>Vehicle Staging & TWR:</span>
                <b>{scienceBonus} / 25</b>
              </div>
              <div className="sb-item">
                <span>Power & Thermal Margins:</span>
                <b>{powerBonus} / 20</b>
              </div>
              <div className="sb-item">
                <span>Budget Discipline:</span>
                <b>{budgetBonus} / 20</b>
              </div>
              <div className="sb-item">
                <span>Einstein Ring Resolution:</span>
                <b>{Math.round(quality * 0.2)} / 20</b>
              </div>
              <div className="sb-item">
                <span>Telemetry Downlink:</span>
                <b>{focalBonus} / 15</b>
              </div>
            </div>
          </div>

          {/* Reconstructed Exoplanet Surface Portrait */}
          <div className="surface-portrait-card">
            <div className="portrait-header">
              <h4>Reconstructed Surface Image (650 AU SGL Deconvolution)</h4>
              <span className="badge-chip">SYNTHETIC SIMULATION</span>
            </div>

            <div className="portrait-display">
              <div
                className="portrait-globe"
                style={{
                  background: `radial-gradient(circle at 35% 35%, #ffffff 0%, ${target?.color || '#5bd9d0'} 50%, #08101e 100%)`,
                  boxShadow: `0 0 35px ${target?.color || '#5bd9d0'}77`
                }}
              >
                <div className="globe-texture" />
                <div className="globe-clouds" />
              </div>

              <div className="portrait-legend">
                <div>
                  <small>Resolved Continents:</small>
                  <b>{quality > 70 ? 'High Confidence (10 km Grid)' : 'Moderate Resolution'}</b>
                </div>
                <div>
                  <small>Liquid Water Surface:</small>
                  <b>{target?.id === 'lhs1140b' ? 'Detected (Reflective Glint)' : 'Volatile Steam Canopy'}</b>
                </div>
                <div>
                  <small>Habitability Score:</small>
                  <b style={{ color: 'var(--green)' }}>{target?.habitabilityIndex}% Potential</b>
                </div>
              </div>
            </div>

            <div className="provenance-disclaimer">
              <span>ⓘ</span> <b>Scientific Transparency:</b> The image above is procedurally synthesized for gameplay based on NASA Exoplanet Archive parameters. No real surface photograph of an exoplanet currently exists in human history.
            </div>
          </div>
        </div>

        {/* MIDDLE ROW: SPECTROSCOPIC GAS COMPOSITION */}
        <div className="spectroscopy-card">
          <div className="spectro-header">
            <div>
              <h4>Atmospheric Chemical Composition</h4>
              <p>Detected absorption dips measured across the Einstein Ring refraction band.</p>
            </div>
            <span className="spectro-tag">SPECTRAL RECONSTRUCTION</span>
          </div>

          <div className="gas-bars-container">
            {atmosphericGases.map(g => (
              <div key={g.gas} className="gas-bar-row">
                <div className="gas-label">
                  <b>{g.gas}</b>
                  <span>{g.pct}%</span>
                </div>
                <div className="gauge-bar">
                  <div
                    className="gauge-fill"
                    style={{ width: `${g.pct}%`, background: g.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM ROW: ENGINEERING LESSONS & TRADE-OFFS */}
        <div className="tradeoffs-card">
          <h4>Engineering Decisions & Lessons Learned</h4>
          <div className="tradeoff-grid">
            <div className="tradeoff-box green">
              <b>✅ What Worked Well</b>
              <ul>
                <li>Total vehicle thrust achieved stable atmospheric breakout and orbital injection.</li>
                <li>Power systems maintained positive operational margins at {focalDistance} AU.</li>
                <li>Downlink link budget successfully recovered scientific telemetry back to Earth.</li>
              </ul>
            </div>

            <div className="tradeoff-box yellow">
              <b>⚠️ Areas for Optimization</b>
              <ul>
                <li>
                  {stats?.budgetLeft > 250
                    ? `You left ${stats.budgetLeft} CR unspent. You could afford extra spectrometers or backup reaction wheels!`
                    : 'Budget was tightly utilized. Excellent financial discipline.'}
                </li>
                <li>
                  {stats?.mass > 3000
                    ? 'Heavy spacecraft mass slightly reduced cruise acceleration.'
                    : 'Lightweight architecture allowed high delta-V velocity.'}
                </li>
              </ul>
            </div>

            <div className="tradeoff-box blue">
              <b>💡 Real-World Mission Insight</b>
              <p>
                In actual NASA/JPL deep-space exploration, every engineering decision affects all other subsystems: adding instruments boosts science return but increases mass and power demands, requiring heavier RTGs and larger boosters.
              </p>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="analysis-actions">
          <button className="secondary-btn" onClick={onRedesign}>
            🛠 Redesign Rocket for {target?.name}
          </button>
          <button className="primary-btn pulse-glow" onClick={onNewMission}>
            🪐 Launch New Mission (Select Another World) →
          </button>
        </div>
      </div>
    </section>
  );
}
