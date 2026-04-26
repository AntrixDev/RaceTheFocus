const appMain = document.getElementById('main');
const btnClose = document.getElementById('btn-close');

btnClose.addEventListener('click', ()=>{
  window.electronAPI.closeWindow();
});

const app = document.getElementById('app');
const races = [
  { id: 'Sprint_Circuit', icon: '🛣️', distance: 30, time: '5 min', name: 'Sprint Circuit' },
  { id: 'Grand_Prix_Track', icon: '🌃', distance: 80, time: '15 min', name: 'Grand Prix Track' },
  { id: 'Endurance_Rally', icon: '🏙️', distance: 120, time: '25 min', name: 'Endurance Rally' },
  { id: 'Hyper_Speedway', icon: '🏞️', distance: 160, time: '50 min', name: 'Hyper Speedway' },
];

const carOptions = [
  { id: 'navy',   file: 'navyCar.png',   label: 'Navy Car',   dot: '#1a2e5e' },
  { id: 'blue',   file: 'blueCar.png',   label: 'Blue Car',   dot: '#2980b9' },
  { id: 'orange', file: 'orangeCar.png', label: 'Orange Car', dot: '#f19a0f' },
  { id: 'green',  file: 'greenCar.png',  label: 'Green Car',  dot: '#27ae60' },
  { id: 'red',    file: 'redCar.png',    label: 'Red Car',    dot: '#e74c3c' },
];

let raceInterval = null;

function renderMenu() {
  if (raceInterval) { clearInterval(raceInterval); raceInterval = null; }
  app.innerHTML = `
    <h1>TICKET BOOTH</h1>
    <p class="sub">select a race</p>
    <p class="dots">· · · · · · · ·</p>
    ${races.map(r => `
      <button class="btn-race" onclick="renderDetails('${r.id}')">
        <span class="ico">${r.icon}</span>
        ${r.name}
        <span class="dur">${r.time}</span>
      </button>
    `).join('')}
    <p class="dots">· · · · · · · ·</p>
  `;
}

function renderDetails(name) {
  const d = races.find(x => x.id === name);
  
  const shuffled = [...carOptions].sort(() => Math.random() - 0.5);
  const [carA, carB] = shuffled;
  
  app.innerHTML = `
    <h1>🏁 RACE TICKET 🏁</h1>
    <br>
    <div class="slip-wrap">
      <div class="slip-top">
        <div class="slip-row"><span>Race</span><span>${d.name}</span></div>
        <div class="slip-row"><span>Distance</span><span>${d.distance} km</span></div>
        <div class="slip-row"><span>Time</span><span>${d.time}</span></div>
      </div>
      <hr class="slip-divider">
      <div class="slip-pull" id="pull-ticket">
        <div class="grab-bar-sm"></div>
        <div class="grab-bar"></div>
        <p class="pull-hint">↓ pull down to start the race ↓</p>
        <hr class="slip-line">
        <p class="pull-icons">🏎️. ݁₊ ⊹ . ݁˖ .</p>
        <hr class="slip-line">
        <p class="slip-footer">GOOD LUCK DRIVER ♡</p>
      </div>
    </div>

    <div id="race-panel">
      <div class="track-wrap" id="track">
        <div id="cntdwn-overlay"></div>
        <img src="assets/cars/${carA.file}" id="car1" class="car car-left"  alt="${carA.label}">
        <img src="assets/cars/${carB.file}" id="car2" class="car car-right" alt="${carB.label}">
        <div class="edge l"></div>
        <div class="edge r"></div>
        <div class="center-line"></div>
      </div>
      <div class="car-legend" id="legend">
        <span><span class="dot" style="background:${carA.dot}"></span> ${carA.label}</span>
        <span><span class="dot" style="background:${carB.dot}"></span> ${carB.label}</span>
      </div>
      <br>
      <div class="dist-board" id="dist-board">
        <div class="dist-left">
          <div class="dist-label">GAP BETWEEN CARS</div>
          <div class="dist-value" id="dist-val">${d.distance}.00 km</div>
        </div>
        <div class="dist-right">
          <div class="dist-label">LEADING</div>
          <div class="dist-lead" id="dist-lead">—</div>
        </div>
      </div>
      <button class="btn-back" onclick="renderMenu()">← back to garage</button>
    </div>
  `;

  initPull(d, carA, carB);
}

function showWinner(label) {
  const panel  = document.getElementById('race-panel');
  const winner = document.createElement('div');
  winner.className = 'winner-screen';
  const isTie = label === 'TIE';

  winner.innerHTML = isTie 
  ?`<div class="trophy">⋆🤝⋆</div>
    <div class="winner-text">IT'S A TIE!</div>`
  : `<div class="trophy">⋆🏆⋆</div>
    <div class="winner-text">WINNER</div>
    <div class="winner-name">${label}</div>`;

  panel.insertBefore(winner, panel.firstChild);
}

