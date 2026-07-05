// ============================================
// THERMAL/AI — canvas signature + simulated feed
// ============================================

(function () {
  const canvas = document.getElementById('thermalCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const tempTag = document.getElementById('tempTag');

  // thermal color ramp: black -> purple -> red -> orange -> amber -> white
  function thermalColor(t) {
    // t in [0,1]
    const stops = [
      [0.00, [5, 5, 10]],
      [0.20, [40, 10, 70]],
      [0.42, [150, 20, 60]],
      [0.60, [230, 60, 20]],
      [0.78, [255, 140, 0]],
      [0.92, [255, 210, 90]],
      [1.00, [255, 250, 230]]
    ];
    for (let i = 0; i < stops.length - 1; i++) {
      const [p0, c0] = stops[i];
      const [p1, c1] = stops[i + 1];
      if (t >= p0 && t <= p1) {
        const f = (t - p0) / (p1 - p0);
        return [
          Math.round(c0[0] + (c1[0] - c0[0]) * f),
          Math.round(c0[1] + (c1[1] - c0[1]) * f),
          Math.round(c0[2] + (c1[2] - c0[2]) * f)
        ];
      }
    }
    return [255, 250, 230];
  }

  const cols = 48, rows = 48;
  const cellW = W / cols, cellH = H / rows;
  let t = 0;

  // simple pseudo-noise field via layered sines (deterministic, cheap)
  function noise(x, y, time) {
    return (
      Math.sin(x * 0.18 + time * 0.6) * 0.5 +
      Math.cos(y * 0.22 - time * 0.4) * 0.5 +
      Math.sin((x + y) * 0.1 + time) * 0.3
    );
  }

  // a warm "figure" blob near center that pulses
  function figureHeat(x, y, time) {
    const cx = cols / 2 + Math.sin(time * 0.3) * 3;
    const cy = rows / 2 + Math.cos(time * 0.25) * 2;
    const d = Math.hypot(x - cx, y - cy);
    const pulse = 1 + Math.sin(time * 1.4) * 0.08;
    const radius = 9 * pulse;
    return Math.max(0, 1 - d / radius);
  }

  let scanY = 0;

  function draw() {
    t += 0.02;
    scanY = (scanY + 1.2) % H;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const base = 0.18 + noise(x, y, t) * 0.06;
        const heat = figureHeat(x, y, t) * 0.85;
        let v = Math.min(1, Math.max(0, base + heat));
        const [r, g, b] = thermalColor(v);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x * cellW, y * cellH, cellW + 0.5, cellH + 0.5);
      }
    }

    // scan line sweep
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fillRect(0, scanY, W, 2);

    // center readout temp text
    const centerVal = figureHeat(cols / 2, rows / 2, t);
    const displayTemp = (36.4 + centerVal * 1.1).toFixed(1);
    if (tempTag) tempTag.textContent = displayTemp + '°C';

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
})();

// ============================================
// Simulated detector log feed
// ============================================
(function () {
  const feedBody = document.getElementById('feedBody');
  if (!feedBody) return;

  const templates = [
    { lvl: 'info', text: 'Frame captured — ZONE_01 — 640x480 @ 30fps' },
    { lvl: 'info', text: 'Calibration OK — ambient baseline 22.4°C' },
    { lvl: 'info', text: 'Segmentation complete — 1 region above threshold' },
    { lvl: 'warn', text: 'Region R2 rising — 38.9°C, trending +0.4°C/s' },
    { lvl: 'info', text: 'Classifier: region → HUMAN (conf 0.94)' },
    { lvl: 'info', text: 'Classifier: region → AMBIENT (conf 0.99)' },
    { lvl: 'warn', text: 'Region R4 exceeds soft threshold — monitoring' },
    { lvl: 'alert', text: 'ALERT — ZONE_04 — anomaly confirmed 61.2°C — webhook fired' },
    { lvl: 'info', text: 'Alert cleared — ZONE_04 returned to baseline' },
    { lvl: 'info', text: 'Heartbeat OK — model latency 84ms' }
  ];

  function ts() {
    const d = new Date();
    return d.toTimeString().slice(0, 8);
  }

  function addLine() {
    const tpl = templates[Math.floor(Math.random() * templates.length)];
    const line = document.createElement('div');
    line.className = 'feed-line';
    line.innerHTML =
      '<span class="ts">' + ts() + '</span>' +
      '<span class="lvl-' + tpl.lvl + '">[' + tpl.lvl.toUpperCase() + ']</span>' +
      '<span>' + tpl.text + '</span>';
    feedBody.appendChild(line);
    feedBody.scrollTop = feedBody.scrollHeight;

    while (feedBody.children.length > 40) {
      feedBody.removeChild(feedBody.firstChild);
    }
  }

  // seed a few lines immediately
  for (let i = 0; i < 5; i++) addLine();
  setInterval(addLine, 1600);
})();
