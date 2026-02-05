document.getElementById('btn-close').addEventListener('click', () => {
  window.electronAPI.closeWindow();
});


const appMain = document.getElementById('main');

function renderMainContnt(view) {

  appMain.innerHTML = '';

  if(view=='drinkChoice'){
        appMain.innerHTML = `<h1>⊱· CAFEE ORDER ·⊰</h1>
        <p>select your order:P</p>
        <p class="dots">⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯</p>
            <button class="btn-drink">
                <span class="icon">☕</span> Espresso <span class="duration">10 min focus</span>
            </button>
            <button class="btn-drink">
                <span class="icon">🥛</span> Latte <span class="duration">15 min focus</span>
            </button>
            <button class="btn-drink">
                <span class="icon">🧋</span> Tea <span class="duration">25 min focus</span>
            </button>
            <button class="btn-drink">
                <span class="icon">🥤</span> Soda <span class="duration">50 min focus</span>
            </button>
        <p class="dots">⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯</p>`;
  }else{
    appMain.innerHTML = `<h1>App error</h1>`;
  }
}

renderMainContnt('drinkChoice');

