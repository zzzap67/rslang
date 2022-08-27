import Sprint from '../../games/sprint/sprint';
import BaseElement from '../base-element/base-element';
import MainContainer from '../main-container/main-container';
import { HEADER_NAV_ITEMS } from '../store/constants';
import Tutorial from '../tutorial/tutorial';
import Audiocall from '../games/audiocall/audiocall';

class HeaderNav {
  public navContainer: HTMLElement;
  constructor() {
    const navContainer = new BaseElement('nav', ['nav']).element;
    const navUl = new BaseElement('ul', ['header-nav-ul']).element;
    HEADER_NAV_ITEMS.forEach((item) => {
      const li = new BaseElement('li', ['header-nav-li']).element;
      li.textContent = item.name;
      li.setAttribute('data-role', item.role);
      navUl.append(li);
    });
    navUl.addEventListener('click', (e: Event) => this.handleNavUl(e));
    navContainer.append(navUl);
    this.navContainer = navContainer;
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
      const sprint: Sprint = new Sprint();
      sprint.addTimer();
      sprint.setTimer();

      const falseBtn = document.querySelector('.sprint__btn-false') as HTMLElement;
      falseBtn.addEventListener('click', () => {
        sprint.onBtnFalseClick();
      });

      const trueBtn = document.querySelector('.sprint__btn-true') as HTMLElement;
      trueBtn.addEventListener('click', () => {
        sprint.onBtnTrueClick();
      });
      new Audiocall(-1, -1);
    }
  }
}

export default HeaderNav;
