import React, { useState, useEffect } from 'react';
import { sound } from '../audio';
import { STORY_CHAPTERS } from '../data';

export default function Storyline({ onNext, onSkip }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const chapter = STORY_CHAPTERS[currentIdx];

  // Typewriter effect
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let charIdx = 0;
    const fullText = chapter.text;

    const interval = setInterval(() => {
      if (charIdx < fullText.length) {
        setDisplayedText(fullText.slice(0, charIdx + 1));
        charIdx++;
        if (charIdx % 4 === 0) {
          sound.beep(1200 + Math.random() * 200);
        }
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 18);

    return () => clearInterval(interval);
  }, [currentIdx]);

  const handleNext = () => {
    sound.click();
    if (isTyping) {
      // Instantly finish typing
      setDisplayedText(chapter.text);
      setIsTyping(false);
      return;
    }
    if (currentIdx < STORY_CHAPTERS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      sound.success();
      onNext();
    }
  };

  const handleBack = () => {
    sound.click();
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  return (
    <section className="storyline-wrapper">
      <div className="story-container">
        {/* Terminal Header */}
        <div className="story-header">
          <div className="terminal-dots">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
          </div>
          <div className="story-tag">SECURE COMM CHANNEL // MISSION DIRECTIVE 2147-A</div>
          <button className="skip-btn" onClick={() => { sound.click(); onSkip(); }}>
            Skip Story ⏩
          </button>
        </div>

        {/* Narrative Box */}
        <div className="story-card">
          <div className="act-indicator">
            <span>{chapter.title}</span>
            <span className="act-counter">PART {currentIdx + 1} OF {STORY_CHAPTERS.length}</span>
          </div>

          <div className="speaker-profile">
            <div className="speaker-avatar">{chapter.avatar}</div>
            <div className="speaker-info">
              <h3>{chapter.speaker}</h3>
              <p className="speaker-role">{chapter.role}</p>
            </div>
          </div>

          <div className="dialogue-box">
            <p className="dialogue-text">
              {displayedText}
              {isTyping && <span className="cursor">█</span>}
            </p>
            {!isTyping && chapter.subtext && (
              <p className="dialogue-subtext">
                <b>ANALYSIS:</b> {chapter.subtext}
              </p>
            )}
          </div>

          {/* Cinematic Graphic Preview */}
          <div className="story-illustration">
            {currentIdx === 0 && (
              <div className="ill-telescope">
                <div className="ill-star" />
                <div className="ill-beam" />
                <div className="ill-dish" />
                <div className="ill-caption">Fig 1.1: Conventional Optical Limitation (Diffraction limit blur)</div>
              </div>
            )}
            {currentIdx === 1 && (
              <div className="ill-lens">
                <div className="ill-sun" />
                <div className="ill-ring" />
                <div className="ill-focal-line" />
                <div className="ill-caption">Fig 2.4: Solar Gravitational Lens (Light rays converge at 550+ AU)</div>
              </div>
            )}
            {currentIdx === 2 && (
              <div className="ill-mission">
                <div className="ill-blueprint" />
                <div className="ill-caption">Fig 3.0: Project MIRAGE HORIZON Authorization Docket</div>
              </div>
            )}
          </div>

          {/* Stepper controls */}
          <div className="story-actions">
            <button
              className="secondary-btn"
              onClick={handleBack}
              disabled={currentIdx === 0}
            >
              ← Previous
            </button>

            <div className="story-progress-dots">
              {STORY_CHAPTERS.map((_, i) => (
                <span
                  key={i}
                  className={`p-dot ${i === currentIdx ? 'active' : ''} ${i < currentIdx ? 'done' : ''}`}
                  onClick={() => { sound.click(); setCurrentIdx(i); }}
                />
              ))}
            </div>

            <button className="primary-btn" onClick={handleNext}>
              {isTyping ? 'Fast-Forward ⏩' : currentIdx === STORY_CHAPTERS.length - 1 ? 'Proceed to Tutorial 🚀' : 'Next Chapter →'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
