import React, { useState } from 'react';
import { CERTIFICATES } from '../data/portfolioData';
import { playBlipSound } from '../utils/audio';

export function Certificates({ onOpenModal }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filterTabs = [
    { key: 'all', label: 'All Disciplines' },
    { key: 'arch', label: '3D & CAD' },
    { key: 'dev', label: 'Software & Web' },
    { key: 'hard', label: 'Hardware & Gaming' }
  ];

  const filteredCerts = CERTIFICATES.filter(
    (c) => activeFilter === 'all' || c.category === activeFilter
  );

  return (
    <section className="section" id="certificates">
      <div className="section-header">
        <span className="section-tag">// 05 • VERIFIED CREDENTIALS</span>
        <h2 className="section-heading">
          CERTIFICATIONS & <span className="neon-text">RECORDS</span>
        </h2>
        <p className="section-sub">
          Formally verified competencies from industry recognized institutions and specialized academies.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="cert-filters">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            className={`cert-filter-btn ${activeFilter === tab.key ? 'active' : ''}`}
            onClick={() => {
              playBlipSound(800, 0.03);
              setActiveFilter(tab.key);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="cert-grid">
        {filteredCerts.map((cert) => (
          <div key={cert.id} className="cert-card fun-bounce-card">
            <div className="cert-icon-wrapper">
              <i className={cert.icon}></i>
            </div>
            <div className="cert-details">
              <span className="cert-issuer">{cert.issuer}</span>
              <h4 className="cert-name">{cert.title}</h4>
              <p className="cert-summary">{cert.desc}</p>
            </div>
            <div className="cert-actions">
              <button
                className="btn btn-cyber-primary w-full fun-btn-bounce"
                onClick={() => {
                  playBlipSound(1050, 0.05);
                  onOpenModal({
                    title: cert.title,
                    url: cert.fileUrl,
                    type: cert.type
                  });
                }}
              >
                <i className={cert.type === 'pdf' ? 'fa-solid fa-file-pdf' : 'fa-solid fa-image'}></i>{' '}
                {cert.type === 'pdf' ? 'View Document (PDF)' : 'Inspect Record'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
