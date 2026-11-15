import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import Storyline from './components/Storyline';
import Tutorial from './components/Tutorial';
import MissionBrief from './components/MissionBrief';
import RocketCustomization from './components/RocketCustomization';
import LaunchFlight from './components/LaunchFlight';
import EinsteinRing from './components/EinsteinRing';
import BackToEarth from './components/BackToEarth';
import DataAnalysis from './components/DataAnalysis';

import { EXOPLANETS } from './data';
import { sound } from './audio';
import './style.css';

export default function App() {
  const [currentPhase, setCurrentPhase] = useState('homepage');

  // Mission configurations with generous budget
  const [selectedTargetId, setSelectedTargetId] = useState(EXOPLANETS[0].id);
  const [focalDistance, setFocalDistance] = useState(650);
  const [budget, setBudget] = useState(2500); // Generous budget allocation (2,500 CR)

  // Staged rocket physics & Telemetry
  const [rocketPhysics, setRocketPhysics] = useState(null);
  const [experimentData, setExperimentData] = useState(null);

  const selectedTarget = EXOPLANETS.find(p => p.id === selectedTargetId) || EXOPLANETS[0];

  const goToPhase = (phase) => {
    sound.click();
    setCurrentPhase(phase);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchRocket = (physics) => {
    setRocketPhysics(physics);
    goToPhase('flight');
  };

  const handleArrivalAtFocalZone = () => {
    goToPhase('experiment');
  };

  const handleFinishExperiment = (data) => {
    setExperimentData(data);
    goToPhase('earth');
  };

  const handleFinishTransmission = () => {
    goToPhase('analysis');
  };

  return (
    <div className="app-root">
      {/* Top Navbar with no stage skipping */}
      <Navbar
        currentPhase={currentPhase}
        target={selectedTarget}
        budget={budget}
        spent={rocketPhysics?.totalCost || 0}
      />

      <main className="main-viewport">
        {currentPhase === 'homepage' && (
          <Homepage
            onStart={() => goToPhase('storyline')}
            onTutorial={() => goToPhase('tutorial')}
          />
        )}

        {currentPhase === 'storyline' && (
          <Storyline
            onNext={() => goToPhase('tutorial')}
            onSkip={() => goToPhase('brief')}
          />
        )}

        {currentPhase === 'tutorial' && (
          <Tutorial
            onNext={() => goToPhase('brief')}
            onSkip={() => goToPhase('brief')}
          />
        )}

        {currentPhase === 'brief' && (
          <MissionBrief
            selectedTarget={selectedTargetId}
            setSelectedTarget={setSelectedTargetId}
            focalDistance={focalDistance}
            setFocalDistance={setFocalDistance}
            budget={budget}
            setBudget={setBudget}
            onNext={() => goToPhase('customization')}
          />
        )}

        {currentPhase === 'customization' && (
          <RocketCustomization
            budget={budget}
            onLaunch={handleLaunchRocket}
            onOpenMenu={() => goToPhase('brief')}
          />
        )}

        {currentPhase === 'flight' && (
          <LaunchFlight
            playerData={rocketPhysics}
            focalDistance={focalDistance}
            target={selectedTarget}
            onArrival={handleArrivalAtFocalZone}
            onAbortToHangar={() => goToPhase('customization')}
          />
        )}

        {currentPhase === 'experiment' && (
          <EinsteinRing
            target={selectedTarget}
            focalDistance={focalDistance}
            playerData={rocketPhysics}
            onFinishExperiment={handleFinishExperiment}
          />
        )}

        {currentPhase === 'earth' && (
          <BackToEarth
            target={selectedTarget}
            focalDistance={focalDistance}
            experimentData={experimentData}
            onFinishTransmission={handleFinishTransmission}
          />
        )}

        {currentPhase === 'analysis' && (
          <DataAnalysis
            target={selectedTarget}
            focalDistance={focalDistance}
            budget={budget}
            stats={rocketPhysics}
            experimentData={experimentData}
            onRedesign={() => goToPhase('customization')}
            onNewMission={() => goToPhase('brief')}
          />
        )}
      </main>

      <footer className="global-footer">
        <div className="footer-content">
          <span>◈ <b>MIRAGE HORIZON</b> · Solar Gravitational Lens Mission Simulator</span>
          <span>Authentic Spaceflight Simulator Staging Mechanics</span>
          <span>NASA Exoplanet Archive DOI 10.26133/NEA12</span>
        </div>
      </footer>
    </div>
  );
}
