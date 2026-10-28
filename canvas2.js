/**
 * canvas2.js - 사례 2: x^2 + (4-x)^2 최솟값과 상수화 오류 인터랙티브 그래프
 */

(function () {
  let canvas, ctx;
  let currentX = 2.0; // Initial optimal vertex

  // World coordinates bounds
  const xMin = -1.2;
  const xMax = 5.2;
  const yMin = -2;
  const yMax = 26;

  // Margin for axes and labels
  const margin = { top: 35, right: 35, bottom: 45, left: 55 };

  function init() {
    canvas = document.getElementById('canvas-case2');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    setupDPI();
    bindEvents();
    updateReadouts(currentX);
    render();
  }

  function setupDPI() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }

  function worldToCanvas(x, y) {
    const rect = canvas.getBoundingClientRect();
    const w = rect.width - margin.left - margin.right;
    const h = rect.height - margin.top - margin.bottom;

    const cx = margin.left + ((x - xMin) / (xMax - xMin)) * w;
    const cy = margin.top + ((yMax - y) / (yMax - yMin)) * h;
    return { x: cx, y: cy };
  }

  function f(x) {
    return Math.pow(x, 2) + Math.pow(4 - x, 2); // 2x^2 - 8x + 16
  }

  function g(x) {
    return 2 * Math.abs(x * (4 - x));
  }

  function render() {
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);

    // Draw Grid & Axes
    drawGrid();

    // Draw Shaded Invalid Positivity Regions (x < 0 or x > 4)
    drawInvalidRegions();

    // Draw Constant Minimum Line: y = 8 (Green)
    drawHorizontalLine(8, '#10b981', '실제 최솟값 상수선: y = 8 (고정된 바닥)');

    // Draw g(x) curve: 2|x(4-x)| (Amber/Orange)
    drawGCurve();

    // Draw f(x) curve: x^2 + (4-x)^2 (Blue neon)
    drawFCurve();

    // Draw Current Exploration Vertical Line & Points
    drawProbe(currentX);
  }

  function drawGrid() {
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillStyle = '#64748b';
    ctx.font = '11px "Fira Code", monospace';

    // Vertical grid lines (x-axis)
    for (let x = -1; x <= 5; x += 1) {
      const p1 = worldToCanvas(x, yMin);
      const p2 = worldToCanvas(x, yMax);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      ctx.fillText(x.toString(), p1.x - 4, p1.y + 18);
    }

    // Horizontal grid lines (y-axis)
    for (let y = 0; y <= 24; y += 4) {
      const p1 = worldToCanvas(xMin, y);
      const p2 = worldToCanvas(xMax, y);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      ctx.fillText(y.toString(), p1.x - 28, p1.y + 4);
    }

    // Main Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1.5;

    // x-axis
    const ox1 = worldToCanvas(xMin, 0);
    const ox2 = worldToCanvas(xMax, 0);
    ctx.beginPath();
    ctx.moveTo(ox1.x, ox1.y);
    ctx.lineTo(ox2.x, ox2.y);
    ctx.stroke();

    // y-axis
    const oy1 = worldToCanvas(0, yMin);
    const oy2 = worldToCanvas(0, yMax);
    ctx.beginPath();
    ctx.moveTo(oy1.x, oy1.y);
    ctx.lineTo(oy2.x, oy2.y);
    ctx.stroke();

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '600 13px Inter, sans-serif';
    ctx.fillText('x', ox2.x - 20, ox2.y + 25);
    ctx.fillText('y', oy2.x - 30, oy2.y - 12);
  }

  function drawInvalidRegions() {
    ctx.save();
    ctx.fillStyle = 'rgba(244, 63, 94, 0.07)';

    // Region x < 0
    const p1 = worldToCanvas(xMin, yMax);
    const p2 = worldToCanvas(0, yMin);
    ctx.fillRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);

    // Region x > 4
    const q1 = worldToCanvas(4, yMax);
    const q2 = worldToCanvas(xMax, yMin);
    ctx.fillRect(q1.x, q1.y, q2.x - q1.x, q2.y - q1.y);

    // Label for invalid region
    ctx.fillStyle = 'rgba(244, 63, 94, 0.6)';
    ctx.font = '600 10px Inter, sans-serif';
    ctx.fillText('양수 조건 위배 (x < 0)', p1.x + 8, p1.y + 20);
    ctx.fillText('양수 조건 위배 (4-x < 0)', q1.x + 8, q1.y + 20);
    ctx.restore();
  }

  function drawHorizontalLine(yVal, color, labelText) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);

    const p1 = worldToCanvas(xMin, yVal);
    const p2 = worldToCanvas(xMax, yVal);

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();

    if (labelText) {
      ctx.fillStyle = color;
      ctx.font = '600 11px Inter, sans-serif';
      ctx.fillText(labelText, p1.x + 15, p1.y - 8);
    }
    ctx.restore();
  }

  function drawFCurve() {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(59, 130, 246, 0.5)';
    ctx.shadowBlur = 8;

    let started = false;
    for (let x = xMin; x <= xMax; x += 0.05) {
      const y = f(x);
      if (y > yMax + 2) continue;
      const pt = worldToCanvas(x, y);
      if (!started) {
        ctx.moveTo(pt.x, pt.y);
        started = true;
      } else {
        ctx.lineTo(pt.x, pt.y);
      }
    }
    ctx.stroke();

    // Label
    const lblPt = worldToCanvas(3.8, f(3.8));
    ctx.fillStyle = '#60a5fa';
    ctx.font = '700 12px Inter, sans-serif';
    ctx.fillText('y = f(x)', lblPt.x + 8, lblPt.y);
    ctx.restore();
  }

  function drawGCurve() {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;

    let started = false;
    for (let x = xMin; x <= xMax; x += 0.05) {
      const y = g(x);
      if (y > yMax + 2) continue;
      const pt = worldToCanvas(x, y);
      if (!started) {
        ctx.moveTo(pt.x, pt.y);
        started = true;
      } else {
        ctx.lineTo(pt.x, pt.y);
      }
    }
    ctx.stroke();

    // Label
    const lblPt = worldToCanvas(0.8, g(0.8));
    ctx.fillStyle = '#fbbf24';
    ctx.font = '700 12px Inter, sans-serif';
    ctx.fillText('y = g(x) = 2|x(4-x)| (변수식)', lblPt.x - 30, lblPt.y - 12);
    ctx.restore();
  }

  function drawProbe(x) {
    const yF = f(x);
    const yG = g(x);

    const ptF = worldToCanvas(x, yF);
    const ptG = worldToCanvas(x, yG);
    const ptAxis = worldToCanvas(x, 0);

    ctx.save();

    // Vertical dashed probe line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(ptAxis.x, ptAxis.y);
    ctx.lineTo(ptF.x, ptF.y);
    ctx.stroke();

    // Distance indicator between f(x) and g(x)
    if (Math.abs(yF - yG) > 0.3) {
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(ptG.x, ptG.y);
      ctx.lineTo(ptF.x, ptF.y);
      ctx.stroke();

      // Midpoint tag
      const midY = (ptF.y + ptG.y) / 2;
      ctx.fillStyle = '#f472b6';
      ctx.font = '600 11px "Fira Code", monospace';
      ctx.fillText(`격차: ${(yF - yG).toFixed(1)}`, ptF.x + 8, midY + 4);
    }

    // Point Q on g(x)
    ctx.beginPath();
    ctx.arc(ptG.x, ptG.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Point P on f(x)
    ctx.beginPath();
    ctx.arc(ptF.x, ptF.y, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#3b82f6';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Tooltip Labels
    ctx.font = '700 11px Inter, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.85)';
    ctx.shadowBlur = 4;

    ctx.fillText(`P(${x.toFixed(2)}, ${yF.toFixed(2)})`, ptF.x - 30, ptF.y - 12);
    ctx.fillText(`Q(${x.toFixed(2)}, ${yG.toFixed(2)})`, ptG.x - 30, ptG.y + 20);

    ctx.restore();
  }

  function updateReadouts(x) {
    const valF = f(x);
    const valG = g(x);
    const diff = valF - valG;

    const valX = document.getElementById('c2-val-x');
    const outF = document.getElementById('c2-out-f');
    const outG = document.getElementById('c2-out-g');
    const outDiff = document.getElementById('c2-out-diff');
    const statusMsg = document.getElementById('c2-status-msg');

    if (valX) valX.innerText = x.toFixed(2);
    if (outF) outF.innerText = valF.toFixed(2);
    if (outG) outG.innerText = valG.toFixed(2);
    if (outDiff) outDiff.innerText = diff.toFixed(2);

    if (statusMsg) {
      if (x < 0 || x > 4) {
        statusMsg.className = 'status-msg-box warning';
        statusMsg.innerHTML = `<strong>⚠️ 양수 조건 파괴 구간 (x = ${x.toFixed(2)}):</strong><br>x 또는 (4-x) 중 하나가 음수이므로 산술·기하평균의 전제 조건($A>0, B>0$) 자체가 무너집니다!`;
      } else if (Math.abs(x - 2.0) < 0.05) {
        statusMsg.className = 'status-msg-box optimal';
        statusMsg.innerHTML = `<strong>🎯 접점 달성 (x = 2.00):</strong><br>f(2) = 8, g(2) = 8 로 두 곡선이 접합니다. 그러나 우변 g(x)는 상수가 아니라 이 점이 최고점인 포물선이므로 일반적인 최솟값 근거가 될 수 없습니다!`;
      } else {
        statusMsg.className = 'status-msg-box suboptimal';
        statusMsg.innerHTML = `현재 x = <strong>${x.toFixed(2)}</strong> 에서 원래 함수값은 <strong>${valF.toFixed(2)}</strong> 인 반면, 우변식은 <strong>${valG.toFixed(2)}</strong> 로 크게 요동치고 있습니다.`;
      }
    }
  }

  function bindEvents() {
    const slider = document.getElementById('c2-slider-x');
    if (slider) {
      slider.addEventListener('input', (e) => {
        currentX = parseFloat(e.target.value);
        updateReadouts(currentX);
        render();
      });
    }

    const btnX2 = document.getElementById('c2-btn-x2');
    if (btnX2) {
      btnX2.addEventListener('click', () => {
        currentX = 2.0;
        if (slider) slider.value = currentX;
        updateReadouts(currentX);
        render();
      });
    }

    const btnX1 = document.getElementById('c2-btn-x1');
    if (btnX1) {
      btnX1.addEventListener('click', () => {
        currentX = 1.0;
        if (slider) slider.value = currentX;
        updateReadouts(currentX);
        render();
      });
    }

    window.addEventListener('resize', () => {
      setupDPI();
      render();
    });
  }

  window.case2Simulator = {
    init,
    render,
    setX: (val) => {
      currentX = val;
      updateReadouts(val);
      render();
    }
  };
})();
