import Audiocall from '../../games/audiocall/audiocall';
import GameStartScreen from '../../games/gameStartScreen';
import BaseElement from '../base-element/base-element';
import MainContainer from '../main-container/main-container';
import { HEADER_NAV_ITEMS } from '../store/constants';
import Tutorial from '../tutorial/tutorial';

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
    navUl.addEventListener('click', (e: Event) => this.handleNavUl(e));
    navContainer.append(navUl);
    this.navContainer = navContainer;
  }

  private showGamesMenu() {
    const gamesUl = document.querySelector('.header__games-ul') as HTMLElement;
    gamesUl.style.display = 'block';
    gamesUl.addEventListener('click', (e: Event) => {
      this.handleGamesUl(e);
    });
    gamesUl.style.opacity = '100';
    gamesUl.style.top = '50px';
    gamesUl.style.zIndex = '1000';
  }

  private handleGamesUl(e: Event) {
    const target = e.target as HTMLElement;
    if (target.classList.contains('header__nav-call')) {
      new Audiocall(-1, -1);
    }
    if (target.classList.contains('header__nav-sprint')) {
      const mainContainer = document.body.querySelector('.main') as HTMLElement;
      mainContainer.innerHTML = '';
      mainContainer?.append(new GameStartScreen('sprint').startScrElement);
    }
    this.gamesUl.style.display = 'none';
  }

  private handleNavUl(e: Event) {
    const target = e.target as HTMLElement;
    if (!target.classList.contains('header-nav-li')) return;
    if (target.dataset.role === 'tutorial') {
      new Tutorial();
    }
    if (target.dataset.role === 'main') {
      const mainPageContent = new MainContainer();
      mainPageContent.render();
    }
    if (target.dataset.role === 'games') {
      this.showGamesMenu();
    }
  }
}

export default HeaderNav;
