import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, ExternalLink, ZoomIn, X, Info } from 'lucide-react';

const GithubIcon = ({ size = 20, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);


export default function Projects({ projects }) {
  const [selectedProject, setSelectedProject] = useState(null);

  // Helper to generate a unique gradient based on project title if no image is uploaded
  const getGradientForTitle = (title) => {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue1 = Math.abs(hash) % 360;
    const hue2 = (hue1 + 140) % 360;
    return `linear-gradient(135deg, hsl(${hue1}, 75%, 40%) 0%, hsl(${hue2}, 85%, 15%) 100%)`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section id="projects">
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
            <Briefcase size={14} /> My portfolio
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{ fontSize: '2.5rem', color: '#fff' }}
          >
            Featured <span className="text-gradient">Projects</span>
          </motion.h2>
        </div>

        {/* Projects Display Logic */}
        {projects.length === 0 ? (
          /* Empty State */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass"
            style={{ 
              maxWidth: '600px', 
              margin: '0 auto', 
              padding: '3rem 2rem', 
              textAlign: 'center', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '1.25rem' 
            }}
          >
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.03)', 
              border: '1px solid rgba(255,255,255,0.06)', 
              borderRadius: '50%', 
              width: '80px', 
              height: '80px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: 'var(--shadow-neon)'
            }}>
              <Briefcase size={36} style={{ color: 'var(--secondary)' }} />
            </div>
            <h3 style={{ fontSize: '1.5rem', color: '#fff' }}>No Projects Preloaded</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', maxWidth: '450px' }}>
              The portfolio data is currently empty. If you are the owner, access the hidden admin panel using the keyboard shortcut <code style={{ color: 'var(--primary-light)' }}>Ctrl + Shift + A</code> or double-click the copyright text in the footer to add your projects!
            </p>
          </motion.div>
        ) : (
          /* Projects Grid */
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
              gap: '2rem', 
              width: '100%' 
            }}
          >
            {projects.map((project, index) => (
              <motion.div 
                key={project.id || index}
                variants={cardVariants}
                className="glass glass-hover"
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  height: '100%', 
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onClick={() => setSelectedProject(project)}
              >
                {/* Project Image Header */}
                <div style={{ 
                  height: '200px', 
                  width: '100%', 
                  position: 'relative', 
                  overflow: 'hidden',
                  background: project.image ? 'none' : getGradientForTitle(project.title)
                }}>
                  {project.image ? (
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                      className="project-card-image"
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.05em', textAlign: 'center', padding: '1rem' }}>
                        {project.title}
                      </span>
                    </div>
                  )}
                  {/* Zoom Overlay */}
                  <div className="zoom-overlay" style={{ 
                    position: 'absolute', 
                    top: 0, left: 0, right: 0, bottom: 0, 
                    background: 'rgba(9, 7, 16, 0.4)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    opacity: 0, transition: 'opacity 0.3s' 
                  }}>
                    <ZoomIn size={28} style={{ color: '#fff' }} />
                  </div>
                </div>

                {/* Project Body */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', flexGrow: 1, textAlign: 'left' }}>
                  <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>{project.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineClamp: 3, WebkitLineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '4.5rem' }}>
                    {project.description}
                  </p>
                  
                  {/* Tech Stack tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: 'auto' }}>
                    {project.technologies && project.technologies.slice(0, 3).map((tech, idx) => (
                      <span key={idx} className="badge" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>
                        {tech}
                      </span>
                    ))}
                    {project.technologies && project.technologies.length > 3 && (
                      <span className="badge" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)' }}>
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Project Detailed Modal */}
        <AnimatePresence>
          {selectedProject && (
            <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
              <motion.div 
                className="modal-content glass"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(20, 15, 35, 0.95) 0%, rgba(12, 10, 20, 0.98) 100%)',
                  maxWidth: '680px',
                  textAlign: 'left'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button className="modal-close" onClick={() => setSelectedProject(null)}>
                  <X size={24} />
                </button>

                {/* Modal Image/Gradient Header */}
                <div style={{ 
                  height: '280px', 
                  width: '100%', 
                  borderRadius: '12px',
                  overflow: 'hidden',
                  marginBottom: '1.5rem',
                  background: selectedProject.image ? 'none' : getGradientForTitle(selectedProject.title)
                }}>
                  {selectedProject.image ? (
                    <img src={selectedProject.image} alt={selectedProject.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.95)', letterSpacing: '0.05em' }}>
                        {selectedProject.title}
                      </span>
                    </div>
                  )}
                </div>

                <h3 style={{ fontSize: '1.75rem', color: '#fff', marginBottom: '0.75rem' }}>{selectedProject.title}</h3>
                
                {/* Full technologies tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  {selectedProject.technologies && selectedProject.technologies.map((tech, idx) => (
                    <span key={idx} className="badge" style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem' }}>
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Detailed description paragraph */}
                <div style={{ 
                  maxHeight: '200px', 
                  overflowY: 'auto', 
                  paddingRight: '0.5rem', 
                  marginBottom: '2rem', 
                  color: 'var(--text-secondary)',
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap'
                }}>
                  {selectedProject.detailedDescription || selectedProject.description}
                </div>

                {/* Action Links */}
                <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
                  {selectedProject.demoLink && (
                    <a href={selectedProject.demoLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                      Live Demo <ExternalLink size={16} />
                    </a>
                  )}
                  {selectedProject.githubLink && (
                    <a href={selectedProject.githubLink} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                      GitHub Code <GithubIcon size={16} />
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>

      <style>{`
        .glass-hover:hover .project-card-image {
          transform: scale(1.05);
        }
        .glass-hover:hover .zoom-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </section>
  );
}
