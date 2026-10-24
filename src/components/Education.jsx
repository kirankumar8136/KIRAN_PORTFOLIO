import React from 'react';
import { playBlipSound } from '../utils/audio';

export function Education({ onOpenModal }) {
  return (
    <section className="section" id="education">
      <div className="section-header">
        <span className="section-tag">// 04 • ACADEMIC PILLARS</span>
        <h2 className="section-heading">
          EDUCATION & <span className="neon-text">ACADEMIA</span>
        </h2>
        <p className="section-sub">
          Rigorous formal training in artificial intelligence, mathematics, and data sciences.
        </p>
      </div>

      <div className="education-grid">
        {/* Main Degree Card */}
        <div className="cyber-glass-box fun-bounce-card">
          <div className="box-badge">
            <i className="fa-solid fa-graduation-cap"></i> DEGREE PURSUIT
          </div>
          <h3 className="box-title">BCA Honors with AI & Data Science</h3>
          <p className="institution-name">
            <i className="fa-solid fa-building-columns"></i> Don Bosco College Mampetta
          </p>
          <span className="location-tag">
            <i className="fa-solid fa-location-dot"></i> Mukkam, Kozhikode, Kerala
          </span>

          <p className="box-desc">
            Undergoing comprehensive degree curriculum focusing on Artificial Intelligence concepts, 
            Machine Learning algorithms, Data Structures, Modern Object-Oriented Paradigms, 
            Database Engineering, and Applied Computer Science frameworks.
          </p>

          <div className="curriculum-tags">
            <span className="tag">Artificial Intelligence</span>
            <span className="tag">Data Science</span>
            <span className="tag">Python</span>
            <span className="tag">Data Analysis</span>
            <span className="tag">Algorithms</span>
          </div>
        </div>

        {/* Academic Excellence & Recognition */}
        <div className="cyber-glass-box fun-bounce-card">
          <div className="box-badge">
            <i className="fa-solid fa-award"></i> DISTINCTIONS
          </div>
          <h3 className="box-title">Academic & Domain Excellence</h3>
          <p className="institution-name">
            <i className="fa-solid fa-trophy"></i> Multi-Disciplinary College Achievements
          </p>
          <span className="location-tag">
            <i className="fa-solid fa-star"></i> Curricular & Co-Curricular Accolades
          </span>

          <p className="box-desc">
            Active participant and recognized contributor across technical symposiums, 
            creative media leadership, CAD design competitions, and technology initiatives.
          </p>

          <div className="card-action-bar">
            <button
              className="btn btn-cyber-secondary fun-btn-bounce"
              onClick={() => {
                playBlipSound(1000, 0.05);
                onOpenModal({
                  title: 'Academic & Activity Badges',
                  url: '/tags.jpeg',
                  type: 'image'
                });
              }}
            >
              <i className="fa-solid fa-image"></i> Inspect Verification Badges
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
