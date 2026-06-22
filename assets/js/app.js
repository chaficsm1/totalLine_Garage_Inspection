
 function prepareMultilineFieldsForPDF() {
  const pairs = [
    ["doorSpecs", "doorSpecs_pdf"],
    ["openerSpecs", "openerSpecs_pdf"]
  ];

  pairs.forEach(([inputId, pdfId]) => {
    const input = document.getElementById(inputId);
    const pdf = document.getElementById(pdfId);

    if (input && pdf) {
      pdf.innerHTML = input.value.replace(/\n/g, "<br>");
    }
  });
}
 

 
/* ============================================================
   device adaptive scaling for memory
============================================================ */
function getAdaptiveScale() {
  const dpr = window.devicePixelRatio || 1;

  // Older iPads (A7–A10) → low memory → scale 1
  if (dpr <= 2) return 1;

  // Mid‑range devices → scale 1.5
  if (dpr <= 3) return 1.5;

  // Modern iPads (A14–A16) → scale 2
  return 2;
}

/* ============================================================
   STORAGE
============================================================ */

const STORAGE_KEY = "totalLine_inspection_v1";

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : { job:{}, statuses:{}, notes:{} };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

let appState = loadState();

/* ============================================================
   JOB INFO
============================================================ */

const jobFields = [
  "custName","custStreet","custCity","custZip",
  "custPhone","custEmail",
  "techName","techPhone","techEmail"
];

function loadJobInfo() {
  jobFields.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (appState.job[id] !== undefined) el.value = appState.job[id];
  });
}

function bindJobInfo() {
  jobFields.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", () => {
      appState.job[id] = el.value;
      saveState();
    });
  });
}

/* ============================================================
   12‑SECTION CONFIG
============================================================ */

const sectionsConfig = [
  { id:"doorPanels", title:"Door Panels & Appearance", items:[
    "Panel Condition","Dents / Damage","Rust / Corrosion","Window Inserts",
    "Insulation","Bottom Seal","Weatherstripping","General Appearance"
  ]},
  { id:"hardware", title:"Hardware & Fasteners", items:[
    "Hinges","Hinge Pins","Fasteners Tight","Brackets","Struts",
    // Removed: Top Fixtures, Bottom Fixtures
    "General Hardware Condition"
  ]},
  { id:"rollers", title:"Rollers", items:[
    "Roller Condition","Roller Bearings","Roller Shafts","Roller Wear",
    "Roller Noise","Roller Alignment","Lubrication","General Roller Condition"
  ]},
  { id:"tracks", title:"Tracks", items:[
    "Vertical Tracks","Horizontal Tracks","Track Alignment","Track Fasteners",
    "Track Wear","Track Cleanliness","Track Spacing","General Track Condition"
  ]},
  { id:"springs", title:"Springs", items:[
    "Torsion Springs","Extension Springs","Spring Anchor","Spring Cones",
    "Spring Tension","Center Bearing Plate","End Bearing Plates",
    "Shaft Condition","Drums","Cables","General Spring Condition"
  ]},
  { id:"cables", title:"Cables & Pulleys", items:[
    "Cable Condition","Cable Fraying","Cable Drum Wrap","Cable Tension",
    "Pulleys","Pulley Bearings","Pulley Alignment","General Cable Condition"
  ]},
  { id:"weather", title:"Weather Seals & Insulation", items:[
    "Bottom Seal","Side Seals","Top Seal","Panel Insulation",
    // Removed: Thermal Efficiency
    "Air Gaps","Seal Wear","General Weather Seal Condition"
  ]},
  { id:"safety", title:"Safety Features", items:[
    "Photo Eyes","Photo Eye Alignment","Photo Eye Wiring","Auto‑Reverse Test",
    "Force Setting","Emergency Release","Manual Operation",
    // Removed: Safety Labels, UL‑325 Compliance
    "General Safety Condition"
  ]},
  { id:"opener", title:"Opener Unit", items:[
    "Motor Unit","Rail Assembly","Trolley","Belt / Chain","Travel Limits",
    "Force Settings","Light Operation","Cover Condition",
    "General Opener Condition"
    // Removed: Noise Level
  ]},
  { id:"controls", title:"Controls & Connectivity", items:[
    "Wall Console","Remote Controls","Keypad","WiFi Connectivity",
    // Removed: App Control, Battery Backup stays, Wiring Condition removed, Signal Strength removed
    "Battery Backup",
    "General Control Condition","Programming"
  ]},
  { id:"power", title:"Power & Electrical", items:[
    "Power Cord","Outlet Condition","GFCI",
    // Removed: Voltage, Wiring, Conduit, Breaker, General Electrical Condition
  ]},
  { id:"operation", title:"Operational Test", items:[
    "Smooth Operation","Noise Level","Balance Test","Manual Lift",
    "Auto‑Reverse","Full Cycle Test","Open Speed","Close Speed",
    "General Operation"
  ]}
];