function initPull(d, carA, carB) {
  const ticket = document.getElementById('pull-ticket');
  if (!ticket) return;
  let dragging = false, startY = 0;

  const start = (y) => { dragging = true; startY = y; ticket.style.transition = 'none'; };
  const move = (y) => {
    if (!dragging) return;
    const dy = Math.max(0, Math.min(y - startY, 130));
    const tilt = Math.min(dy / 20, 6);
ticket.style.transform = `translateY(${dy}px) rotate(${tilt}deg)`;
  };
  const end = (y) => {
    if (!dragging) return;
    dragging = false;
    if (y - startY > 75) {
      ticket.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
      ticket.style.transform = 'translateY(160px) rotate(8deg)';
      ticket.style.opacity = '0';
      setTimeout(() => { ticket.style.display = 'none'; startRace(d, carA, carB); }, 420);
    } else {
      ticket.style.transition = 'transform 0.35s ease';
      ticket.style.transform = 'translateY(0) rotate(0deg)';
    }
  };

  ticket.addEventListener('mousedown', e => start(e.clientY));
  document.addEventListener('mousemove', e => move(e.clientY));
  document.addEventListener('mouseup', e => end(e.clientY));
  ticket.addEventListener('touchstart', e => start(e.touches[0].clientY), { passive: true });
  document.addEventListener('touchmove', e => move(e.touches[0].clientY), { passive: true });
  document.addEventListener('touchend', e => end(e.changedTouches[0].clientY));
}

function randomCarBehavior(car, track) {
  let currentOffsetY = 0;
  let targetOffsetY = 0;
  let animationId;

  function animateFrame() {
    const diff = targetOffsetY - currentOffsetY;
    currentOffsetY += diff * 0.04;

    car.style.setProperty('--offsetY', `${currentOffsetY}px`);
    animationId = requestAnimationFrame(animateFrame);
  }

  animationId = requestAnimationFrame(animateFrame);

  function pickTarget() {
    const trackHeight = track.offsetHeight;
    const percent = 0.01 + Math.random() * 0.14;
    const distance = trackHeight * percent;

    targetOffsetY = Math.random() > 0.5 ? -distance : distance;
    setTimeout(pickTarget, 800 + Math.random() * 2000);
  }

  pickTarget();

  return {
    cancel: () => cancelAnimationFrame(animationId),
    getOffsetY: () => currentOffsetY,
  };
}

function startRace(d, carA, carB) {
  const panel = document.getElementById('race-panel');
  panel.style.display = 'block';

  const overlay = document.getElementById('cntdwn-overlay');
  overlay.style.display = 'flex';

  const track = document.querySelector('.track-wrap');
  const centerLine = document.querySelector('.center-line');

  let count = 3;
  const timer = setInterval(() => {
    overlay.innerText = count > 0 ? count : "GO!";
    
    if (count < 0) {
      clearInterval(timer);
      overlay.style.display = 'none';

      const minutes = parseInt(d.time);
      const rawSpeed = d.distance / minutes;

      const minSpeed = 50;
      const speed = Math.max(rawSpeed, minSpeed);

      const minDur = 0.15;
      const maxDur = 1.2;

      const normalized = Math.min(speed / 60, 1);
      const animDuration = maxDur - (normalized * (maxDur - minDur));

      centerLine.style.animationDuration = `${animDuration}s`;
      track.classList.add('track-active');
      const trackEl = document.getElementById('track');
      const car1 = document.getElementById('car1');
      const car2 = document.getElementById('car2');

      const behaviorA = randomCarBehavior(car1, trackEl);
      const behaviorB = randomCarBehavior(car2, trackEl);

      runRace(d, carA, carB, behaviorA, behaviorB);
    }
    count--;
  }, 800);
}

function runRace(d, carA, carB, behaviorA, behaviorB) {
  const distVal  = document.getElementById('dist-val');
  const distLead = document.getElementById('dist-lead');
  const durationMinutes = parseInt(d.time);
  const totalDurationMs = durationMinutes * 60 * 1000;
  const startTime = Date.now();
  const totalKm = d.distance;

  if (raceInterval) clearInterval(raceInterval);

  raceInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    let progress = elapsed / totalDurationMs;

    if (progress >= 1) {
      progress = 1;
      clearInterval(raceInterval);
      behaviorA.cancel();
      behaviorB.cancel();

      const offA = behaviorA.getOffsetY();
      const offB = behaviorB.getOffsetY();
      const winnerLabel =
        offA < offB ? carA.label :
        offB < offA ? carB.label :
        'TIE';

      document.getElementById('track').style.display = 'none';
      document.getElementById('legend').style.display = 'none';
      document.getElementById('dist-board').style.display = 'none';

      showWinner(winnerLabel);
      return;
    }

    const remainingDist = totalKm - (totalKm * progress);

    distVal.textContent = remainingDist.toFixed(2) + ' km';
    
    const offA = behaviorA.getOffsetY();
    const offB = behaviorB.getOffsetY();
    const diff = Math.abs(offA - offB);

    if (diff < 0.5) {
      distLead.textContent = 'TIE';
    } else {
      distLead.textContent = offA < offB ? carA.label : carB.label;
    }
  }, 100);
}

renderMenu();

