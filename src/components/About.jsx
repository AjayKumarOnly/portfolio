import React from 'react';
import { motion } from 'framer-motion';
import { User, Code, Briefcase, GraduationCap } from 'lucide-react';

export default function About({ profile, timeline = [] }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section id="about" style={{ background: 'rgba(255, 255, 255, 0.01)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
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
            <User size={14} /> Get to know me
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{ fontSize: '2.5rem', color: '#fff' }}
          >
            About <span className="text-gradient">Myself</span>
          </motion.h2>
        </div>

        {/* Section Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '4rem', width: '100%' }} className="about-grid">
          
          {/* Left Column: Bio & Skills */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left' }}
          >
            <motion.div variants={itemVariants} className="glass" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={20} style={{ color: 'var(--primary-light)' }} /> Biography
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.7' }}>
                {profile.about}
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="glass" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Code size={20} style={{ color: 'var(--secondary)' }} /> Skills & Expertises
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {profile.skills.map((skill, index) => (
                  <motion.span 
                    key={index} 
                    className="badge"
                    whileHover={{ scale: 1.08, background: 'var(--gradient-accent)', color: '#fff', borderColor: 'transparent' }}
                    style={{ 
                      padding: '0.5rem 1rem', 
                      fontSize: '0.9rem', 
                      cursor: 'default',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Timeline */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left' }}
          >
            <div className="glass" style={{ padding: '2rem', height: '100%' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Briefcase size={20} style={{ color: 'var(--primary-light)' }} /> Professional Timeline
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', position: 'relative', width: '100%' }}>
                {timeline.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.08)', width: '100%' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No professional timeline history added yet.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', position: 'relative', paddingLeft: '1.5rem', width: '100%' }}>
                    {/* Timeline vertical bar */}
                    <div style={{ position: 'absolute', left: '4px', top: '8px', bottom: '8px', width: '2px', background: 'linear-gradient(to bottom, var(--primary), var(--secondary))', opacity: 0.3 }} />

                    {timeline.map((item, index) => (
                      <div key={item.id || index} style={{ position: 'relative' }}>
                        {/* Timeline bullet */}
                        <div style={{ 
                          position: 'absolute', 
                          left: '-23px', 
                          top: '6px', 
                          width: '10px', 
                          height: '10px', 
                          borderRadius: '50%', 
                          background: item.type === 'work' ? 'var(--primary)' : 'var(--secondary)',
                          border: '2px solid var(--bg-primary)',
                          boxShadow: `0 0 8px ${item.type === 'work' ? 'var(--primary)' : 'var(--secondary)'}`
                        }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.4rem' }}>
                          <h4 style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 600 }}>{item.title}</h4>
                          <span className="badge" style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', background: 'rgba(255,255,255,0.04)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                            {item.period}
                          </span>
                        </div>

                        <div style={{ fontSize: '0.85rem', color: 'var(--primary-light)', fontWeight: 500, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          {item.type === 'work' ? <Briefcase size={12} /> : <GraduationCap size={12} />}
                          {item.organization}
                        </div>

                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </section>
  );
}
