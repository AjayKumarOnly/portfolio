import defaultData from '../data/portfolio.json';

export const KEYS = {
  PROFILE:   'portfolio_profile_data',
  PROJECTS:  'portfolio_projects_data',
  RESUME:    'portfolio_resume_data',
  INQUIRIES: 'portfolio_inquiries_data',
  TIMELINE:  'portfolio_timeline_data',
};

// ─── Sync to Disk ──────────────────────────────────────────────────────────────
// Writes the entire portfolio state to src/data/portfolio.json via the Vite
// dev-server middleware. This makes admin changes permanent across browsers.
export const syncToDisk = async () => {
  const payload = {
    profile: getProfileData(),
    projects: getProjects(),
    timeline: getTimeline(),
    resume: getResume()
  };
  try {
    const res = await fetch('/api/save-portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (!result.success) {
      console.warn('Disk sync returned failure:', result.error);
    }
    return result;
  } catch (err) {
    console.warn('Could not sync to disk (expected if not on dev server):', err.message);
    return { success: false, error: err.message };
  }
};

// ─── Profile ───────────────────────────────────────────────────────────────────
export const getProfileData = () => {
  const data = localStorage.getItem(KEYS.PROFILE);
  if (!data) {
    return defaultData.profile;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Error parsing profile data', e);
    return defaultData.profile;
  }
};

export const saveProfileData = (data) => {
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(data));
  syncToDisk();
};

// ─── Projects ──────────────────────────────────────────────────────────────────
export const getProjects = () => {
  const data = localStorage.getItem(KEYS.PROJECTS);
  if (!data) {
    return defaultData.projects;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Error parsing projects data', e);
    return defaultData.projects;
  }
};

export const saveProjects = (projects) => {
  localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
  syncToDisk();
};

// ─── Resume ────────────────────────────────────────────────────────────────────
export const getResume = () => {
  const data = localStorage.getItem(KEYS.RESUME);
  if (!data) return defaultData.resume;
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Error parsing resume data', e);
    return defaultData.resume;
  }
};

export const saveResume = (resumeObj) => {
  localStorage.setItem(KEYS.RESUME, JSON.stringify(resumeObj));
  syncToDisk();
};

export const deleteResume = () => {
  localStorage.removeItem(KEYS.RESUME);
  syncToDisk();
};

// ─── Inquiries (localStorage only — not synced to disk) ────────────────────────
export const getInquiries = () => {
  const data = localStorage.getItem(KEYS.INQUIRIES);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Error parsing inquiries data', e);
    return [];
  }
};

export const saveInquiry = (inquiry) => {
  const inquiries = getInquiries();
  const newInquiry = {
    ...inquiry,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  };
  localStorage.setItem(KEYS.INQUIRIES, JSON.stringify([newInquiry, ...inquiries]));
};

export const deleteInquiry = (id) => {
  const inquiries = getInquiries();
  const filtered = inquiries.filter(item => item.id !== id);
  localStorage.setItem(KEYS.INQUIRIES, JSON.stringify(filtered));
};

export const clearInquiries = () => {
  localStorage.setItem(KEYS.INQUIRIES, JSON.stringify([]));
};

// ─── Timeline ──────────────────────────────────────────────────────────────────
export const getTimeline = () => {
  const data = localStorage.getItem(KEYS.TIMELINE);
  if (!data) {
    return defaultData.timeline;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Error parsing timeline data', e);
    return defaultData.timeline;
  }
};

export const saveTimeline = (timeline) => {
  localStorage.setItem(KEYS.TIMELINE, JSON.stringify(timeline));
  syncToDisk();
};
