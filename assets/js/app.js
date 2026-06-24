import { loadJobInfo, bindJobInfo, applySavedInspectionState } from './state.js';
import { buildSections, initAutoExpandTextareas } from './ui.js';
import { initSignaturePads } from './signatures.js';
import { bindAllEvents } from './events.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('A: buildSections');
  buildSections();

  document.getElementById("headerDate").textContent =
  new Date().toLocaleDateString("en-US");

  console.log('B: loadJobInfo');
  loadJobInfo();

  console.log('C: bindJobInfo');
  bindJobInfo();

  console.log('D: applySavedInspectionState');
  applySavedInspectionState();

  console.log('E: initAutoExpandTextareas');
  initAutoExpandTextareas();

  console.log('F: bindAllEvents');
  bindAllEvents();

  console.log('G: initSignaturePads');
  initSignaturePads();

  console.log('DONE');
});
