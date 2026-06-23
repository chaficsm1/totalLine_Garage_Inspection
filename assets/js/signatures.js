/* ============================================================
   SIGNATURES
============================================================ */

export function initSignaturePads() {
  ['sigTech', 'sigCust'].forEach(id => {
    const canvas = document.getElementById(id);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
      const ratio = window.devicePixelRatio || 1;

      const needScale =
        canvas.width !== canvas.offsetWidth * ratio ||
        canvas.height !== canvas.offsetHeight * ratio;

      if (!needScale) return;

      const old = ctx.getImageData(0, 0, canvas.width, canvas.height);

      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(ratio, ratio);

      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.imageSmoothingEnabled = false;

      ctx.putImageData(old, 0, 0);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let drawing = false;

    canvas.addEventListener('pointerdown', e => {
      drawing = true;
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
    });

    canvas.addEventListener('pointermove', e => {
      if (!drawing) return;
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
    });

    canvas.addEventListener('pointerup', () => { drawing = false; });
    canvas.addEventListener('pointerleave', () => { drawing = false; });
  });

  document.querySelectorAll('[data-clear]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-clear');
      const canvas = document.getElementById(id);
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  });
}
