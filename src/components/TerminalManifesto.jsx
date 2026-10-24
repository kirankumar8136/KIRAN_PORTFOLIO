import React, { useState } from 'react';
import { playBlipSound } from '../utils/audio';

export function TerminalManifesto({ onToast }) {
  const [copied, setCopied] = useState(false);

  const manifestoJson = `{
  "architect": "Kiran Kumar K",
  "location": "Kozhikode, Kerala, India",
  "discipline_matrix": [
    "Artificial Intelligence & Data Science",
    "AutoDesk Certified CAD Drafting",
    "Blender 3D Modeling & Realtime Rendering",
    "Unreal Engine 5 Interactive Tech",
    "Enterprise Workstation Hardware"
  ],
  "mission": "To bridge computational intelligence with hyper-detailed spatial aesthetics, building powerful tools and inspiring visual environments.",
  "availability": "Worldwide Remote & On-Site Collaborations",
  "status": true
}`;

  const copyManifesto = () => {
    playBlipSound(1200, 0.06);
    navigator.clipboard.writeText(manifestoJson).then(() => {
      setCopied(true);
      if (onToast) onToast("Manifesto JSON copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <section className="section">
      <div className="terminal-window fun-bounce-card">
        <div className="terminal-header">
          <div className="terminal-dots">
            <span className="dot dot-red"></span>
            <span className="dot dot-yellow"></span>
            <span className="dot dot-green"></span>
          </div>
          <span className="terminal-title">kiran@quantum-workstation:~# cat manifesto.json</span>
          <div className="terminal-actions">
            <button className="terminal-copy-btn fun-wobble-hover" onClick={copyManifesto} title="Copy JSON">
              <i className={`fa-regular ${copied ? 'fa-circle-check' : 'fa-copy'}`}></i>
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <span className="terminal-badge">JSON UTF-8</span>
          </div>
        </div>
        <div className="terminal-body">
          <pre>
            <code>
{`{
  `}<span className="json-k">"architect"</span>{`: `}<span className="json-s">"Kiran Kumar K"</span>{`,
  `}<span className="json-k">"location"</span>{`: `}<span className="json-s">"Kozhikode, Kerala, India"</span>{`,
  `}<span className="json-k">"discipline_matrix"</span>{`: [
    `}<span className="json-s">"Artificial Intelligence & Data Science"</span>{`,
    `}<span className="json-s">"AutoDesk Certified CAD Drafting"</span>{`,
    `}<span className="json-s">"Blender 3D Modeling & Realtime Rendering"</span>{`,
    `}<span className="json-s">"Unreal Engine 5 Interactive Tech"</span>{`,
    `}<span className="json-s">"Enterprise Workstation Hardware"</span>{`
  ],
  `}<span className="json-k">"mission"</span>{`: `}<span className="json-s">"To bridge computational intelligence with hyper-detailed spatial aesthetics, building powerful tools and inspiring visual environments."</span>{`,
  `}<span className="json-k">"availability"</span>{`: `}<span className="json-s">"Worldwide Remote & On-Site Collaborations"</span>{`,
  `}<span className="json-k">"status"</span>{`: `}<span className="json-v">true</span>{`
}`}
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
}
