/**
 * app.js - 메인 애플리케이션 로직 (탭 전환, KaTeX 수식 렌더링, 테마 토글, 퀴즈 시스템)
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTabs();
  initMathRendering();
  initQuiz();

  // Initialize Simulators after DOM is ready
  setTimeout(() => {
    if (window.case1Simulator) window.case1Simulator.init();
    if (window.case2Simulator) window.case2Simulator.init();
  }, 100);
});

/* ==========================================================================
   1. Theme Management (Dark / Light)
   ========================================================================== */
function initTheme() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  const icon = toggleBtn ? toggleBtn.querySelector('.theme-icon') : null;

  // Check saved theme or default to dark
  const savedTheme = localStorage.getItem('amgm_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme, icon);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('amgm_theme', next);
      updateThemeIcon(next, icon);

      // Re-render canvas for theme changes if needed
      if (window.case1Simulator) window.case1Simulator.render();
      if (window.case2Simulator) window.case2Simulator.render();
    });
  }
}

function updateThemeIcon(theme, iconEl) {
  if (!iconEl) return;
  iconEl.innerText = theme === 'dark' ? '🌙' : '☀️';
}

/* ==========================================================================
   2. Tab Navigation
   ========================================================================== */
function initTabs() {
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-tab');
      switchTab(targetId);
    });
  });
}

window.switchTab = function (targetId) {
  // Update Tab Buttons
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach((tab) => {
    const isActive = tab.getAttribute('data-tab') === targetId;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  // Update Tab Panes
  const panes = document.querySelectorAll('.tab-pane');
  panes.forEach((pane) => {
    const isActive = pane.id === targetId;
    pane.classList.toggle('active', isActive);
  });

  // Re-render canvas when switching to interactive tabs
  if (targetId === 'tab-case1' && window.case1Simulator) {
    setTimeout(() => {
      window.case1Simulator.init();
    }, 50);
  } else if (targetId === 'tab-case2' && window.case2Simulator) {
    setTimeout(() => {
      window.case2Simulator.init();
    }, 50);
  }

  // Trigger math rendering in case any new element appeared
  triggerMathRender();

  // Scroll smoothly to top of content
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

/* ==========================================================================
   3. KaTeX Math Auto-Rendering
   ========================================================================== */
function initMathRendering() {
  triggerMathRender();
}

function triggerMathRender() {
  if (typeof renderMathInElement === 'function') {
    renderMathInElement(document.body, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false }
      ],
      throwOnError: false
    });
  }
}

/* ==========================================================================
   4. Self-Diagnosis Quiz System
   ========================================================================== */
