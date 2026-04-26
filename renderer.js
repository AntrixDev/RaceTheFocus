const appMain = document.getElementById('main');
const btnClose = document.getElementById('btn-close');

btnClose.addEventListener('click', ()=>{
  window.electronAPI.closeWindow();
});

const app = document.getElementById('app');
const races = [
  { id: 'RACE_1', icon: '🛣️', distance: 60, time: '1 min', name: 'Sprint Circuit' },
  { id: 'RACE_2', icon: '🌃', distance: 28, time: '15 min', name: 'Grand Prix Track' },
  { id: 'RACE_3', icon: '🏙️', distance: 45, time: '25 min', name: 'Endurance Rally' },
  { id: 'RACE_4', icon: '🏞️', distance: 72, time: '50 min', name: 'Hyper Speedway' },
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
        ${r.id}
        <span class="dur">${r.time}</span>
      </button>
    `).join('')}
    <p class="dots">· · · · · · · ·</p>
  `;
}

function renderDetails(name) {
  const d = races.find(x => x.id === name);
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
        <p class="pull-hint">↓ pull down to start race ↓</p>
        <hr class="slip-line">
        <p class="pull-icons">🏎️ &nbsp; 🏁</p>
        <hr class="slip-line">
        <p class="slip-footer">GOOD LUCK DRIVER ♡</p>
      </div>
    </div>

    <div id="race-panel">
      <div class="track-wrap" id="track">
        <div id="cntdwn-overlay"></div>
        <div class="edge l"></div>
        <div class="edge r"></div>
        <div class="center-line"></div>
      </div>
      <div class="car-legend" id="legend">
        <span><span class="dot red"></span> Car 1</span>
        <span><span class="dot blue"></span> Car 2</span>
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

  initPull(d);
}

function showWinner() {
  const panel = document.getElementById('race-panel');

  const winner = document.createElement('div');
  winner.className = 'winner-screen';
  winner.innerHTML = `
    <div class="trophy">🏆</div>
    <div class="winner-text">WINNER</div>
  `;

  panel.insertBefore(winner, panel.firstChild);
}

function initPull(d) {
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
      setTimeout(() => { ticket.style.display = 'none'; startRace(d); }, 420);
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

function startRace(d) {
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

      runRace(d);
    }
    count--;
  }, 800);
}

function runRace(d) {
  const distVal = document.getElementById('dist-val');
  const distLead = document.getElementById('dist-lead');
  
  const durationMinutes = parseInt(d.time); 
  const totalDurationMs = durationMinutes * 60 * 1000;
  const startTime = Date.now();
  const totalKm = d.distance;

  if (raceInterval) clearInterval(raceInterval);

  raceInterval = setInterval(() => {
    const now = Date.now();
    const elapsed = now - startTime;
    
    let progress = elapsed / totalDurationMs;
    
    if (progress >= 1) {
      progress = 1;
      clearInterval(raceInterval);

      document.getElementById('track').style.display = 'none';
      document.getElementById('legend').style.display = 'none';
      document.getElementById('dist-board').style.display = 'none';

      showWinner();
    }
    const remainingDist = totalKm - (totalKm * progress);
    
    distVal.textContent = remainingDist.toFixed(2) + ' km';
    distLead.textContent = '..';
  }, 100);
}

renderMenu();