/* ============================================================
   BUILD SECTIONS
============================================================ */

function buildSections() {
  const container = document.getElementById("sectionsContainer");
  container.innerHTML = "";

  sectionsConfig.forEach(section => {
    const wrap = document.createElement("div");
    wrap.className = "section-wrapper";
    wrap.dataset.sectionId = section.id;

    const band = document.createElement("div");
    band.className = "section-band";

    const title = document.createElement("div");
    title.className = "section-band-title";
    title.textContent = section.title;

    const pill = document.createElement("div");
    pill.className = "section-status-pill";
    pill.textContent = "Not Started";

    band.appendChild(title);
    band.appendChild(pill);

    const sec = document.createElement("div");
    sec.className = "section";

    section.items.forEach((label, index) => {
      const row = document.createElement("div");
      row.className = "item-row-horizontal";
      row.dataset.sectionId = section.id;
      row.dataset.itemIndex = index;

      const left = document.createElement("div");
      left.className = "item-label";
      left.textContent = label;

      const mid = document.createElement("div");
      mid.className = "status-group";

      ["pass","fail","na"].forEach(type => {
        const opt = document.createElement("div");
        opt.className = "status-option";
        opt.dataset.status = type;

        const circle = document.createElement("div");
        circle.className = `status-circle ${type}`;
        circle.dataset.statusType = type;

        const inner = document.createElement("div");
        inner.className = "status-circle-inner";

        circle.appendChild(inner);
        opt.appendChild(circle);
        opt.append(type.toUpperCase());

        mid.appendChild(opt);
      });

      const right = document.createElement("div");
      right.className = "note-right";

      const note = document.createElement("textarea");
      note.className = "item-note";
      note.placeholder = "Notes...";

      right.appendChild(note);

      row.appendChild(left);
      row.appendChild(mid);
      row.appendChild(right);

      sec.appendChild(row);
    });

    wrap.appendChild(band);
    wrap.appendChild(sec);
// PAGE WRAPPER FOR PAGE BREAKS
const pageWrapper = document.createElement("div");
pageWrapper.className = "inspectionPage";
pageWrapper.appendChild(wrap);
container.appendChild(pageWrapper);
  });
}

/* ============================================================
Format cost field as currency
============================================================ */
document.addEventListener("blur", (e) => {
  if (e.target.classList.contains("rec-cost")) {
    let raw = e.target.value.replace(/[^0-9.]/g, "");

    if (raw === "") {
      e.target.value = "";
      return;
    }

    let num = parseFloat(raw);
    if (!isNaN(num)) {
      e.target.value = num.toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
      });
    }
  }
}, true);

/* ============================================================
   APPLY SAVED STATE
============================================================ */

function applySavedInspectionState() {
  Object.keys(appState.statuses).forEach(key => {
    const { sectionId, index } = JSON.parse(key);
    const row = document.querySelector(
      `.item-row-horizontal[data-section-id="${sectionId}"][data-item-index="${index}"]`
    );
    if (!row) return;

    const status = appState.statuses[key];
    const circle = row.querySelector(`.status-circle.${status}`);
    if (circle) circle.classList.add("selected");
  });

  Object.keys(appState.notes).forEach(key => {
    const { sectionId, index } = JSON.parse(key);
    const row = document.querySelector(
      `.item-row-horizontal[data-section-id="${sectionId}"][data-item-index="${index}"]`
    );
    if (!row) return;

    const note = row.querySelector(".item-note");
    if (note) note.value = appState.notes[key];
  });

  updateSectionPills();
}

/* ============================================================
   INSPECTION EVENTS
============================================================ */

