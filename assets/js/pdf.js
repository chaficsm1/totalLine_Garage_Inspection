/* ============================================================
   MULTILINE FIELDS → PDF
============================================================ */

export function prepareMultilineFieldsForPDF() {
  const pairs = [
    ['doorSpecs', 'doorSpecs_pdf'],
    ['openerSpecs', 'openerSpecs_pdf']
  ];

  pairs.forEach(([inputId, pdfId]) => {
    const input = document.getElementById(inputId);
    const pdf = document.getElementById(pdfId);

    if (input && pdf) {
      pdf.innerHTML = input.value.replace(/\n/g, '<br>');
    }
  });
}

/* ============================================================
   DEVICE ADAPTIVE SCALING
============================================================ */

export function getAdaptiveScale() {
  const dpr = window.devicePixelRatio || 1;

  if (dpr <= 2) return 1;
  if (dpr <= 3) return 1.5;
  return 2;
}

/* ============================================================
   PDF + EMAIL HELPERS
============================================================ */

export function pdfOptions(filename) {
  return {
    margin: 10,
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: getAdaptiveScale(),
      useCORS: true,
      scrollY: 0
    },
    jsPDF: { unit: 'pt', format: 'letter', orientation: 'portrait' },
    pagebreak: { mode: ['css'] }
  };
}

export function buildPdfName() {
  const phone = (document.getElementById('custPhone').value || '')
    .replace(/\D/g, '') || 'no-phone';

  const name = (document.getElementById('custName').value || 'no-name')
    .trim().replace(/\s+/g, '_');

  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();

  return `${phone}_${name}_${yyyy}${mm}${dd}_Inspection.pdf`;
}

export function openPrefilledEmail(pdfName, to) {
  const cc = 'a2zproservices@gmail.com';
  const subject = encodeURIComponent('Inspection Report');
  const body = encodeURIComponent(
    'Attached is your inspection report.\n\n'
  );

  window.location.href = `mailto:${to}?cc=${cc}&subject=${subject}&body=${body}`;

  const picker = document.getElementById('attachPicker');
  if (picker) setTimeout(() => picker.click(), 800);
}

/* ============================================================
   BEFORE / AFTER PDF
============================================================ */

export function beforePDF() {
  prepareMultilineFieldsForPDF();

  document.querySelectorAll('.pdf-field').forEach(el => {
    el.style.display = 'block';
  });

  document.querySelectorAll('.info-textarea').forEach(el => {
    el.style.display = 'none';
  });
}

export function afterPDF() {
  document.querySelectorAll('.pdf-field').forEach(el => {
    el.style.display = 'none';
  });

  document.querySelectorAll('.info-textarea').forEach(el => {
    el.style.display = 'block';
  });
}
