import { updateSectionPills } from './ui.js';

/* ============================================================
   STORAGE
============================================================ */

export const STORAGE_KEY = 'totalLine_inspection_v1';

export function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : { job: {}, statuses: {}, notes: {} };
}

export let appState = loadState();

export function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

/* ============================================================
   JOB INFO
============================================================ */

const jobFields = [
  'custName', 'custStreet', 'custCity', 'custZip',
  'custPhone', 'custEmail',
  'techName', 'techPhone', 'techEmail'
];

export function loadJobInfo() {
  jobFields.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (appState.job[id] !== undefined) el.value = appState.job[id];
  });
}

export function bindJobInfo() {
  jobFields.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
      appState.job[id] = el.value;
      saveState();
    });
  });
}

/* ============================================================
   APPLY SAVED STATE
============================================================ */

export function applySavedInspectionState() {
  Object.keys(appState.statuses).forEach(key => {
    const { sectionId, index } = JSON.parse(key);
    const row = document.querySelector(
      `.item-row-horizontal[data-section-id="${sectionId}"][data-item-index="${index}"]`
    );
    if (!row) return;

    const status = appState.statuses[key];
    const circle = row.querySelector(`.status-circle.${status}`);
    if (circle) circle.classList.add('selected');
  });

  Object.keys(appState.notes).forEach(key => {
    const { sectionId, index } = JSON.parse(key);
    const row = document.querySelector(
      `.item-row-horizontal[data-section-id="${sectionId}"][data-item-index="${index}"]`
    );
    if (!row) return;

    const note = row.querySelector('.item-note');
    if (note) note.value = appState.notes[key];
  });

  updateSectionPills();
}
