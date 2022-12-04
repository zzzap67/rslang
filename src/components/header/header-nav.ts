import Audiocall from '../games/audiocall/audiocall';
import GameStartScreen from '../games/gameStartScreen';
import BaseElement from '../base-element/base-element';
import MainContainer from '../main-container/main-container';
import { HEADER_NAV_ITEMS } from '../store/constants';
import Tutorial from '../tutorial/tutorial';
import { state } from '../store/state';
import Statistics from '../statistics/statistics';
import Header from './header';

class HeaderNav {
  public navContainer: HTMLElement;
  private gamesUl: HTMLElement;

  constructor() {
    const navContainer = new BaseElement('nav', ['nav']).element;
    const navUl = new BaseElement('ul', ['header-nav-ul']).element;
    const gamesUl = new BaseElement('ul', ['header__games-ul']).element;
    this.gamesUl = gamesUl;
    const liSprint = new BaseElement('li', ['header__nav-sprint']).element;
    liSprint.textContent = 'Спринт';
    const liCall = new BaseElement('li', ['header__nav-call']).element;
    liCall.textContent = 'Аудиовызов';
    gamesUl.append(liSprint, liCall);

    HEADER_NAV_ITEMS.forEach((item) => {
      const li = new BaseElement('li', ['header-nav-li']).element;
      li.textContent = item.name;
      if (item.role === 'games') {
        li.classList.add('header__nav-li_games');
        li.append(gamesUl);
      }
      li.setAttribute('data-role', item.role);
      navUl.append(li);
    });
    navUl.addEventListener('click', (e: Event) => {
      this.handleNavUl(e);
      const header = new Header();
      header.showMobileMenu();
    });
    gamesUl.addEventListener('click', (e: Event) => {
      this.handleGamesUl(e);
    });
    navContainer.append(navUl);
    this.navContainer = navContainer;
  }

  private handleGamesUl(e: Event) {
    const target = e.target as HTMLElement;
    const footer = document.body.querySelector('.footer') as HTMLElement;
    if (target.classList.contains('header__nav-call')) {
      footer.classList.add('footer__hidden');
      state.currentPage = 'audiocall';
      localStorage.setItem('state', JSON.stringify(state));

      new Audiocall(-1, -1);
    }
    if (target.classList.contains('header__nav-sprint')) {
      footer.classList.add('footer__hidden');
      const mainContainer = document.body.querySelector('.main') as HTMLElement;
      state.currentPage = 'sprint';
      localStorage.setItem('state', JSON.stringify(state));
      mainContainer.innerHTML = '';
      mainContainer?.append(new GameStartScreen('sprint').startScrElement);
    }
  }

  private handleNavUl(e: Event) {
    const target = e.target as HTMLElement;
    const footer = document.body.querySelector('.footer') as HTMLElement;
    if (!target.classList.contains('header-nav-li')) return;
    if (target.dataset.role === 'tutorial') {
      footer.classList.remove('footer__hidden');
      state.currentPage = 'tutorial';
      localStorage.setItem('state', JSON.stringify(state));
      new Tutorial();
    }
    if (target.dataset.role === 'main') {
      state.currentPage = 'main';
      localStorage.setItem('state', JSON.stringify(state));
      footer.classList.remove('footer__hidden');
      const mainPageContent = new MainContainer();
      mainPageContent.render();
    }
    if (target.dataset.role === 'statistics') {
      state.currentPage = 'statistics';
      localStorage.setItem('state', JSON.stringify(state));
      footer.classList.remove('footer__hidden');
      new Statistics();
    }
  }
}

export default HeaderNav;
