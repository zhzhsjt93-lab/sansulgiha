/**
 * canvas1.js - 사례 1: 8/a + 2/b = 1 일 때 a+b 최솟값 인터랙티브 시뮬레이션
 */

(function () {
  let canvas, ctx;
  let currentA = 12.0; // Initial optimal value

  // World coordinates bounds
  const xMin = 0;
  const xMax = 32;
  const yMin = 0;
  const yMax = 22;

  // Margin for axes and labels
  const margin = { top: 35, right: 35, bottom: 45, left: 55 };

  function init() {
    canvas = document.getElementById('canvas-case1');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    setupDPI();
    bindEvents();
    updateReadouts(currentA);
    render();
  }

  function setupDPI() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    // Set internal size scaled by DPR
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }

  // Coordinate transformations
  function worldToCanvas(x, y) {
    const rect = canvas.getBoundingClientRect();
    const w = rect.width - margin.left - margin.right;
    const h = rect.height - margin.top - margin.bottom;

    const cx = margin.left + ((x - xMin) / (xMax - xMin)) * w;
    const cy = margin.top + ((yMax - y) / (yMax - yMin)) * h;
    return { x: cx, y: cy };
  }

  function canvasToWorld(cx, cy) {
    const rect = canvas.getBoundingClientRect();
    const w = rect.width - margin.left - margin.right;
    const h = rect.height - margin.top - margin.bottom;

    const x = xMin + ((cx - margin.left) / w) * (xMax - xMin);
    const y = yMax - ((cy - margin.top) / h) * (yMax - yMin);
    return { x, y };
  }

  function calcB(a) {
    if (a <= 8.001) return 1000;
    return (2 * a) / (a - 8);
  }

  function render() {
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Clear background
    ctx.clearRect(0, 0, width, height);

    // Draw Grid & Axes
    drawGrid(width, height);

    // Draw Asymptotes (a = 8, b = 2)
    drawAsymptotes();

    // Draw the Erroneous Line: a + b = 16 (Red dashed)
    drawLineSum(16, 'rgba(244, 63, 94, 0.75)', true, '오답 하한선: a + b = 16 (만나지 않음!)');

    // Draw the Optimal Tangent Line: a + b = 18 (Green solid)
    drawLineSum(18, 'rgba(16, 185, 129, 0.85)', false, '최소 접선: a + b = 18');

    // Draw Current Exploration Line: a + b = currentSum
    const currentB = calcB(currentA);
    const currentSum = currentA + currentB;
    if (currentSum !== 18) {
      drawLineSum(currentSum, 'rgba(59, 130, 246, 0.7)', false, `현재 탐색선: a + b = ${currentSum.toFixed(2)}`);
    }

    // Draw the Constraint Curve: 8/a + 2/b = 1 => b = 2a / (a - 8)
    drawConstraintCurve();

    // Draw Optimal Point (12, 6)
    drawPoint(12, 6, '#10b981', '최적점 (12, 6), a+b=18', 6);

    // Draw Current Point (currentA, currentB)
    drawPoint(currentA, currentB, '#06b6d4', `현재 점 (${currentA.toFixed(1)}, ${currentB.toFixed(1)})`, 7, true);
  }

  function drawGrid(w, h) {
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillStyle = '#64748b';
    ctx.font = '11px "Fira Code", monospace';

    // Vertical grid lines (a-axis)
    for (let x = 4; x <= xMax; x += 4) {
      const p1 = worldToCanvas(x, yMin);
      const p2 = worldToCanvas(x, yMax);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      // Label
      ctx.fillText(x.toString(), p1.x - 6, p1.y + 18);
    }

    // Horizontal grid lines (b-axis)
    for (let y = 2; y <= yMax; y += 4) {
      const p1 = worldToCanvas(xMin, y);
      const p2 = worldToCanvas(xMax, y);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      // Label
      ctx.fillText(y.toString(), p1.x - 28, p1.y + 4);
    }

    // Main Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1.5;

    // x-axis (a-axis)
    const ox1 = worldToCanvas(xMin, yMin);
    const ox2 = worldToCanvas(xMax, yMin);
    ctx.beginPath();
    ctx.moveTo(ox1.x, ox1.y);
    ctx.lineTo(ox2.x, ox2.y);
    ctx.stroke();

    // y-axis (b-axis)
    const oy1 = worldToCanvas(xMin, yMin);
    const oy2 = worldToCanvas(xMin, yMax);
    ctx.beginPath();
    ctx.moveTo(oy1.x, oy1.y);
    ctx.lineTo(oy2.x, oy2.y);
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '600 13px Inter, sans-serif';
    ctx.fillText('a (양수)', ox2.x - 45, ox2.y + 35);
    ctx.fillText('b (양수)', oy2.x - 45, oy2.y - 12);
  }

  function drawAsymptotes() {
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.lineWidth = 1.2;

    // Vertical asymptote a = 8
    const p1 = worldToCanvas(8, yMin);
    const p2 = worldToCanvas(8, yMax);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();

    // Horizontal asymptote b = 2
    const q1 = worldToCanvas(xMin, 2);
    const q2 = worldToCanvas(xMax, 2);
    ctx.beginPath();
    ctx.moveTo(q1.x, q1.y);
    ctx.lineTo(q2.x, q2.y);
    ctx.stroke();

    ctx.fillStyle = 'rgba(245, 158, 11, 0.7)';
    ctx.font = '10px "Fira Code", monospace';
    ctx.fillText('점근선 a=8', p2.x + 5, p2.y + 15);
    ctx.fillText('점근선 b=2', q2.x - 70, q2.y - 6);
    ctx.restore();
  }

  function drawConstraintCurve() {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(6, 182, 212, 0.6)';
    ctx.shadowBlur = 10;

    let started = false;
    for (let a = 8.15; a <= xMax; a += 0.1) {
      const b = calcB(a);
      if (b > yMax + 5) continue;
      const pt = worldToCanvas(a, b);
      if (!started) {
        ctx.moveTo(pt.x, pt.y);
        started = true;
      } else {
        ctx.lineTo(pt.x, pt.y);
      }
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawLineSum(k, color, isDashed, labelText) {
    // Line: a + b = k => b = k - a
    ctx.save();
    if (isDashed) {
      ctx.setLineDash([5, 4]);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = isDashed ? 1.8 : 2;

    const aStart = Math.max(xMin, k - yMax);
    const aEnd = Math.min(xMax, k - yMin);

    if (aStart < aEnd) {
      const p1 = worldToCanvas(aStart, k - aStart);
      const p2 = worldToCanvas(aEnd, k - aEnd);

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      if (labelText) {
        ctx.fillStyle = color;
        ctx.font = '600 11px Inter, sans-serif';
        // Position label near the upper part
        const labelPos = worldToCanvas(aStart + 2, k - (aStart + 2));
        ctx.fillText(labelText, labelPos.x + 8, labelPos.y - 6);
      }
    }
    ctx.restore();
  }

  function drawPoint(x, y, color, label, radius = 6, withHalo = false) {
    if (x < xMin || x > xMax || y < yMin || y > yMax) return;
    const pt = worldToCanvas(x, y);

    ctx.save();
    if (withHalo) {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, radius + 6, 0, Math.PI * 2);
      ctx.fillStyle = color.replace(')', ', 0.25)').replace('rgb', 'rgba');
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    if (label) {
      ctx.font = '700 11px Inter, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(label, pt.x + radius + 6, pt.y - radius - 2);
    }
    ctx.restore();
  }

  function updateReadouts(a) {
    const b = calcB(a);
    const sum = a + b;

    const valA = document.getElementById('c1-val-a');
    const outA = document.getElementById('c1-out-a');
    const outB = document.getElementById('c1-out-b');
    const outSum = document.getElementById('c1-out-sum');
    const statusMsg = document.getElementById('c1-status-msg');

    if (valA) valA.innerText = a.toFixed(1);
    if (outA) outA.innerText = a.toFixed(2);
    if (outB) outB.innerText = b.toFixed(2);
    if (outSum) outSum.innerText = sum.toFixed(2);

    if (statusMsg) {
      const diffFromMin = Math.abs(sum - 18.0);
      if (diffFromMin < 0.05) {
        statusMsg.className = 'status-msg-box optimal';
        statusMsg.innerHTML = `<strong>✨ 완벽한 최적점 달성!</strong><br>a = 12, b = 6 일 때 a + b = <strong>18</strong>로 최솟값에 도달합니다! 등호 조건(a = 2b)이 성립합니다.`;
      } else if (Math.abs(a - b) < 0.3) {
        statusMsg.className = 'status-msg-box warning';
        statusMsg.innerHTML = `<strong>⚠️ 오류 풀이의 가정 (a = b) 근처입니다:</strong><br>a ≈ b ≈ 10 일 때 a + b = <strong>${sum.toFixed(2)}</strong> 입니다. 오답 풀이에서 주장한 16보다 훨씬 큽니다!`;
      } else {
        statusMsg.className = 'status-msg-box suboptimal';
        statusMsg.innerHTML = `현재 a + b = <strong>${sum.toFixed(2)}</strong> 입니다. 최소 접점 (12, 6)을 향해 슬라이더를 조절해보세요.`;
      }
    }
  }

  function bindEvents() {
    const slider = document.getElementById('c1-slider-a');
    if (slider) {
      slider.addEventListener('input', (e) => {
        currentA = parseFloat(e.target.value);
        updateReadouts(currentA);
        render();
      });
    }

    const btnMin = document.getElementById('c1-set-min');
    if (btnMin) {
      btnMin.addEventListener('click', () => {
        currentA = 12.0;
        if (slider) slider.value = currentA;
        updateReadouts(currentA);
        render();
      });
    }

    const btnWrong = document.getElementById('c1-set-wrong');
    if (btnWrong) {
      btnWrong.addEventListener('click', () => {
        currentA = 10.0; // Where 8/10 + 2/10 = 1 => a = b = 10
        if (slider) slider.value = currentA;
        updateReadouts(currentA);
        render();
      });
    }

    window.addEventListener('resize', () => {
      setupDPI();
      render();
    });
  }

  window.case1Simulator = {
    init,
    render,
    setA: (val) => {
      currentA = val;
      updateReadouts(val);
      render();
    }
  };
})();
