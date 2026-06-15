import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Briefcase, FileText, Mail, Save, Plus, Trash2, Edit3, X, 
  Upload, CheckCircle, AlertCircle, RefreshCw, GraduationCap, AlertTriangle
} from 'lucide-react';
import { 
  getResume, saveResume, deleteResume, getInquiries, deleteInquiry, clearInquiries,
  getTimeline, saveTimeline
} from '../utils/storage';

// ─── Custom Inline Confirm Dialog ─────────────────────────────────────────────
function ConfirmDialog({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: 'rgba(4, 3, 8, 0.85)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, rgba(20, 15, 35, 0.98), rgba(10, 8, 18, 0.99))',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '420px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '10px', flexShrink: 0,
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <AlertTriangle size={20} style={{ color: 'hsl(350, 80%, 60%)' }} />
          </div>
          <div>
            <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Confirm Action</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>{message}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary btn-sm" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger btn-sm" onClick={onConfirm}>Delete</button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminPanel({ isOpen, onClose, onDataChange, onShowToast }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({
    name: '', title: '', bio: '', about: '', skills: [],
    email: '', phone: '', github: '', linkedin: '', twitter: '', location: ''
  });
  const [skillsString, setSkillsString] = useState('');
  // Custom extra social/portfolio links
  const [customLinks, setCustomLinks] = useState([]); // [{ id, label, url }]
  const [newLink, setNewLink] = useState({ label: '', url: '' });
  
  // Projects states
  const [projectsList, setProjectsList] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '', description: '', detailedDescription: '', 
    technologies: [], image: '', githubLink: '', demoLink: ''
  });
  const [projTechString, setProjTechString] = useState('');
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);

  // Resume states
  const [resumeData, setResumeData] = useState(null);

  // Inquiries state
  const [inquiriesList, setInquiriesList] = useState([]);

  // Timeline states
  const [timelineList, setTimelineList] = useState([]);
  const [isTimelineFormOpen, setIsTimelineFormOpen] = useState(false);
  const [editingTimelineItem, setEditingTimelineItem] = useState(null);
  const [timelineForm, setTimelineForm] = useState({
    type: 'work', title: '', organization: '', period: '', description: ''
  });

  // ConfirmDialog state
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, message: '', onConfirm: null });

  // Helper to show confirm
  const showConfirm = (message, onConfirm) => {
    setConfirmDialog({ isOpen: true, message, onConfirm });
  };
  const closeConfirm = () => {
    setConfirmDialog({ isOpen: false, message: '', onConfirm: null });
  };

  // Load all data on mount or when dashboard opens
  useEffect(() => {
    if (isOpen) {
      const prof = getProfileData();
      setProfileForm({
        name: prof.name || '',
        title: prof.title || '',
        bio: prof.bio || '',
        about: prof.about || '',
        skills: prof.skills || [],
        email: prof.contact?.email || '',
        phone: prof.contact?.phone || '',
        github: prof.contact?.github || '',
        linkedin: prof.contact?.linkedin || '',
        twitter: prof.contact?.twitter || '',
        location: prof.contact?.location || ''
      });
      setSkillsString(prof.skills?.join(', ') || '');
      setCustomLinks(prof.contact?.links || []);
      setProjectsList(getProjects());
      setResumeData(getResume());
      setInquiriesList(getInquiries());
      setTimelineList(getTimeline());
    }
  }, [isOpen]);

  // ── Profile Actions ────────────────────────────────────────────────────────
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const skillsArray = skillsString
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const updatedProfile = {
      name: profileForm.name,
      title: profileForm.title,
      bio: profileForm.bio,
      about: profileForm.about,
      skills: skillsArray,
      contact: {
        email: profileForm.email,
        phone: profileForm.phone,
        github: profileForm.github,
        linkedin: profileForm.linkedin,
        twitter: profileForm.twitter,
        location: profileForm.location,
        links: customLinks
      }
    };

    saveProfileData(updatedProfile);
    onDataChange();
    if (onShowToast) onShowToast('success', 'Profile information saved successfully!');
  };

  // ── Project Actions ────────────────────────────────────────────────────────
  const handleOpenAddProject = () => {
    setEditingProject(null);
    setProjectForm({
      title: '', description: '', detailedDescription: '',
      technologies: [], image: '', githubLink: '', demoLink: ''
    });
    setProjTechString('');
    setIsProjectFormOpen(true);
  };

  const handleOpenEditProject = (project) => {
    setEditingProject(project.id);
    setProjectForm({
      title: project.title || '',
      description: project.description || '',
      detailedDescription: project.detailedDescription || '',
      technologies: project.technologies || [],
      image: project.image || '',
      githubLink: project.githubLink || '',
      demoLink: project.demoLink || ''
    });
    setProjTechString(project.technologies?.join(', ') || '');
    setIsProjectFormOpen(true);
  };

  const handleProjectImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 800 * 1024) {
      if (onShowToast) onShowToast('error', 'Image size must be smaller than 800KB to fit local storage.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setProjectForm(prev => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleProjectSubmit = (e) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.description) {
      if (onShowToast) onShowToast('error', 'Title and short description are required.');
      return;
    }

    const techArray = projTechString
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const currentProjects = [...projectsList];

    if (editingProject) {
      const index = currentProjects.findIndex(p => p.id === editingProject);
      if (index !== -1) {
        currentProjects[index] = {
          ...currentProjects[index],
          title: projectForm.title,
          description: projectForm.description,
          detailedDescription: projectForm.detailedDescription,
          technologies: techArray,
          image: projectForm.image,
          githubLink: projectForm.githubLink,
          demoLink: projectForm.demoLink
        };
      }
    } else {
      const newProj = {
        id: Date.now().toString(),
        title: projectForm.title,
        description: projectForm.description,
        detailedDescription: projectForm.detailedDescription,
        technologies: techArray,
        image: projectForm.image,
        githubLink: projectForm.githubLink,
        demoLink: projectForm.demoLink
      };
      currentProjects.push(newProj);
    }

    saveProjects(currentProjects);
    setProjectsList(currentProjects);
    setIsProjectFormOpen(false);
    onDataChange();
    if (onShowToast) onShowToast('success', editingProject ? 'Project updated successfully!' : 'Project added successfully!');
  };

  const handleDeleteProject = (id, title) => {
    showConfirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`, () => {
      closeConfirm();
      const filtered = projectsList.filter(p => p.id !== id);
      saveProjects(filtered);
      setProjectsList(filtered);
      onDataChange();
      if (onShowToast) onShowToast('success', `"${title}" deleted successfully.`);
    });
  };

  // ── Resume Actions ─────────────────────────────────────────────────────────
  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      if (onShowToast) onShowToast('error', 'Only PDF files are supported for resume.');
      return;
    }
    if (file.size > 1.5 * 1024 * 1024) {
      if (onShowToast) onShowToast('error', 'Resume size must be under 1.5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const resumeObj = {
        name: file.name,
        size: file.size,
        type: file.type,
        base64String: reader.result
      };
      saveResume(resumeObj);
      setResumeData(resumeObj);
      onDataChange();
      if (onShowToast) onShowToast('success', 'Resume PDF uploaded successfully!');
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteResume = () => {
    showConfirm('Are you sure you want to remove the uploaded resume?', () => {
      closeConfirm();
      deleteResume();
      setResumeData(null);
      onDataChange();
      if (onShowToast) onShowToast('success', 'Resume removed successfully.');
    });
  };

  // ── Inquiry Actions ────────────────────────────────────────────────────────
  const handleDeleteInquiryItem = (id) => {
    showConfirm('Delete this inquiry record permanently?', () => {
      closeConfirm();
      deleteInquiry(id);
      setInquiriesList(prev => prev.filter(i => i.id !== id));
      if (onShowToast) onShowToast('success', 'Inquiry deleted.');
    });
  };

  const handleClearAllInquiries = () => {
    showConfirm('Delete all messages in the inbox? This cannot be undone.', () => {
      closeConfirm();
      clearInquiries();
      setInquiriesList([]);
      if (onShowToast) onShowToast('success', 'Inbox cleared.');
    });
  };

  // ── Timeline Actions ───────────────────────────────────────────────────────
  const handleOpenAddTimeline = () => {
    setEditingTimelineItem(null);
    setTimelineForm({ type: 'work', title: '', organization: '', period: '', description: '' });
    setIsTimelineFormOpen(true);
  };

  const handleOpenEditTimeline = (item) => {
    setEditingTimelineItem(item.id);
    setTimelineForm({
      type: item.type || 'work',
      title: item.title || '',
      organization: item.organization || '',
      period: item.period || '',
      description: item.description || ''
    });
    setIsTimelineFormOpen(true);
  };

  const handleTimelineSubmit = (e) => {
    e.preventDefault();
    if (!timelineForm.title || !timelineForm.organization || !timelineForm.period) {
      if (onShowToast) onShowToast('error', 'Title, Organization, and Period are required.');
      return;
    }

    const currentTimeline = [...timelineList];

    if (editingTimelineItem) {
      const index = currentTimeline.findIndex(item => item.id === editingTimelineItem);
      if (index !== -1) {
        currentTimeline[index] = {
          ...currentTimeline[index],
          type: timelineForm.type,
          title: timelineForm.title,
          organization: timelineForm.organization,
          period: timelineForm.period,
          description: timelineForm.description
        };
      }
    } else {
      const newItem = {
        id: Date.now().toString(),
        type: timelineForm.type,
        title: timelineForm.title,
        organization: timelineForm.organization,
        period: timelineForm.period,
        description: timelineForm.description
      };
      currentTimeline.push(newItem);
    }

    saveTimeline(currentTimeline);
    setTimelineList(currentTimeline);
    setIsTimelineFormOpen(false);
    onDataChange();
    if (onShowToast) onShowToast('success', editingTimelineItem ? 'Timeline event updated!' : 'Timeline event added!');
  };

  const handleDeleteTimelineItem = (id, title) => {
    showConfirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`, () => {
      closeConfirm();
      const filtered = timelineList.filter(item => item.id !== id);
      saveTimeline(filtered);
      setTimelineList(filtered);
      onDataChange();
      if (onShowToast) onShowToast('success', `"${title}" deleted from timeline.`);
    });
  };

  const handleResetStorage = () => {
    showConfirm("Are you sure you want to log out and reload?", () => {
      closeConfirm();
      sessionStorage.removeItem('portfolio_is_admin');
      window.location.reload();
    });
  };

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      {/* Custom Confirm Dialog rendered outside modal stack */}
      <AnimatePresence>
        {confirmDialog.isOpen && (
          <ConfirmDialog
            isOpen={confirmDialog.isOpen}
            message={confirmDialog.message}
            onConfirm={confirmDialog.onConfirm}
            onCancel={closeConfirm}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <div
            className="modal-overlay"
            onClick={onClose}
            style={{ alignItems: 'flex-start', overflowY: 'auto', padding: '2rem 1rem' }}
          >
            <motion.div 
              className="modal-content glass"
              style={{ 
                maxWidth: '900px', 
                width: '100%',
                background: 'linear-gradient(135deg, rgba(16, 12, 28, 0.98) 0%, rgba(8, 6, 12, 0.99) 100%)',
                textAlign: 'left',
                marginTop: '2rem',
                marginBottom: '2rem',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: 'none',
                animation: 'none'
              }}
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.8rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Admin Control Center
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    Configure your portfolio data, resume files, and projects.
                  </p>
                </div>
                <button className="modal-close" onClick={onClose} style={{ position: 'static' }}>
                  <X size={24} />
                </button>
              </div>

              {/* Dashboard Tabs */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => { setActiveTab('profile'); setIsProjectFormOpen(false); }} 
                  className={`btn btn-sm ${activeTab === 'profile' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  <User size={14} /> Profile Details
                </button>
                <button 
                  onClick={() => { setActiveTab('projects'); }} 
                  className={`btn btn-sm ${activeTab === 'projects' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  <Briefcase size={14} /> Manage Projects ({projectsList.length})
                </button>
                <button 
                  onClick={() => { setActiveTab('timeline'); setIsTimelineFormOpen(false); }} 
                  className={`btn btn-sm ${activeTab === 'timeline' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  <GraduationCap size={14} /> Manage Timeline ({timelineList.length})
                </button>
                <button 
                  onClick={() => { setActiveTab('resume'); setIsProjectFormOpen(false); }} 
                  className={`btn btn-sm ${activeTab === 'resume' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  <FileText size={14} /> Resume & Storage
                </button>
                <button 
                  onClick={() => { setActiveTab('inquiries'); setIsProjectFormOpen(false); }} 
                  className={`btn btn-sm ${activeTab === 'inquiries' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  <Mail size={14} /> Client Inquiries ({inquiriesList.length})
                </button>
              </div>

              {/* Tab Content */}
              <div style={{ minHeight: '350px' }}>

                {/* ── Profile Tab ── */}
                {activeTab === 'profile' && (
                  <form onSubmit={handleProfileSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="admin-profile-form">
                    <div style={{ gridColumn: 'span 2' }}>
                      <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem' }}>Developer Profile Information</h3>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Name</label>
                      <input 
                        type="text" className="form-input" required
                        value={profileForm.name} 
                        onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Professional Title</label>
                      <input 
                        type="text" className="form-input" required
                        value={profileForm.title} 
                        onChange={e => setProfileForm({ ...profileForm, title: e.target.value })}
                      />
                    </div>

                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">Hero Bio (Short description in hero section)</label>
                      <input 
                        type="text" className="form-input" required
                        value={profileForm.bio} 
                        onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                      />
                    </div>

                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">Detailed Biography (For About section)</label>
                      <textarea 
                        className="form-input" required
                        value={profileForm.about} 
                        onChange={e => setProfileForm({ ...profileForm, about: e.target.value })}
                        style={{ minHeight: '100px' }}
                      />
                    </div>

                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">Skills (Comma-separated)</label>
                      <input 
                        type="text" className="form-input" 
                        value={skillsString} 
                        onChange={e => setSkillsString(e.target.value)}
                        placeholder="e.g. React, Node.js, TypeScript, UI/UX"
                      />
                    </div>

                    <div style={{ gridColumn: 'span 2', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
                      <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem' }}>Contact Info & Social Handles</h3>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input 
                        type="email" className="form-input" 
                        value={profileForm.email} 
                        onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input 
                        type="text" className="form-input" 
                        value={profileForm.phone} 
                        onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Location (City, Country)</label>
                      <input 
                        type="text" className="form-input" 
                        value={profileForm.location} 
                        onChange={e => setProfileForm({ ...profileForm, location: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">GitHub URL</label>
                      <input 
                        type="url" className="form-input" 
                        value={profileForm.github} 
                        onChange={e => setProfileForm({ ...profileForm, github: e.target.value })}
                        placeholder="https://github.com/username"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">LinkedIn URL</label>
                      <input 
                        type="url" className="form-input" 
                        value={profileForm.linkedin} 
                        onChange={e => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Twitter URL</label>
                      <input 
                        type="url" className="form-input" 
                        value={profileForm.twitter} 
                        onChange={e => setProfileForm({ ...profileForm, twitter: e.target.value })}
                        placeholder="https://twitter.com/username"
                      />
                    </div>

                    {/* ── Custom Links Section ── */}
                    <div style={{ gridColumn: 'span 2', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ color: '#fff', fontSize: '1.1rem' }}>Custom Social &amp; Portfolio Links</h3>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{customLinks.length} link{customLinks.length !== 1 ? 's' : ''}</span>
                      </div>

                      {/* Existing links list */}
                      {customLinks.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
                          {customLinks.map((link) => (
                            <div key={link.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '0.6rem 1rem' }}>
                              <div style={{ flex: '0 0 120px' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-light)' }}>{link.label}</span>
                              </div>
                              <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ flex: 1, fontSize: '0.82rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: 'none' }} title={link.url}>
                                {link.url}
                              </a>
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                style={{ padding: '0.3rem', flexShrink: 0 }}
                                title="Remove link"
                                onClick={() => setCustomLinks(prev => prev.filter(l => l.id !== link.id))}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add new link row */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '0.6rem', alignItems: 'end' }}>
                        <div>
                          <label className="form-label" style={{ fontSize: '0.8rem' }}>Label</label>
                          <input
                            type="text"
                            className="form-input"
                            value={newLink.label}
                            onChange={e => setNewLink(prev => ({ ...prev, label: e.target.value }))}
                            placeholder="e.g. LeetCode"
                            style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem' }}
                          />
                        </div>
                        <div>
                          <label className="form-label" style={{ fontSize: '0.8rem' }}>URL</label>
                          <input
                            type="url"
                            className="form-input"
                            value={newLink.url}
                            onChange={e => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                            placeholder="https://leetcode.com/username"
                            style={{ padding: '0.6rem 0.8rem', fontSize: '0.88rem' }}
                          />
                        </div>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          style={{ alignSelf: 'flex-end', gap: '0.3rem', whiteSpace: 'nowrap' }}
                          onClick={() => {
                            if (!newLink.label.trim() || !newLink.url.trim()) {
                              if (onShowToast) onShowToast('error', 'Both label and URL are required.');
                              return;
                            }
                            setCustomLinks(prev => [...prev, { id: Date.now().toString(), label: newLink.label.trim(), url: newLink.url.trim() }]);
                            setNewLink({ label: '', url: '' });
                          }}
                        >
                          <Plus size={15} /> Add
                        </button>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        Click <strong style={{ color: 'var(--text-secondary)' }}>Save Profile Changes</strong> below to persist your links.
                      </p>
                    </div>

                    <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                      <button type="submit" className="btn btn-primary">
                        <Save size={16} /> Save Profile Changes
                      </button>
                    </div>

                  </form>
                )}

                {/* ── Projects Tab ── */}
                {activeTab === 'projects' && (
                  <div>
                    <AnimatePresence mode="wait">
                      {!isProjectFormOpen ? (
                        <motion.div 
                          key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ color: '#fff', fontSize: '1.2rem' }}>Registered Projects</h3>
                            <button className="btn btn-primary btn-sm" onClick={handleOpenAddProject}>
                              <Plus size={16} /> Add New Project
                            </button>
                          </div>

                          {projectsList.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.08)' }}>
                              <p style={{ color: 'var(--text-muted)' }}>No projects have been added yet.</p>
                              <button className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }} onClick={handleOpenAddProject}>
                                Add First Project
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                              {projectsList.map((project, idx) => (
                                <div key={project.id || idx} className="glass" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', gap: '1rem' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', overflow: 'hidden' }}>
                                    {project.image ? (
                                      <img src={project.image} alt={project.title} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
                                    ) : (
                                      <div style={{ width: '48px', height: '48px', borderRadius: '6px', background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, flexShrink: 0 }}>PROJ</div>
                                    )}
                                    <div style={{ overflow: 'hidden' }}>
                                      <h4 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{project.title}</h4>
                                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {project.description}
                                      </p>
                                    </div>
                                  </div>
                                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                                    <button className="btn btn-secondary btn-sm" style={{ padding: '0.4rem' }} onClick={() => handleOpenEditProject(project)} title="Edit">
                                      <Edit3 size={14} />
                                    </button>
                                    <button className="btn btn-danger btn-sm" style={{ padding: '0.4rem' }} onClick={() => handleDeleteProject(project.id, project.title)} title="Delete">
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      ) : (
                        <motion.form 
                          key="form" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }}
                          onSubmit={handleProjectSubmit}
                          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}
                        >
                          <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <h3 style={{ color: '#fff', fontSize: '1.2rem' }}>
                              {editingProject ? 'Edit Project' : 'Add New Project'}
                            </h3>
                            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsProjectFormOpen(false)}>
                              Cancel
                            </button>
                          </div>

                          <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label className="form-label">Project Title <span style={{ color: 'var(--danger)' }}>*</span></label>
                            <input 
                              type="text" className="form-input" required
                              value={projectForm.title} 
                              onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                              placeholder="My Awesome Project"
                            />
                          </div>

                          <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label className="form-label">Short Description <span style={{ color: 'var(--danger)' }}>*</span></label>
                            <input 
                              type="text" className="form-input" required
                              value={projectForm.description} 
                              onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                              placeholder="A brief overview shown on the project card..."
                            />
                          </div>

                          <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label className="form-label">Detailed Description (shown in modal)</label>
                            <textarea 
                              className="form-input"
                              value={projectForm.detailedDescription} 
                              onChange={e => setProjectForm({ ...projectForm, detailedDescription: e.target.value })}
                              placeholder="Describe what the project does, problems it solves, key features..."
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label">Live Demo URL</label>
                            <input 
                              type="url" className="form-input" 
                              value={projectForm.demoLink} 
                              onChange={e => setProjectForm({ ...projectForm, demoLink: e.target.value })}
                              placeholder="https://myproject.com"
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label">GitHub URL</label>
                            <input 
                              type="url" className="form-input" 
                              value={projectForm.githubLink} 
                              onChange={e => setProjectForm({ ...projectForm, githubLink: e.target.value })}
                              placeholder="https://github.com/user/repo"
                            />
                          </div>

                          <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label className="form-label">Technologies (Comma-separated)</label>
                            <input 
                              type="text" className="form-input" 
                              value={projTechString} 
                              onChange={e => setProjTechString(e.target.value)}
                              placeholder="e.g. React, Node.js, MongoDB"
                            />
                          </div>

                          <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label className="form-label">Thumbnail Image (max 800KB)</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                              <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                                <Upload size={14} /> Select Image
                                <input 
                                  type="file" accept="image/*" onChange={handleProjectImageUpload} 
                                  style={{ display: 'none' }} 
                                />
                              </label>
                              {projectForm.image ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                                  <img src={projectForm.image} alt="Preview" style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px' }} />
                                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Thumbnail Loaded</span>
                                  <button type="button" className="modal-close" style={{ position: 'static', padding: '0.25rem' }} onClick={() => setProjectForm({ ...projectForm, image: '' })}>
                                    <X size={14} />
                                  </button>
                                </div>
                              ) : (
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No image — a gradient will be displayed</span>
                              )}
                            </div>
                          </div>

                          <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
                            <button type="submit" className="btn btn-primary">
                              <Save size={16} /> {editingProject ? 'Save Changes' : 'Add Project'}
                            </button>
                          </div>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* ── Resume Tab ── */}
                {activeTab === 'resume' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', background: 'rgba(255,255,255,0.01)' }}>
                      <h3 style={{ color: '#fff', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileText size={18} style={{ color: 'var(--primary-light)' }} /> Resume PDF Upload
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Upload a PDF copy of your CV. It will be stored permanently and visitors can download it from the hero section.
                      </p>

                      {resumeData ? (
                        <div style={{ 
                          background: 'rgba(16, 185, 129, 0.05)', 
                          border: '1px solid rgba(16, 185, 129, 0.15)',
                          borderRadius: '10px', padding: '1.25rem',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <CheckCircle size={28} style={{ color: 'var(--accent)' }} />
                            <div>
                              <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>{resumeData.name}</div>
                              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.15rem' }}>
                                File Size: {formatBytes(resumeData.size)}
                              </div>
                            </div>
                          </div>
                          <button className="btn btn-danger btn-sm" onClick={handleDeleteResume}>
                            <Trash2 size={14} /> Remove CV
                          </button>
                        </div>
                      ) : (
                        <div style={{ 
                          border: '2px dashed rgba(255,255,255,0.08)', borderRadius: '10px',
                          padding: '2.5rem 1rem', textAlign: 'center',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
                          background: 'rgba(255,255,255,0.005)'
                        }}>
                          <Upload size={32} style={{ color: 'var(--text-muted)' }} />
                          <div>
                            <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                              Choose PDF Document
                              <input 
                                type="file" accept="application/pdf" onChange={handleResumeUpload}
                                style={{ display: 'none' }}
                              />
                            </label>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                              Limit: 1.5MB · PDF only
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Logout panel */}
                    <div className="glass" style={{ padding: '2rem', background: 'rgba(255,255,255,0.01)' }}>
                      <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <RefreshCw size={18} style={{ color: 'var(--accent)' }} /> Logout
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                        Log out of the admin panel.
                      </p>
                      <button 
                        type="button" className="btn btn-secondary"
                        onClick={handleResetStorage}
                      >
                        Logout & Reload
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Inquiries Tab ── */}
                {activeTab === 'inquiries' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ color: '#fff', fontSize: '1.2rem' }}>Submitted Form Messages</h3>
                      {inquiriesList.length > 0 && (
                        <button className="btn btn-secondary btn-sm" onClick={handleClearAllInquiries}>
                          Clear Inbox
                        </button>
                      )}
                    </div>

                    {inquiriesList.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.08)' }}>
                        <p style={{ color: 'var(--text-muted)' }}>Your inbox is empty. Messages from the contact form appear here.</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '450px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                        {inquiriesList.map((item, index) => (
                          <div key={item.id || index} className="glass" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'rgba(255,255,255,0.015)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                              <div>
                                <div style={{ color: '#fff', fontWeight: 600, fontSize: '1.05rem' }}>{item.name}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--primary-light)', marginTop: '0.15rem' }}>{item.email}</div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  {new Date(item.date).toLocaleString()}
                                </span>
                                <button 
                                  className="btn btn-danger btn-sm" 
                                  style={{ padding: '0.35rem', borderRadius: '6px' }}
                                  onClick={() => handleDeleteInquiryItem(item.id)}
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                            {item.subject && (
                              <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>
                                <span style={{ color: 'var(--text-muted)' }}>Subject:</span> {item.subject}
                              </div>
                            )}
                            <p style={{ 
                              fontSize: '0.9rem', color: 'var(--text-secondary)', 
                              background: 'rgba(0,0,0,0.2)', padding: '0.75rem', 
                              borderRadius: '6px', whiteSpace: 'pre-wrap',
                              border: '1px solid rgba(255,255,255,0.03)'
                            }}>
                              {item.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── Timeline Tab ── */}
                {activeTab === 'timeline' && (
                  <div>
                    <AnimatePresence mode="wait">
                      {!isTimelineFormOpen ? (
                        <motion.div 
                          key="t-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ color: '#fff', fontSize: '1.2rem' }}>Professional Timeline Events</h3>
                            <button className="btn btn-primary btn-sm" onClick={handleOpenAddTimeline}>
                              <Plus size={16} /> Add Timeline Item
                            </button>
                          </div>

                          {timelineList.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.08)' }}>
                              <p style={{ color: 'var(--text-muted)' }}>No timeline events have been added yet.</p>
                              <button className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }} onClick={handleOpenAddTimeline}>
                                Add First Event
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                              {timelineList.map((item, idx) => (
                                <div key={item.id || idx} className="glass" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', gap: '1rem' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '6px', background: item.type === 'work' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.type === 'work' ? 'var(--primary-light)' : 'var(--secondary)', flexShrink: 0 }}>
                                      {item.type === 'work' ? <Briefcase size={20} /> : <GraduationCap size={20} />}
                                    </div>
                                    <div>
                                      <h4 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 600 }}>{item.title}</h4>
                                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                        {item.organization} &bull; <span style={{ color: 'var(--text-muted)' }}>{item.period}</span>
                                      </p>
                                    </div>
                                  </div>
                                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                                    <button className="btn btn-secondary btn-sm" style={{ padding: '0.4rem' }} onClick={() => handleOpenEditTimeline(item)} title="Edit">
                                      <Edit3 size={14} />
                                    </button>
                                    <button className="btn btn-danger btn-sm" style={{ padding: '0.4rem' }} onClick={() => handleDeleteTimelineItem(item.id, item.title)} title="Delete">
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      ) : (
                        <motion.form 
                          key="t-form" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }}
                          onSubmit={handleTimelineSubmit}
                          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}
                        >
                          <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <h3 style={{ color: '#fff', fontSize: '1.2rem' }}>
                              {editingTimelineItem ? 'Edit Timeline Event' : 'Add Timeline Event'}
                            </h3>
                            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsTimelineFormOpen(false)}>
                              Cancel
                            </button>
                          </div>

                          <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label className="form-label">Event Type <span style={{ color: 'var(--danger)' }}>*</span></label>
                            <select 
                              className="form-input" required
                              value={timelineForm.type} 
                              onChange={e => setTimelineForm({ ...timelineForm, type: e.target.value })}
                              style={{ background: '#13111c' }}
                            >
                              <option value="work">Work / Professional Experience</option>
                              <option value="education">Education / Academic History</option>
                            </select>
                          </div>

                          <div className="form-group">
                            <label className="form-label">Title / Role <span style={{ color: 'var(--danger)' }}>*</span></label>
                            <input 
                              type="text" className="form-input" required
                              value={timelineForm.title} 
                              onChange={e => setTimelineForm({ ...timelineForm, title: e.target.value })}
                              placeholder="e.g. Senior Software Engineer"
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label">Organization / Institution <span style={{ color: 'var(--danger)' }}>*</span></label>
                            <input 
                              type="text" className="form-input" required
                              value={timelineForm.organization} 
                              onChange={e => setTimelineForm({ ...timelineForm, organization: e.target.value })}
                              placeholder="e.g. TechVibe Solutions"
                            />
                          </div>

                          <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label className="form-label">Time Period <span style={{ color: 'var(--danger)' }}>*</span></label>
                            <input 
                              type="text" className="form-input" required
                              value={timelineForm.period} 
                              onChange={e => setTimelineForm({ ...timelineForm, period: e.target.value })}
                              placeholder="e.g. 2023 - Present or 2017 - 2021"
                            />
                          </div>

                          <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label className="form-label">Description / Achievements</label>
                            <textarea 
                              className="form-input"
                              value={timelineForm.description} 
                              onChange={e => setTimelineForm({ ...timelineForm, description: e.target.value })}
                              placeholder="Describe your responsibilities, key projects, and accomplishments..."
                            />
                          </div>

                          <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
                            <button type="submit" className="btn btn-primary">
                              <Save size={16} /> {editingTimelineItem ? 'Save Changes' : 'Add Event'}
                            </button>
                          </div>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .admin-profile-form {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
