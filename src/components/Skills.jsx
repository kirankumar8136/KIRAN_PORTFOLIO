import React, { useState } from 'react';
import { SKILL_CATEGORIES } from '../data/portfolioData';
import { playBlipSound } from '../utils/audio';

export function Skills() {
  const [hoveredSkill, setHoveredSkill] = useState(null);

  return (
    <section className="section" id="skills">
      <div className="section-header">
        <span className="section-tag">// 03 • CORE COMPETENCIES</span>
        <h2 className="section-heading">
          DOMAIN <span className="neon-text">EXPERTISE</span>
        </h2>
        <p className="section-sub">
          Comprehensive technical mastery across intelligent software, spatial design, and hardware engineering.
        </p>
      </div>

      <div className="skills-matrix">
        {SKILL_CATEGORIES.map((cat, idx) => (
          <div key={idx} className="skill-category-card fun-bounce-card">
            <div className="card-glow" style={{ background: `radial-gradient(circle at top right, ${cat.color}22, transparent 70%)` }}></div>
            
            <div className="category-header">
              <div className="cat-icon" style={{ borderColor: cat.color, color: cat.color }}>
                <i className={cat.icon}></i>
              </div>
              <div>
                <h3 className="cat-title">{cat.title}</h3>
                <span className="cat-sub">{cat.subtitle}</span>
              </div>
            </div>

            <div className="skill-meter-list">
              {cat.skills.map((skill, sIdx) => {
                const isHovered = hoveredSkill === `${idx}-${sIdx}`;
                return (
                  <div
                    key={sIdx}
                    className="skill-item"
                    onMouseEnter={() => {
                      playBlipSound(600 + sIdx * 50, 0.02);
                      setHoveredSkill(`${idx}-${sIdx}`);
                    }}
                    onMouseLeave={() => setHoveredSkill(null)}
                  >
                    <div className="skill-info">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-pct" style={{ color: cat.color }}>{skill.pct}%</span>
                    </div>

                    <div className="cyber-track">
                      <div
                        className="cyber-fill"
                        style={{
                          width: `${skill.pct}%`,
                          background: `linear-gradient(90deg, ${cat.color}66, ${cat.color})`
                        }}
                      />
                    </div>

                    {/* Funny note tooltip when hovered */}
                    {isHovered && (
                      <div className="skill-funny-badge">
                        <i className="fa-solid fa-sparkles"></i> {skill.funnyNote}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
