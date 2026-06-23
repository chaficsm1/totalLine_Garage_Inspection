import { appState, saveState, STORAGE_KEY } from './state.js';
import { updateSectionPills } from './ui.js';
import { pdfOptions, buildPdfName, beforePDF, afterPDF, openPrefilledEmail } from './pdf.js';

/* ============================================================
   INSPECTION EVENTS
============================================================ */

export function bindInspectionEvents() {
  document.querySelectorAll('.status-option').forEach(option => {
    option.addEventListener('click', () => {
      const row = option.closest('.item-row-horizontal');
      if (!row) return;

      const sectionId = row.dataset.sectionId;
      const index = parseInt(row.dataset.itemIndex, 10);

      row.querySelectorAll('.status-circle').forEach(c => c.classList.remove('selected'));

      const circle = option.querySelector('.status-circle');
      if (!circle) return;

      circle.classList.add('selected');

      const key = JSON.stringify({ sectionId, index });
      appState.statuses[key] = circle.dataset.statusType;
      saveState();

      updateSectionPills();
    });
  });

  document.querySelectorAll('.item-note').forEach(note => {
    note.addEventListener('input', () => {
      const row = note.closest('.item-row-horizontal');
      if (!row) return;

      const sectionId = row.dataset.sectionId;
      const index = parseInt(row.dataset.itemIndex, 10);
      const key = JSON.stringify({ sectionId, index });

      appState.notes[key] = note.value;
      saveState();
    });
  });
}

/* ============================================================
   RECOMMENDATIONS
============================================================ */

export function bindExistingRecRemovers() {
  document.querySelectorAll('.rec-remove').forEach(btn => {
    btn.onclick = () => btn.parentElement.remove();
  });
}

function bindAddRecommendationButton() {
  const addRecBtn = document.getElementById('addRecBtn');
  if (!addRecBtn) return;

  addRecBtn.addEventListener('click', () => {
    const list = document.getElementById('recList');
    if (!list) return;

    const row = document.createElement('div');
    row.className = 'rec-row';
    row.innerHTML = `
      <textarea class="rec-text" placeholder="Recommendation details..."></textarea>
      <input class="rec-cost" placeholder="Cost" />
      <button class="rec-remove">×</button>
    `;
    list.appendChild(row);
    row.querySelector('.rec-remove').addEventListener('click', () => row.remove());
  });
}

/* ============================================================
   CURRENCY FORMAT (EVENTS)
============================================================ */

function bindCurrencyFormatting() {
  document.addEventListener('blur', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (!target.classList.contains('rec-cost')) return;

    let raw = target.value.replace(/[^0-9.]/g, '');

    if (raw === '') {
      target.value = '';
      return;
    }

    const num = parseFloat(raw);
    if (!isNaN(num)) {
      target.value = num.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      });
    }
  }, true);
}

/* ============================================================
   PDF + EMAIL EVENTS
============================================================ */

function bindPdfButton() {
  const pdfBtn = document.getElementById('pdfBtn');
  if (!pdfBtn) return;

  pdfBtn.addEventListener('click', () => {
    const pdfName = buildPdfName();
    const el = document.getElementById('pdfCaptureArea');
    if (!el) return;

    beforePDF();

    html2pdf()
      .set(pdfOptions(pdfName))
      .from(el)
      .save()
      .then(() => {
        afterPDF();
      });
  });
}

function bindEmailButton() {
  const emailBtn = document.getElementById('emailBtn');
  if (!emailBtn) return;

  emailBtn.addEventListener('click', () => {
    const pdfName = buildPdfName();
    const to = document.getElementById('custEmail').value || '';
    const el = document.getElementById('pdfCaptureArea');
    if (!el) return;

    beforePDF();

    html2pdf()
      .set(pdfOptions(pdfName))
      .from(el)
      .outputPdf('blob')
      .then((blob) => {
        afterPDF();

        const url = URL.createObjectURL(blob);

        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = url;

        document.body.appendChild(iframe);

        setTimeout(() => {
          const link = document.createElement('a');
          link.href = url;
          link.download = pdfName;
          link.click();

          setTimeout(() => {
            document.body.removeChild(iframe);
            URL.revokeObjectURL(url);
          }, 500);

          setTimeout(() => openPrefilledEmail(pdfName, to), 600);
        }, 200);
      });
  });
}

/* ============================================================
   RESET
============================================================ */

function bindResetButton() {
  const resetBtn = document.getElementById('resetBtn');
  if (!resetBtn) return;

  resetBtn.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  });
}

/* ============================================================
   MASTER BINDER
============================================================ */

export function bindAllEvents() {
  bindInspectionEvents();
  bindExistingRecRemovers();
  bindAddRecommendationButton();
  bindCurrencyFormatting();
  bindPdfButton();
  bindEmailButton();
  bindResetButton();
}
