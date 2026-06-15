import defaultData from '../data/portfolio.json';

// Ensure inquiries exist in default data
if (!defaultData.inquiries) {
  defaultData.inquiries = [];
}

// ─── Sync to Disk ──────────────────────────────────────────────────────────────
// Writes the entire portfolio state to src/data/portfolio.json via the Vite
// dev-server middleware. This makes admin changes permanent.
export const syncToDisk = async () => {
  const payload = {
    profile: getProfileData(),
    projects: getProjects(),
    timeline: getTimeline(),
    resume: getResume(),
    inquiries: getInquiries()
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
  return defaultData.profile;
};

export const saveProfileData = (data) => {
  defaultData.profile = data;
  syncToDisk();
};

// ─── Projects ──────────────────────────────────────────────────────────────────
export const getProjects = () => {
  return defaultData.projects;
};

export const saveProjects = (projects) => {
  defaultData.projects = projects;
  syncToDisk();
};

// ─── Resume ────────────────────────────────────────────────────────────────────
export const getResume = () => {
  return defaultData.resume;
};

export const saveResume = (resumeObj) => {
  defaultData.resume = resumeObj;
  syncToDisk();
};

export const deleteResume = () => {
  defaultData.resume = null;
  syncToDisk();
};

// ─── Inquiries ─────────────────────────────────────────────────────────────────
export const getInquiries = () => {
  return defaultData.inquiries;
};

export const saveInquiry = (inquiry) => {
  const newInquiry = {
    ...inquiry,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  };
  defaultData.inquiries = [newInquiry, ...defaultData.inquiries];
  syncToDisk();
};

export const deleteInquiry = (id) => {
  defaultData.inquiries = defaultData.inquiries.filter(item => item.id !== id);
  syncToDisk();
};

export const clearInquiries = () => {
  defaultData.inquiries = [];
  syncToDisk();
};

// ─── Timeline ──────────────────────────────────────────────────────────────────
export const getTimeline = () => {
  return defaultData.timeline;
};

export const saveTimeline = (timeline) => {
  defaultData.timeline = timeline;
  syncToDisk();
};