function bindInspectionEvents() {
  document.querySelectorAll(".status-option").forEach(option => {
    option.addEventListener("click", () => {
      const row = option.closest(".item-row-horizontal");
      const sectionId = row.dataset.sectionId;
      const index = parseInt(row.dataset.itemIndex, 10);

      row.querySelectorAll(".status-circle").forEach(c => c.classList.remove("selected"));

      const circle = option.querySelector(".status-circle");
      circle.classList.add("selected");

      const key = JSON.stringify({ sectionId, index });
      appState.statuses[key] = circle.dataset.statusType;
      saveState();

      updateSectionPills();
    });
  });

  document.querySelectorAll(".item-note").forEach(note => {
    note.addEventListener("input", () => {
      const row = note.closest(".item-row-horizontal");
      const sectionId = row.dataset.sectionId;
      const index = parseInt(row.dataset.itemIndex, 10);
      const key = JSON.stringify({ sectionId, index });
      appState.notes[key] = note.value;
      saveState();
    });
  });
}

/* ============================================================
   SECTION PILL LOGIC
============================================================ */

function updateSectionPills() {
  sectionsConfig.forEach(section => {
    const wrap = document.querySelector(`.section-wrapper[data-section-id="${section.id}"]`);
    if (!wrap) return;

    const pill = wrap.querySelector(".section-status-pill");
    const rows = wrap.querySelectorAll(".item-row-horizontal");

    let anyFail = false;
    let anyPass = false;
    let anySet = false;

    rows.forEach(row => {
      const sel = row.querySelector(".status-circle.selected");
      if (!sel) return;

      anySet = true;
      const type = sel.dataset.statusType;

      if (type === "fail") anyFail = true;
      if (type === "pass") anyPass = true;
    });

    // Reset classes
    pill.classList.remove("pill-pass","pill-fail","pill-pending");

    if (!anySet) {
      pill.textContent = "PENDING";
      pill.classList.add("pill-pending");
    } else if (anyFail) {
      pill.textContent = "FAIL";
      pill.classList.add("pill-fail");
    } else if (anyPass) {
      pill.textContent = "PASS";
      pill.classList.add("pill-pass");
    } else {
      pill.textContent = "PENDING";
      pill.classList.add("pill-pending");
    }
  });
}

/* ============================================================
   RECOMMENDATIONS
============================================================ */

function bindExistingRecRemovers() {
  document.querySelectorAll(".rec-remove").forEach(btn => {
    btn.onclick = () => btn.parentElement.remove();
  });
}

/* ============================================================
   SIGNATURES
============================================================ */

function initSignaturePads() {
  ["sigTech", "sigCust"].forEach(id => {
    const canvas = document.getElementById(id);
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // DEVICE‑ADAPTIVE SCALING
function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;

  // Only scale if canvas is not already scaled
  const needScale =
    canvas.width !== canvas.offsetWidth * ratio ||
    canvas.height !== canvas.offsetHeight * ratio;

  if (!needScale) return;

  // Save existing drawing
  const old = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Resize canvas
  canvas.width = canvas.offsetWidth * ratio;
  canvas.height = canvas.offsetHeight * ratio;

  ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
  ctx.scale(ratio, ratio);

  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.imageSmoothingEnabled = false;

  // Restore drawing
  ctx.putImageData(old, 0, 0);
}

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // DRAWING LOGIC
    let drawing = false;

    canvas.addEventListener("pointerdown", e => {
      drawing = true;
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
    });

    canvas.addEventListener("pointermove", e => {
      if (!drawing) return;
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
    });

    canvas.addEventListener("pointerup", () => drawing = false);
    canvas.addEventListener("pointerleave", () => drawing = false);
  });

  // CLEAR BUTTONS
  document.querySelectorAll("[data-clear]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-clear");
      const canvas = document.getElementById(id);
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  });
}

function beforePDF() {
  prepareMultilineFieldsForPDF();

  document.querySelectorAll(".pdf-field").forEach(el => {
    el.style.display = "block";
  });

  document.querySelectorAll(".info-textarea").forEach(el => {
    el.style.display = "none";
  });
}

function afterPDF() {
  document.querySelectorAll(".pdf-field").forEach(el => {
    el.style.display = "none";
  });

  document.querySelectorAll(".info-textarea").forEach(el => {
    el.style.display = "block";
  });
}


/* ============================================================
   PDF + EMAIL
============================================================ */

