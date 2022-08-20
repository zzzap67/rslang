import BaseElement from '../base-element/base-element';
import { HEADER_NAV_ITEMS } from '../constants/constants';
import Tutorial from '../pages/tutorial';

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
  }
}

export default HeaderNav;
