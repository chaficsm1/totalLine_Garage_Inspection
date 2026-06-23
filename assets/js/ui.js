/* ============================================================
   12‑SECTION CONFIG
============================================================ */

export const sectionsConfig = [
  { id: 'doorPanels', title: 'Door Panels & Appearance', items: [
    'Panel Condition','Dents / Damage','Rust / Corrosion','Window Inserts',
    'Insulation','Bottom Seal','Weatherstripping','General Appearance'
  ]},
  { id: 'hardware', title: 'Hardware & Fasteners', items: [
    'Hinges','Hinge Pins','Fasteners Tight','Brackets','Struts',
    'General Hardware Condition'
  ]},
  { id: 'rollers', title: 'Rollers', items: [
    'Roller Condition','Roller Bearings','Roller Shafts','Roller Wear',
    'Roller Noise','Roller Alignment','Lubrication','General Roller Condition'
  ]},
  { id: 'tracks', title: 'Tracks', items: [
    'Vertical Tracks','Horizontal Tracks','Track Alignment','Track Fasteners',
    'Track Wear','Track Cleanliness','Track Spacing','General Track Condition'
  ]},
  { id: 'springs', title: 'Springs', items: [
    'Torsion Springs','Extension Springs','Spring Anchor','Spring Cones',
    'Spring Tension','Center Bearing Plate','End Bearing Plates',
    'Shaft Condition','Drums','Cables','General Spring Condition'
  ]},
  { id: 'cables', title: 'Cables & Pulleys', items: [
    'Cable Condition','Cable Fraying','Cable Drum Wrap','Cable Tension',
    'Pulleys','Pulley Bearings','Pulley Alignment','General Cable Condition'
  ]},
  { id: 'weather', title: 'Weather Seals & Insulation', items: [
    'Bottom Seal','Side Seals','Top Seal','Panel Insulation',
    'Air Gaps','Seal Wear','General Weather Seal Condition'
  ]},
  { id: 'safety', title: 'Safety Features', items: [
    'Photo Eyes','Photo Eye Alignment','Photo Eye Wiring','Auto‑Reverse Test',
    'Force Setting','Emergency Release','Manual Operation',
    'General Safety Condition'
  ]},
  { id: 'opener', title: 'Opener Unit', items: [
    'Motor Unit','Rail Assembly','Trolley','Belt / Chain','Travel Limits',
    'Force Settings','Light Operation','Cover Condition',
    'General Opener Condition'
  ]},
  { id: 'controls', title: 'Controls & Connectivity', items: [
    'Wall Console','Remote Controls','Keypad','WiFi Connectivity',
    'Battery Backup',
    'General Control Condition','Programming'
  ]},
  { id: 'power', title: 'Power & Electrical', items: [
    'Power Cord','Outlet Condition','GFCI'
  ]},
  { id: 'operation', title: 'Operational Test', items: [
    'Smooth Operation','Noise Level','Balance Test','Manual Lift',
    'Auto‑Reverse','Full Cycle Test','Open Speed','Close Speed',
    'General Operation'
  ]}
];

/* ============================================================
   BUILD SECTIONS
============================================================ */

export function buildSections() {
  const container = document.getElementById('sectionsContainer');
  if (!container) return;

  container.innerHTML = '';

  sectionsConfig.forEach(section => {
    const wrap = document.createElement('div');
    wrap.className = 'section-wrapper';
    wrap.dataset.sectionId = section.id;

    const band = document.createElement('div');
    band.className = 'section-band';

    const title = document.createElement('div');
    title.className = 'section-band-title';
    title.textContent = section.title;

    const pill = document.createElement('div');
    pill.className = 'section-status-pill';
    pill.textContent = 'Not Started';

    band.appendChild(title);
    band.appendChild(pill);

    const sec = document.createElement('div');
    sec.className = 'section';

    section.items.forEach((label, index) => {
      const row = document.createElement('div');
      row.className = 'item-row-horizontal';
      row.dataset.sectionId = section.id;
      row.dataset.itemIndex = index;

      const left = document.createElement('div');
      left.className = 'item-label';
      left.textContent = label;

      const mid = document.createElement('div');
      mid.className = 'status-group';

      ['pass', 'fail', 'na'].forEach(type => {
        const opt = document.createElement('div');
        opt.className = 'status-option';
        opt.dataset.status = type;

        const circle = document.createElement('div');
        circle.className = `status-circle ${type}`;
        circle.dataset.statusType = type;

        const inner = document.createElement('div');
        inner.className = 'status-circle-inner';

        circle.appendChild(inner);
        opt.appendChild(circle);
        opt.append(type.toUpperCase());

        mid.appendChild(opt);
      });

      const right = document.createElement('div');
      right.className = 'note-right';

      const note = document.createElement('textarea');
      note.className = 'item-note';
      note.placeholder = 'Notes...';

      right.appendChild(note);

      row.appendChild(left);
      row.appendChild(mid);
      row.appendChild(right);

      sec.appendChild(row);
    });

    wrap.appendChild(band);
    wrap.appendChild(sec);

    const pageWrapper = document.createElement('div');
    pageWrapper.className = 'inspectionPage';
    pageWrapper.appendChild(wrap);
    container.appendChild(pageWrapper);
  });
}

/* ============================================================
   SECTION PILL LOGIC
============================================================ */

export function updateSectionPills() {
  sectionsConfig.forEach(section => {
    const wrap = document.querySelector(`.section-wrapper[data-section-id="${section.id}"]`);
    if (!wrap) return;

    const pill = wrap.querySelector('.section-status-pill');
    const rows = wrap.querySelectorAll('.item-row-horizontal');

    let anyFail = false;
    let anyPass = false;
    let anySet = false;

    rows.forEach(row => {
      const sel = row.querySelector('.status-circle.selected');
      if (!sel) return;

      anySet = true;
      const type = sel.dataset.statusType;

      if (type === 'fail') anyFail = true;
      if (type === 'pass') anyPass = true;
    });

    pill.classList.remove('pill-pass', 'pill-fail', 'pill-pending');

    if (!anySet) {
      pill.textContent = 'PENDING';
      pill.classList.add('pill-pending');
    } else if (anyFail) {
      pill.textContent = 'FAIL';
      pill.classList.add('pill-fail');
    } else if (anyPass) {
      pill.textContent = 'PASS';
      pill.classList.add('pill-pass');
    } else {
      pill.textContent = 'PENDING';
      pill.classList.add('pill-pending');
    }
  });
}

/* ============================================================
   AUTO‑EXPAND TEXTAREAS (UI BEHAVIOR)
============================================================ */

export function initAutoExpandTextareas() {
  document.querySelectorAll('.info-textarea').forEach(area => {
    area.style.height = 'auto';
    area.style.height = area.scrollHeight + 'px';

    area.addEventListener('input', () => {
      area.style.height = 'auto';
      area.style.height = area.scrollHeight + 'px';
    });
  });
}
