import React, { useState } from 'react';
import { sound } from '../audio';
import { TUTORIAL_SLIDES } from '../data';

export default function Tutorial({ onNext, onSkip }) {
  const [slideIdx, setSlideIdx] = useState(0);
  const slide = TUTORIAL_SLIDES[slideIdx];

  const handleNext = () => {
    sound.click();
    if (slideIdx < TUTORIAL_SLIDES.length - 1) {
      setSlideIdx(slideIdx + 1);
    } else {
      sound.success();
      onNext();
    }
  };

  const handleBack = () => {
    sound.click();
    if (slideIdx > 0) {
      setSlideIdx(slideIdx - 1);
    }
  };

  return (
    <section className="tutorial-wrapper">
      <div className="tutorial-container">
        {/* Header */}
        <div className="tutorial-header">
          <div>
            <span className="section-kicker">FLIGHT ACADEMY · BRIEFING MODULE</span>
            <h2>How to Design Your SGL Mission</h2>
          </div>
          <button className="skip-btn" onClick={() => { sound.click(); onSkip(); }}>
            Skip to Briefing ⏩
          </button>
        </div>

        {/* Tab Navigator */}
        <div className="tutorial-tabs">
          {TUTORIAL_SLIDES.map((s, idx) => (
            <button
              key={idx}
              className={`tut-tab ${idx === slideIdx ? 'active' : ''}`}
              onClick={() => {
                sound.click();
                setSlideIdx(idx);
              }}
            >
              <span>{idx + 1}</span>
              <label>{s.badge}</label>
            </button>
          ))}
        </div>

        {/* Card Content */}
        <div className="tut-card">
          <div className="tut-card-top">
            <span className="badge-chip">{slide.badge}</span>
            <h3>{slide.title}</h3>
          </div>

          <p className="tut-text">{slide.content}</p>

          {/* Rules checklist if present */}
          {slide.rules && (
            <div className="tut-rules-box">
              {slide.rules.map((r, i) => (
                <div key={i} className="tut-rule-item">
                  <span className="rule-check">✓</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          )}

          {/* Interactive CSS Visual Diagram based on slide */}
          <div className="tut-diagram-container">
            {slide.diagram === 'lens' && (
              <div className="lens-diagram">
                <div className="star-source">
                  <span className="source-dot" />
                  <small>Exoplanet Light</small>
                </div>
                <div className="light-rays">
                  <div className="ray ray-top" />
                  <div className="ray ray-bottom" />
                </div>
                <div className="sun-mass">
                  <div className="sun-core" />
                  <div className="corona-glow" />
                  <small>Sun's Gravity Bends Light</small>
                </div>
                <div className="bent-rays">
                  <div className="bent bent-top" />
                  <div className="bent bent-bottom" />
                </div>
                <div className="focal-probe">
                  <div className="einstein-halo" />
                  <div className="probe-icon">🛰</div>
                  <small>Probe at 650 AU sees magnified Einstein Ring</small>
                </div>
              </div>
            )}

            {slide.diagram === 'distance' && (
              <div className="distance-scale-diagram">
                <div className="scale-track">
                  <div className="scale-point p-earth">
                    <span className="scale-dot" />
                    <b>Earth</b>
                    <small>1 AU</small>
                  </div>
                  <div className="scale-line" />
                  <div className="scale-point p-mars">
                    <span className="scale-dot" />
                    <b>Mars</b>
                    <small>1.5 AU</small>
                  </div>
                  <div className="scale-line" />
                  <div className="scale-point p-jupiter">
                    <span className="scale-dot" />
                    <b>Jupiter</b>
                    <small>5.2 AU</small>
                  </div>
                  <div className="scale-line" />
                  <div className="scale-point p-voyager">
                    <span className="scale-dot" />
                    <b>Voyager 1</b>
                    <small>~160 AU</small>
                  </div>
                  <div className="scale-line bold" />
                  <div className="scale-point p-sgl">
                    <span className="scale-dot pulse" />
                    <b>SGL Focal Zone</b>
                    <small>550 – 650 AU</small>
                  </div>
                </div>
                <div className="diagram-note">
                  Voyager 1 took 40+ years to reach 160 AU. With high-thrust chemical staging + ion cruise, our mission aims for 650 AU!
                </div>
              </div>
            )}

            {slide.diagram === 'assembly' && (
              <div className="assembly-diagram">
                <div className="assembly-slots-preview">
                  <div className="slot-sample fairing">⬡ Fairing / Science Payload</div>
                  <div className="slot-connector">▼</div>
                  <div className="slot-sample power">⚡ Power (MMRTG) & Comms (Dish)</div>
                  <div className="slot-connector">▼</div>
                  <div className="slot-sample tanks">🛢 Fuel Tanks (Upper Stage + Booster)</div>
                  <div className="slot-connector">▼</div>
                  <div className="slot-sample engines">🔥 High-Thrust Engine (TWR &gt; 1.0)</div>
                </div>
                <div className="assembly-notes">
                  <b>Drag & Drop:</b> Move parts between the catalog and your rocket slots. Or click any part to automatically equip it to the next open slot!
                </div>
              </div>
            )}

            {slide.diagram === 'loop' && (
              <div className="loop-diagram">
                <div className="loop-step">
                  <span className="l-num">1</span>
                  <b>Mission Brief</b>
                  <small>Pick target</small>
                </div>
                <div className="l-arrow">→</div>
                <div className="loop-step">
                  <span className="l-num">2</span>
                  <b>Rocket Builder</b>
                  <small>Snap parts</small>
                </div>
                <div className="l-arrow">→</div>
                <div className="loop-step">
                  <span className="l-num">3</span>
                  <b>Launch & Cruise</b>
                  <small>Reach 650 AU</small>
                </div>
                <div className="l-arrow">→</div>
                <div className="loop-step">
                  <span className="l-num">4</span>
                  <b>Einstein Ring</b>
                  <small>Align optics</small>
                </div>
                <div className="l-arrow">→</div>
                <div className="loop-step">
                  <span className="l-num">5</span>
                  <b>Earth Return</b>
                  <small>Deconvolve & score</small>
                </div>
              </div>
            )}
          </div>

          {/* Pro-Tip Box */}
          <div className="tut-tip">
            <p>{slide.tip}</p>
          </div>

          {/* Navigation buttons */}
          <div className="tut-actions">
            <button
              className="secondary-btn"
              onClick={handleBack}
              disabled={slideIdx === 0}
            >
              ← Previous
            </button>

            <button className="primary-btn" onClick={handleNext}>
              {slideIdx === TUTORIAL_SLIDES.length - 1 ? 'Go to Mission Brief 📋' : 'Next Step →'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
