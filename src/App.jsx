import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, Shield, X } from 'lucide-react';

// Subcomponents
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import LoginModal from './components/LoginModal';
import AdminPanel from './components/AdminPanel';

// Utilities
import { getProfileData, getProjects, getResume, getTimeline } from './utils/storage';

export default function App() {
  const [profile, setProfile] = useState(getProfileData());
  const [projects, setProjects] = useState(getProjects());
  const [resume, setResume] = useState(getResume());
  const [timeline, setTimeline] = useState(getTimeline());
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  
  // Toast notifications
  const [toast, setToast] = useState(null);

  // Initialize Admin State from sessionStorage
  useEffect(() => {
    const adminSession = sessionStorage.getItem('portfolio_is_admin');
    if (adminSession === 'true') {
      setIsAdmin(true);
    }
  }, []);

  // Listen for Ctrl + Shift + A
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        if (isAdmin) {
          setIsAdminPanelOpen(true);
        } else {
          setIsLoginOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdmin]);

  const showToast = (type, message) => {
    setToast({ type, message, id: Date.now() });
  };

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const reloadAllData = () => {
    setProfile(getProfileData());
    setProjects(getProjects());
    setResume(getResume());
    setTimeline(getTimeline());
  };

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    sessionStorage.setItem('portfolio_is_admin', 'true');
    setIsLoginOpen(false);
    setIsAdminPanelOpen(true);
    showToast('success', 'Successfully logged in as administrator!');
  };

  const handleLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('portfolio_is_admin');
    setIsAdminPanelOpen(false);
    showToast('info', 'Logged out of admin session.');
  };

  const handleOpenAdminToggle = () => {
    if (isAdmin) {
      setIsAdminPanelOpen(true);
    } else {
      setIsLoginOpen(true);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Dynamic Animated Blobs Background */}
      <div className="glow-bg">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      {/* Main Navigation */}
      <Navbar 
        isAdmin={isAdmin} 
        onOpenAdmin={handleOpenAdminToggle} 
        onLogout={handleLogout} 
      />

      {/* Portfolio Sections */}
      <main style={{ flexGrow: 1 }}>
        <Hero 
          profile={profile} 
          resume={resume} 
          onShowToast={showToast} 
        />
        <About profile={profile} timeline={timeline} />
        <Projects projects={projects} />
        <Contact profile={profile} onShowToast={showToast} />
      </main>

      {/* Footer Element */}
      <footer style={{ 
        borderTop: '1px solid var(--border-color)', 
        padding: '3rem 1.5rem', 
        textAlign: 'center', 
        background: 'rgba(10, 8, 16, 0.4)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        marginTop: '5rem'
      }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, letterSpacing: '-0.02em', background: 'var(--gradient-accent)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {profile.name.toUpperCase()}
            </span>
            {isAdmin && (
              <span className="badge" style={{ fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.08)', color: 'hsl(142, 71%, 60%)', borderColor: 'rgba(16, 185, 129, 0.15)' }}>
                ADMIN MODE ACTIVE
              </span>
            )}
          </div>

          <p 
            onDoubleClick={() => setIsLoginOpen(true)} 
            style={{ 
              color: 'var(--text-muted)', 
              fontSize: '0.85rem', 
              cursor: 'pointer',
              userSelect: 'none'
            }}
            title="Double-click to access administrative panel"
          >
            &copy; {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
          
          {isAdmin && (
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => setIsAdminPanelOpen(true)}
              style={{ fontSize: '0.75rem', gap: '0.35rem', padding: '0.35rem 0.75rem', marginTop: '0.5rem' }}
            >
              <Shield size={12} /> Open Admin Panel
            </button>
          )}
        </div>
      </footer>

      {/* Secret Login Modal */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />

      {/* Admin Dashboard Control Panel */}
      <AdminPanel 
        isOpen={isAdminPanelOpen} 
        onClose={() => setIsAdminPanelOpen(false)} 
        onDataChange={reloadAllData} 
        onShowToast={showToast} 
      />

      {/* Custom Toast Notifications Center */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.2 } }}
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              border: '1px solid',
              borderColor: toast.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : toast.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(6, 182, 212, 0.2)',
              background: toast.type === 'success' ? 'rgba(10, 20, 15, 0.9)' : toast.type === 'error' ? 'rgba(25, 10, 12, 0.9)' : 'rgba(10, 18, 24, 0.9)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
              color: '#fff',
              maxWidth: '380px'
            }}
          >
            {toast.type === 'success' ? (
              <CheckCircle size={20} style={{ color: 'var(--accent)', flexShrink: 0 }} />
            ) : toast.type === 'error' ? (
              <AlertCircle size={20} style={{ color: 'var(--danger)', flexShrink: 0 }} />
            ) : (
              <Info size={20} style={{ color: 'var(--secondary)', flexShrink: 0 }} />
            )}
            
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{toast.message}</span>
            
            <button 
              onClick={() => setToast(null)} 
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem', display: 'flex', marginLeft: 'auto' }}
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
