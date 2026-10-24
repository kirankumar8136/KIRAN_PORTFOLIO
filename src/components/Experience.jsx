import React from 'react';
import { EXPERIENCES } from '../data/portfolioData';

export function Experience() {
  return (
    <section className="section" id="experience">
      <div className="section-header">
        <span className="section-tag">// 06 • TRACK RECORD</span>
        <h2 className="section-heading">
          EXPERIENCE & <span className="neon-text">TRAJECTORY</span>
        </h2>
        <p className="section-sub">
          Over half a decade of relentless execution across architecture, digital media, and computing.
        </p>
      </div>

      <div className="timeline-container">
        <div className="timeline-line"></div>

        {EXPERIENCES.map((exp, idx) => (
          <div key={idx} className="timeline-node fun-bounce-card">
            <div className="node-marker"></div>
            <div className="node-content">
              <div className="node-header">
                <span className="node-year">{exp.period}</span>
                <span className="node-badge">{exp.badge}</span>
              </div>
              <h3 className="node-title">{exp.title}</h3>
              <p className="node-desc">{exp.desc}</p>
              <div className="node-tags">
                {exp.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="fun-tag-hover">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