const quizData = [
  {
    id: 1,
    question: "두 양수 $x, y$에 대하여 $(x+y)\\left(\\frac{1}{x} + \\frac{4}{y}\\right)$의 최솟값을 구할 때, 각 괄호에 산술기하평균을 따로 적용하여 $2\\sqrt{xy} \\times \\frac{4}{\\sqrt{xy}} = 8$로 구했습니다. 이 풀이의 문제점은 무엇일까요?",
    options: [
      { text: "양수 조건이 명시되지 않았다.", correct: false },
      { text: "우변에 변수가 남아 있어 상수가 되지 못했다.", correct: false },
      { text: "두 부등식의 등호 성립 조건($x=y$ 와 $y=4x$)이 동시에 성립할 수 없다.", correct: true },
      { text: "전혀 문제가 없으며 실제로 최솟값은 8이다.", correct: false }
    ],
    explanation: "<strong>정답: 등호 성립 조건의 동시성 모순!</strong><br>앞 괄호의 등호 조건은 $x=y$이고, 뒤 괄호의 등호 조건은 $\\frac{1}{x}=\\frac{4}{y} \\implies y=4x$입니다. 두 조건이 동시에 성립하려면 $x=4x \\implies x=0$이어야 하므로 양수 조건에 모순됩니다! 올바른 풀이는 식을 전개하여 $1 + 4 + \\frac{4x}{y} + \\frac{y}{x} \\ge 5 + 2\\sqrt{4} = 9$로 구하는 것입니다."
  },
  {
    id: 2,
    question: "실수 전체 집합에서 정의된 함수 $f(x) = x + \\frac{9}{x}$의 최솟값을 산술기하평균으로 $x + \\frac{9}{x} \\ge 2\\sqrt{9} = 6$이라고 하였습니다. 이 풀이가 틀린 가장 근본적인 이유는?",
    options: [
      { text: "곱이 상수가 되지 않아서", correct: false },
      { text: "실수 전체에서 $x$가 음수일 수 있으므로 '양수 조건'을 만족하지 않아서", correct: true },
      { text: "등호 성립 조건 $x^2 = 9$를 만족하는 $x$가 실수에 존재하지 않아서", correct: false },
      { text: "산술기하평균은 분수식에는 적용할 수 없기 때문에", correct: false }
    ],
    explanation: "<strong>정답: 양수 조건의 결여!</strong><br>문제에서 $x>0$이라는 제한이 없으므로 $x$는 음수일 수 있습니다. 예를 들어 $x = -10$이면 $-10 - 0.9 = -10.9 < 6$입니다! 산술·기하평균 부등식은 반드시 두 수가 모두 양수일 때만 최솟값 판정에 사용할 수 있습니다."
  },
  {
    id: 3,
    question: "함수 $f(x) = x^2 + (4-x)^2$에 산술기하평균을 적용하여 $2\\sqrt{x^2(4-x)^2} = 2|x(4-x)|$로 둔 후 최솟값을 구하려는 시도가 잘못된 가장 결정적인 이유는?",
    options: [
      { text: "우변 $2|x(4-x)|$가 고정된 상수가 아니라 $x$에 따라 변하는 함수이기 때문", correct: true },
      { text: "두 항의 제곱이 실수에서 항상 음수이기 때문", correct: false },
      { text: "이차함수는 어떠한 경우에도 부등식을 적용할 수 없기 때문", correct: false },
      { text: "등호 성립 조건이 허수이기 때문", correct: false }
    ],
    explanation: "<strong>정답: 우변의 상수화 실패!</strong><br>부등식 $A+B \\ge 2\\sqrt{AB}$로 합의 최솟값을 얻으려면 우변 $2\\sqrt{AB}$가 변수에 무관한 '고정된 상수'여야 합니다. 우변이 $x$의 함수로 움직이면 하한선 자체가 변하므로 최솟값을 특정할 수 없습니다. 올바른 방법은 완전제곱식 변형 $2(x-2)^2 + 8 \\ge 8$입니다."
  },
  {
    id: 4,
    question: "$x > 2$일 때, 식 $x + \\frac{9}{x-2}$의 최솟값을 산술기하평균을 이용하여 올바르게 구하는 방법은?",
    options: [
      { text: "주어진 식에 곧바로 산술기하를 적용하여 $2\\sqrt{\\frac{9x}{x-2}}$로 계산한다.", correct: false },
      { text: "식을 $(x-2) + \\frac{9}{x-2} + 2$로 변형하여 역수 곱이 상수가 되도록 만든 뒤 적용한다.", correct: true },
      { text: "분모를 통분하여 $x^2 - 2x + 9$의 판별식을 0으로 둔다.", correct: false },
      { text: "$x > 2$ 조건에서는 산술기하평균을 절대 사용할 수 없다.", correct: false }
    ],
    explanation: "<strong>정답: 상수화 식 변형!</strong><br>그냥 곱하면 $x \\cdot \\frac{9}{x-2}$로 변수가 소거되지 않습니다. 따라서 $x-2 > 0$임을 이용하여 $(x-2) + \\frac{9}{x-2} + 2 \\ge 2\\sqrt{9} + 2 = 6 + 2 = 8$로 변형해야 문자가 약분되어 상수가 됩니다!"
  }
];

