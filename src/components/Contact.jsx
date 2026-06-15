import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

const GithubIcon = ({ size = 20, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedinIcon = ({ size = 20, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = ({ size = 20, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);

import { saveInquiry } from '../utils/storage';

export default function Contact({ profile, onShowToast }) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, sending, success

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      if (onShowToast) onShowToast('error', 'Please fill in all required fields.');
      return;
    }

    setStatus('sending');

    // Simulate sending network request (1.5s delay)
    setTimeout(() => {
      try {
        saveInquiry(formData);
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        if (onShowToast) onShowToast('success', 'Inquiry saved successfully!');
      } catch (err) {
        setStatus('idle');
        if (onShowToast) onShowToast('error', 'Failed to save inquiry.');
      }
    }, 1500);
  };

  return (
    <section id="contact">
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="badge"
            style={{ marginBottom: '1rem', gap: '0.4rem' }}
          >
            <Mail size={14} /> Contact
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{ fontSize: '2.5rem', color: '#fff' }}
          >
            Get In <span className="text-gradient">Touch</span>
          </motion.h2>
        </div>

        {/* Contact Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: '3.5rem', width: '100%', textAlign: 'left' }} className="contact-grid">
          
          {/* Left Column: Contact details */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            <div className="glass" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <h3 style={{ fontSize: '1.4rem', color: '#fff' }}>Contact Information</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Feel free to reach out to me! Whether it is about a new project opportunity, a technical question, or just to say hello, I will do my best to get back to you.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: 'rgba(139, 92, 246, 0.1)', borderRadius: '10px', padding: '0.6rem', border: '1px solid rgba(139, 92, 246, 0.2)', color: 'var(--primary-light)' }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Email Me</div>
                    <a href={`mailto:${profile.contact.email}`} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>
                      {profile.contact.email}
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: 'rgba(6, 182, 212, 0.1)', borderRadius: '10px', padding: '0.6rem', border: '1px solid rgba(6, 182, 212, 0.2)', color: 'var(--secondary)' }}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Call Me</div>
                    <a href={`tel:${profile.contact.phone}`} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>
                      {profile.contact.phone}
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px', padding: '0.6rem', border: '1px solid rgba(16, 185, 129, 0.2)', color: 'var(--accent)' }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Location</div>
                    <div style={{ color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 500 }}>
                      {profile.contact.location}
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.5rem' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>Social Networks &amp; Links</div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {profile.contact.github && (
                    <motion.a 
                      href={profile.contact.github} target="_blank" rel="noopener noreferrer"
                      className="btn btn-secondary" style={{ padding: '0.6rem', borderRadius: '10px' }}
                      whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                      title="GitHub"
                    >
                      <GithubIcon size={18} />
                    </motion.a>
                  )}
                  {profile.contact.linkedin && (
                    <motion.a 
                      href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer"
                      className="btn btn-secondary" style={{ padding: '0.6rem', borderRadius: '10px' }}
                      whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                      title="LinkedIn"
                    >
                      <LinkedinIcon size={18} />
                    </motion.a>
                  )}
                  {profile.contact.twitter && (
                    <motion.a 
                      href={profile.contact.twitter} target="_blank" rel="noopener noreferrer"
                      className="btn btn-secondary" style={{ padding: '0.6rem', borderRadius: '10px' }}
                      whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                      title="Twitter"
                    >
                      <TwitterIcon size={18} />
                    </motion.a>
                  )}
                  {/* Custom links */}
                  {(profile.contact.links || []).map((link) => (
                    <motion.a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      style={{ padding: '0.45rem 0.9rem', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 600, gap: '0.35rem' }}
                      whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                      title={link.url}
                    >
                      {link.label}
                    </motion.a>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>

          {/* Right Column: Contact form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="glass" style={{ padding: '2.5rem', height: '100%' }}>
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  /* Form Success State */
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    style={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      textAlign: 'center',
                      gap: '1rem',
                      padding: '2rem 0'
                    }}
                  >
                    <CheckCircle2 size={64} style={{ color: 'var(--accent)' }} />
                    <h3 style={{ fontSize: '1.5rem', color: '#fff' }}>Message Received!</h3>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '350px', fontSize: '0.95rem' }}>
                      Thank you for your message. It has been successfully stored in our backend. The owner will review it upon logging into their dashboard.
                    </p>
                    <button className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }} onClick={() => setStatus('idle')}>
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  /* Contact Form */
                  <motion.form 
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                  >
                    <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '0.5rem' }}>Send a Message</h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-row">
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Name <span style={{ color: 'var(--danger)' }}>*</span></label>
                        <input 
                          type="text" name="name" className="form-input" required 
                          value={formData.name} onChange={handleChange} placeholder="Your name" 
                          disabled={status === 'sending'}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Email <span style={{ color: 'var(--danger)' }}>*</span></label>
                        <input 
                          type="email" name="email" className="form-input" required 
                          value={formData.email} onChange={handleChange} placeholder="your.email@domain.com"
                          disabled={status === 'sending'}
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Subject</label>
                      <input 
                        type="text" name="subject" className="form-input" 
                        value={formData.subject} onChange={handleChange} placeholder="What is this about?"
                        disabled={status === 'sending'}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Message <span style={{ color: 'var(--danger)' }}>*</span></label>
                      <textarea 
                        name="message" className="form-input" required 
                        value={formData.message} onChange={handleChange} placeholder="Type your message here..."
                        disabled={status === 'sending'}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }} disabled={status === 'sending'}>
                      {status === 'sending' ? (
                        <>Sending...</>
                      ) : (
                        <>
                          Send Message
                          <Send size={16} />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .form-row {
            grid-template-columns: 1fr !important;
            gap: 1.25rem !important;
          }
        }
      `}</style>
    </section>
  );
}