function pdfOptions(filename) {
  return {
    margin: 10,
    filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { 
      scale: getAdaptiveScale(), 
      useCORS: true, 
      scrollY: 0 
    },
    jsPDF: { unit: "pt", format: "letter", orientation: "portrait" },
    pagebreak: { mode: ["css"] }
  };
}

function buildPdfName() {
  const phone = (document.getElementById("custPhone").value || "")
    .replace(/\D/g,"") || "no-phone";

  const name = (document.getElementById("custName").value || "no-name")
    .trim().replace(/\s+/g,"_");

  const d = new Date();
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const dd = String(d.getDate()).padStart(2,"0");
  const yyyy = d.getFullYear();

  return `${phone}_${name}_${yyyy}${mm}${dd}_Inspection.pdf`;
}

function openPrefilledEmail(pdfName, to) {
  const cc = "a2zproservices@gmail.com";
  const subject = encodeURIComponent("Inspection Report");
  const body = encodeURIComponent(
    "Attached is your inspection report.\n\n"
    
  );

  window.location.href = `mailto:${to}?cc=${cc}&subject=${subject}&body=${body}`;

  const picker = document.getElementById("attachPicker");
  if (picker) setTimeout(() => picker.click(), 800);
}

document.addEventListener("DOMContentLoaded", () => {

  // Build UI and bind logic only after DOM is ready
    console.log("A: buildSections");
  buildSections();
    console.log("B: loadJobInfo");
  loadJobInfo();
    console.log("C: bindJobInfo");
  bindJobInfo();
    console.log("D: applySavedInspectionState");
  applySavedInspectionState();
    console.log("E: bindInspectionEvents");
      // Auto-expand all info-textarea fields
  document.querySelectorAll(".info-textarea").forEach(area => {
    // Expand on load (for restored content)
    area.style.height = "auto";
    area.style.height = area.scrollHeight + "px";

    // Expand as user types
    area.addEventListener("input", () => {
      area.style.height = "auto";
      area.style.height = area.scrollHeight + "px";
    });
  });

  bindInspectionEvents();
    console.log("F: bindExistingRecRemovers");
  bindExistingRecRemovers();
    console.log("G: initSignaturePads");
  initSignaturePads();

    console.log("H: bind addRecBtn");
  const addRecBtn = document.getElementById("addRecBtn");
  if (addRecBtn) {
    addRecBtn.addEventListener("click", () => {
      const list = document.getElementById("recList");
      const row = document.createElement("div");
      row.className = "rec-row";
      row.innerHTML = `
        <textarea class="rec-text" placeholder="Recommendation details..."></textarea>
        <input class="rec-cost" placeholder="Cost" />
        <button class="rec-remove">×</button>
      `;
      list.appendChild(row);
      row.querySelector(".rec-remove").addEventListener("click", () => row.remove());
    });
  }

    console.log("I: bind pdfBtn");
  const pdfBtn = document.getElementById("pdfBtn");
if (pdfBtn) {
  pdfBtn.addEventListener("click", () => {
    const pdfName = buildPdfName();
    const el = document.getElementById("pdfCaptureArea");

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

    console.log("J: bind emailBtn");
  const emailBtn = document.getElementById("emailBtn");
  if (emailBtn) {
emailBtn.addEventListener("click", () => {
  const pdfName = buildPdfName();
  const to = document.getElementById("custEmail").value || "";
  const el = document.getElementById("pdfCaptureArea");

  beforePDF();

  html2pdf()
    .set(pdfOptions(pdfName))
    .from(el)
    .outputPdf("blob")
    .then((blob) => {
      afterPDF();

      const url = URL.createObjectURL(blob);

      // Create hidden iframe to force download without preview
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = url;

      document.body.appendChild(iframe);

      // Trigger download via iframe
      setTimeout(() => {
        const link = document.createElement("a");
        link.href = url;
        link.download = pdfName;
        link.click();

        // Clean up iframe
        setTimeout(() => {
          document.body.removeChild(iframe);
          URL.revokeObjectURL(url);
        }, 500);

        // Open email AFTER download
        setTimeout(() => openPrefilledEmail(pdfName, to), 600);
      }, 200);
    });
});
  }

    console.log("K: bind resetBtn");
  const resetBtn = document.getElementById("resetBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    });
  }
    console.log("DONE");
});
