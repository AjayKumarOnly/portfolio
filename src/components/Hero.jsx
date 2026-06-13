import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Download, FileText, Sparkles } from 'lucide-react';

export default function Hero({ profile, resume, onShowToast }) {
  const handleDownloadCV = () => {
    if (resume && resume.base64String) {
      try {
        // Convert base64 data URI → Blob → Object URL (works in all browsers)
        const base64 = resume.base64String;
        const byteString = atob(base64.split(',')[1]);
        const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
        const byteArray = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
          byteArray[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([byteArray], { type: mimeString });
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = resume.name || 'resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Release the object URL after a short delay
        setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);

        if (onShowToast) onShowToast('success', 'Resume downloaded successfully!');
      } catch (err) {
        console.error('Resume download error:', err);
        if (onShowToast) onShowToast('error', 'Failed to download resume. Please try again.');
      }
    } else {
      if (onShowToast) {
        onShowToast('info', 'No resume uploaded yet. Admin can upload one in the panel.');
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section id="home" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem', alignItems: 'center', width: '100%' }}>
        
        {/* Left text column */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}
        >
          <motion.div 
            variants={itemVariants} 
            className="badge" 
            style={{ 
              alignSelf: 'flex-start', 
              gap: '0.4rem', 
              padding: '0.4rem 0.8rem',
              fontSize: '0.85rem'
            }}
          >
            <Sparkles size={14} className="text-gradient" /> Welcome to my digital space
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, color: '#fff' }}
          >
            Hi, I'm <span className="text-gradient">{profile.name}</span>
          </motion.h1>

          <motion.h2 
            variants={itemVariants}
            style={{ fontSize: 'clamp(1.25rem, 2vw, 1.8rem)', fontWeight: 500, color: 'var(--text-secondary)' }}
          >
            {profile.title}
          </motion.h2>

          <motion.p 
            variants={itemVariants}
            style={{ fontSize: 'clamp(1rem, 1.2vw, 1.15rem)', color: 'var(--text-muted)', maxWidth: '600px', lineHeight: '1.7' }}
          >
            {profile.bio}
          </motion.p>

          <motion.div 
            variants={itemVariants}
            style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}
          >
            <button 
              className="btn btn-primary"
              onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}
            >
              View My Work
              <ArrowDown size={18} />
            </button>
            <button 
              className="btn btn-secondary"
              onClick={handleDownloadCV}
            >
              <Download size={18} />
              {resume ? 'Download Resume' : 'Resume N/A'}
            </button>
          </motion.div>
        </motion.div>

        {/* Right graphic column */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotateY: 15 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ 
            perspective: 1000, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center' 
          }}
          className="hero-image-container"
        >
          <motion.div 
            className="glass"
            whileHover={{ 
              rotateX: 10, 
              rotateY: -10, 
              scale: 1.02, 
              boxShadow: 'var(--shadow-neon-hover)',
              borderColor: 'rgba(255, 255, 255, 0.18)'
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ 
              width: '100%',
              maxWidth: '360px',
              aspectRatio: '1',
              padding: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, rgba(28, 20, 48, 0.6) 0%, rgba(15, 12, 25, 0.8) 100%)'
            }}
          >
            {/* Corner glows */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '40px', height: '40px', borderTop: '2px solid var(--secondary)', borderLeft: '2px solid var(--secondary)', borderTopLeftRadius: '16px' }} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '40px', height: '40px', borderBottom: '2px solid var(--primary)', borderRight: '2px solid var(--primary)', borderBottomRightRadius: '16px' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '0.8rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                <FileText size={32} style={{ color: 'var(--secondary)' }} />
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>SYSTEM ACTIVE</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: '2rem 0' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--primary-light)', fontWeight: 700, letterSpacing: '0.1em' }}>Core Technologies</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {profile.skills.slice(0, 5).map((skill, index) => (
                  <span 
                    key={index} 
                    className="badge"
                    style={{ background: 'rgba(255, 255, 255, 0.03)', color: 'var(--text-primary)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                  >
                    {skill}
                  </span>
                ))}
                {profile.skills.length > 5 && (
                  <span className="badge" style={{ background: 'var(--gradient-accent)', color: '#fff', border: 'none' }}>
                    +{profile.skills.length - 5} More
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--accent)', boxShadow: '0 0 10px var(--accent)', animation: 'pulse 1.5s infinite alternate' }} />
              <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Available for Projects</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #home .container {
            grid-template-columns: 1fr !important;
            text-align: center !important;
            gap: 2.5rem !important;
          }
          #home .container div:first-child {
            align-items: center !important;
            text-align: center !important;
          }
          .hero-image-container {
            order: -1;
          }
        }
        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 0.6; }
          100% { transform: scale(1.1); opacity: 1; }
        }
      `}</style>
    </section>
  );
}
