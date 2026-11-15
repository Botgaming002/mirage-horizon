import React, { useState, useEffect } from 'react';
import { sound } from '../audio';

export default function BackToEarth({
  target,
  focalDistance,
  experimentData,
  onFinishTransmission
}) {
  const [transmittedMb, setTransmittedMb] = useState(0);
  const totalMb = 1200; // Total dataset size
  const [signalStrength, setSignalStrength] = useState(94);
  const [stationLock, setStationLock] = useState('Goldstone 70m (California)');
  const [isBoosting, setIsBoosting] = useState(false);
  const [packetsLost, setPacketsLost] = useState(0);

  // Deep space ground station tracking rotation
  useEffect(() => {
    const stations = [
      'Goldstone 70m (California, USA)',
      'Madrid Deep Space Comm Complex (Spain)',
      'Canberra Deep Space Comm Complex (Australia)'
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % stations.length;
      setStationLock(stations[idx]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Transmission simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTransmittedMb(prev => {
        if (prev >= totalMb) {
          clearInterval(interval);
          sound.success();
          return totalMb;
        }
        const delta = isBoosting ? 65 : 28;
        if (Math.random() < 0.25) sound.beep(1400);
        return Math.min(totalMb, prev + delta);
      });
    }, 180);

    return () => clearInterval(interval);
  }, [isBoosting, totalMb]);

  const handleBoost = () => {
    sound.snap();
    setIsBoosting(true);
    setSignalStrength(99);
    setTimeout(() => {
      setIsBoosting(false);
      setSignalStrength(92);
    }, 2500);
  };

  const progressPercent = Math.min(100, Math.round((transmittedMb / totalMb) * 100));

  return (
    <section className="earth-wrapper">
      <div className="earth-container">
        {/* Header */}
        <div className="earth-header">
          <div>
            <span className="section-kicker">08 / DEEP SPACE TELEMETRY DOWNLINK</span>
            <h2>Transmitting Einstein Ring Data Across {focalDistance} AU</h2>
          </div>
          <div className="downlink-badge">
            <span className="live-dot" /> DSN LINK ACTIVE
          </div>
        </div>

        {/* Transmission Visual Stage */}
        <div className="downlink-visual-stage">
          {/* Left: Spacecraft Node */}
          <div className="telemetry-node node-probe">
            <div className="node-icon">🛰</div>
            <b>Mirage Horizon Probe</b>
            <small>Position: {focalDistance} AU Deep Space</small>
            <div className="node-meter">
              <span>Transmitter:</span>
              <strong style={{ color: 'var(--cyan)' }}>Ka-Band / Laser</strong>
            </div>
          </div>

          {/* Center: Beam with flying data packets */}
          <div className="telemetry-beam-corridor">
            <div className="beam-line" />
            <div className={`packet-stream ${isBoosting ? 'boosted' : ''}`}>
              <div className="data-packet p1">0101</div>
              <div className="data-packet p2">1100</div>
              <div className="data-packet p3">1011</div>
              <div className="data-packet p4">0010</div>
            </div>

            <div className="latency-badge">
              <span>⏱ One-Way Signal Delay: ~{((focalDistance * 8.3) / 60).toFixed(1)} Hours</span>
            </div>
          </div>

          {/* Right: Earth Node */}
          <div className="telemetry-node node-earth">
            <div className="earth-globe-anim" />
            <b>NASA Deep Space Network</b>
            <small>Locked to: {stationLock}</small>
            <div className="node-meter">
              <span>Carrier SNR:</span>
              <strong style={{ color: 'var(--green)' }}>+{signalStrength} dB</strong>
            </div>
          </div>
        </div>

        {/* Progress & Live Downlink Counters */}
        <div className="downlink-dashboard">
          <div className="dl-main-progress">
            <div className="dl-row">
              <h4>Telemetry Downlink Progress</h4>
              <b>{progressPercent}%</b>
            </div>

            <div className="gauge-bar large">
              <div
                className="gauge-fill"
                style={{
                  width: `${progressPercent}%`,
                  background: 'linear-gradient(90deg, #70ddd1, #70dfaa)'
                }}
              />
            </div>

            <div className="dl-substats">
              <span>Transmitted: <b>{transmittedMb} / {totalMb} Mb</b></span>
              <span>Bit Error Rate: <b>&lt; 10⁻⁸</b></span>
              <span>Packets Dropped: <b>{packetsLost}</b></span>
            </div>
          </div>

          {/* Boost Actions */}
          <div className="dl-actions-card">
            <h4>Signal Optimization</h4>
            <p>Activate high-power amplifier to punch through interplanetary plasma scintillation.</p>
            <button
              className={`boost-btn ${isBoosting ? 'active' : ''}`}
              onClick={handleBoost}
              disabled={progressPercent >= 100}
            >
              {isBoosting ? '⚡ AMPLIFIER BOOSTED!' : '🚀 Boost DSN Carrier Signal'}
            </button>
          </div>
        </div>

        {/* Completion Prompt */}
        {progressPercent >= 100 && (
          <div className="transmission-complete-prompt">
            <div className="tc-card">
              <h3>🎉 ALL PACKETS SAFELY RECEIVED AT JPL / MISSION CONTROL!</h3>
              <p>The raw Einstein Ring photon telemetry has been calibrated and decoded by the supercomputing cluster. The science results are ready for your inspection.</p>
              <button
                className="primary-btn pulse-glow"
                onClick={() => {
                  sound.success();
                  onFinishTransmission();
                }}
              >
                Proceed to Data Analysis & Discovery Report 📊 →
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