let userAnswers = {};

function initQuiz() {
  const container = document.getElementById('quizList');
  if (!container) return;

  container.innerHTML = '';
  quizData.forEach((q, qIndex) => {
    const card = document.createElement('div');
    card.className = 'quiz-card';
    card.id = `quiz-card-${q.id}`;

    let optionsHtml = '';
    q.options.forEach((opt, optIndex) => {
      optionsHtml += `
        <button class="quiz-option-btn" data-qid="${q.id}" data-idx="${optIndex}">
          <span class="opt-label">${String.fromCharCode(65 + optIndex)}.</span>
          <span class="opt-text">${opt.text}</span>
        </button>
      `;
    });

    card.innerHTML = `
      <div class="quiz-q-num">Question 0${q.id}</div>
      <div class="quiz-question">${q.question}</div>
      <div class="quiz-options">${optionsHtml}</div>
      <div class="quiz-feedback" id="feedback-${q.id}" style="display: none;"></div>
    `;

    container.appendChild(card);
  });

  // Bind option clicks
  const optionBtns = container.querySelectorAll('.quiz-option-btn');
  optionBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const qid = parseInt(btn.getAttribute('data-qid'), 10);
      const optIdx = parseInt(btn.getAttribute('data-idx'), 10);
      handleQuizAnswer(qid, optIdx);
    });
  });

  triggerMathRender();
}

function handleQuizAnswer(qid, selectedIdx) {
  const qObj = quizData.find((q) => q.id === qid);
  if (!qObj) return;

  const card = document.getElementById(`quiz-card-${qid}`);
  const feedbackEl = document.getElementById(`feedback-${qid}`);
  const buttons = card.querySelectorAll('.quiz-option-btn');

  // Disable all buttons for this question
  buttons.forEach((b) => (b.disabled = true));

  const isCorrect = qObj.options[selectedIdx].correct;
  userAnswers[qid] = isCorrect;

  // Highlight chosen and correct options
  buttons.forEach((b, idx) => {
    if (idx === selectedIdx) {
      b.classList.add(isCorrect ? 'selected-correct' : 'selected-wrong');
    }
    if (qObj.options[idx].correct) {
      b.classList.add('selected-correct');
    }
  });

  // Show feedback
  feedbackEl.style.display = 'block';
  feedbackEl.className = `quiz-feedback ${isCorrect ? 'correct' : 'wrong'}`;
  feedbackEl.innerHTML = `
    <div style="font-weight: 700; margin-bottom: 0.4rem; color: ${isCorrect ? '#34d399' : '#fb7185'}">
      ${isCorrect ? '🎉 정답입니다!' : '❌ 오답입니다.'}
    </div>
    <div>${qObj.explanation}</div>
  `;

  triggerMathRender();

  // Check if all answered
  if (Object.keys(userAnswers).length === quizData.length) {
    showQuizSummary();
  }
}

function showQuizSummary() {
  const resultCard = document.getElementById('quizResultCard');
  const scoreText = document.getElementById('quizScoreText');
  if (!resultCard || !scoreText) return;

  const total = quizData.length;
  const correctCount = Object.values(userAnswers).filter(Boolean).length;

  resultCard.style.display = 'block';
  scoreText.innerHTML = `총 <strong>${total}문제</strong> 중 <strong>${correctCount}문제</strong>를 맞추셨습니다! (${Math.round((correctCount / total) * 100)}점)<br>
    ${correctCount === total ? '🥇 대단합니다! 산술·기하평균의 모든 함정을 완벽하게 꿰뚫고 계시네요!' : '산술·기하평균 3대 원칙을 다시 한번 복습하고 도전해 보세요.'}`;
}

window.resetQuiz = function () {
  userAnswers = {};
  const resultCard = document.getElementById('quizResultCard');
  if (resultCard) resultCard.style.display = 'none';
  initQuiz();
};
