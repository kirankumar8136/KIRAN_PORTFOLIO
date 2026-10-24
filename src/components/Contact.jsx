import React, { useState } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { playBlipSound, playLaserSound, playLevelUpSound } from '../utils/audio';
import confetti from 'canvas-confetti';

export function Contact({ onToast }) {
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [dispatched, setDispatched] = useState(false);

  const copyToClipboard = (text, label) => {
    playBlipSound(1100, 0.05);
    navigator.clipboard.writeText(text).then(() => {
      if (onToast) onToast(`Copied to clipboard: ${text}`);
    }).catch(() => {
      if (onToast) onToast(`Select and copy: ${text}`);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    playLaserSound();
    playLevelUpSound();
    setDispatched(true);

    confetti({
      particleCount: 50,
      spread: 80,
      origin: { y: 0.7 }
    });

    if (onToast) onToast("🚀 Transmission prepared! Opening email client...");

    const mailtoUrl = `mailto:${PERSONAL_INFO.email}?subject=${encodeURIComponent('Portfolio Collaboration: ' + formData.name)}&body=${encodeURIComponent(formData.message)}`;
    window.location.href = mailtoUrl;

    setTimeout(() => {
      setDispatched(false);
      setFormData({ name: '', message: '' });
    }, 4000);
  };

  return (
    <section className="section" id="contact">
      <div className="section-header">
        <span className="section-tag">// 08 • ESTABLISH TRANSMISSION</span>
        <h2 className="section-heading">
          GET IN <span className="neon-text">TOUCH</span>
        </h2>
        <p className="section-sub">
          Direct channels for commissions, architectural consultations, AI projects, and creative inquiries.
        </p>
      </div>

      <div className="contact-grid">
        {/* Direct Channels */}
        <div className="contact-channels">
          
          {/* Phone 1 */}
          <div className="contact-card fun-bounce-card">
            <div className="contact-icon"><i className="fa-solid fa-phone-volume"></i></div>
            <div className="contact-info">
              <span className="contact-label">PRIMARY TELEPHONE</span>
              <span className="contact-val">{PERSONAL_INFO.phone1}</span>
            </div>
            <div className="contact-actions">
              <button 
                className="action-btn fun-wobble-hover" 
                onClick={() => copyToClipboard('8136997261', 'Phone 1')}
                title="Copy Number"
              >
                <i className="fa-regular fa-copy"></i>
              </button>
              <a href="tel:8136997261" className="action-btn fun-wobble-hover" title="Call Direct">
                <i className="fa-solid fa-phone"></i>
              </a>
            </div>
          </div>

          {/* Phone 2 */}
          <div className="contact-card fun-bounce-card">
            <div className="contact-icon"><i className="fa-solid fa-mobile-screen-button"></i></div>
            <div className="contact-info">
              <span className="contact-label">SECONDARY TELEPHONE</span>
              <span className="contact-val">{PERSONAL_INFO.phone2}</span>
            </div>
            <div className="contact-actions">
              <button 
                className="action-btn fun-wobble-hover" 
                onClick={() => copyToClipboard('9400066110', 'Phone 2')}
                title="Copy Number"
              >
                <i className="fa-regular fa-copy"></i>
              </button>
              <a href="tel:9400066110" className="action-btn fun-wobble-hover" title="Call Direct">
                <i className="fa-solid fa-phone"></i>
              </a>
            </div>
          </div>

          {/* Email */}
          <div className="contact-card fun-bounce-card">
            <div className="contact-icon"><i className="fa-solid fa-envelope-open-text"></i></div>
            <div className="contact-info">
              <span className="contact-label">TRANSMISSION INBOX</span>
              <span className="contact-val">{PERSONAL_INFO.email}</span>
            </div>
            <div className="contact-actions">
              <button 
                className="action-btn fun-wobble-hover" 
                onClick={() => copyToClipboard(PERSONAL_INFO.email, 'Email')}
                title="Copy Email"
              >
                <i className="fa-regular fa-copy"></i>
              </button>
              <a href={`mailto:${PERSONAL_INFO.email}`} className="action-btn fun-wobble-hover" title="Send Email">
                <i className="fa-solid fa-paper-plane"></i>
              </a>
            </div>
          </div>

          {/* Location */}
          <div className="contact-card fun-bounce-card">
            <div className="contact-icon"><i className="fa-solid fa-location-crosshairs"></i></div>
            <div className="contact-info">
              <span className="contact-label">HEADQUARTERS</span>
              <span className="contact-val">{PERSONAL_INFO.address}</span>
            </div>
          </div>

        </div>

        {/* Message Dispatcher Form */}
        <div className="contact-form-wrapper fun-bounce-card">
          <div className="form-header">
            <span className="form-title"><i className="fa-solid fa-tower-broadcast"></i> DIRECT TRANSMISSION</span>
            <span className="form-cipher">ENCRYPTION: AES-256</span>
          </div>

          <form className="cyber-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="form-name">CALLSIGN / NAME</label>
              <input
                type="text"
                id="form-name"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your identity or company"
                required
                className="cyber-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="form-msg">PAYLOAD / MESSAGE</label>
              <textarea
                id="form-msg"
                name="message"
                rows="5"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Detail your project or collaboration requirements..."
                required
                className="cyber-input"
              ></textarea>
            </div>

            <button type="submit" className="btn btn-cyber-primary w-full fun-btn-bounce">
              <span>{dispatched ? 'Dispatching Payload...' : 'Dispatch Transmission'}</span>
              <i className={`fa-solid ${dispatched ? 'fa-spinner fa-spin' : 'fa-rocket'}`}></i>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
