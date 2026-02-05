const appMain = document.getElementById('main');
const btnClose = document.getElementById('btn-close');

btnClose.addEventListener('click', ()=>{
  window.electronAPI.closeWindow();
});

function renderMainContnt(view){
  appMain.innerHTML = '';

  switch(view){
    case 'menu':
      appMain.innerHTML = ViewMenu();
      break;
    case 'details':
      appMain.innerHTML = ViewDetails();
      break;
    default:
      appMain.innerHTML = '<p>App error</p>';
  }
}

function ViewMenu(){
  return `<h1>⊱· CAFEE ORDER ·⊰</h1>
      <p>select your order:P</p>
      <p class="dots">⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯</p>
          <button class="btn-drink" onclick="renderMainContnt('details')">
              <span class="icon">☕</span> Espresso <span class="duration">10 min focus</span>
          </button>
          <button class="btn-drink" onclick="renderMainContnt('details')">
              <span class="icon">🥛</span> Latte <span class="duration">15 min focus</span>
          </button>
          <button class="btn-drink" onclick="renderMainContnt('details')">
              <span class="icon">🧋</span> Tea <span class="duration">25 min focus</span>
          </button>
          <button class="btn-drink" onclick="renderMainContnt('details')">
              <span class="icon">🥤</span> Soda <span class="duration">50 min focus</span>
          </button>
      <p class="dots">⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯</p>`;
}

function ViewDetails(){
  return `<p>details vieww</p> <button class="btn-drink" onclick="renderMainContnt('menu')">←Back</button>`
}

renderMainContnt('menu');

