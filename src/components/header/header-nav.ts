import BaseElement from '../base-element/base-element';
import { HEADER_NAV_ITEMS } from '../constants/constants';

class HeaderNav {
  public navContainer: HTMLElement;
  constructor() {
    const navContainer = new BaseElement('nav', ['nav']).element;
    const navUl = new BaseElement('ul', ['header-nav-ul']).element;
    HEADER_NAV_ITEMS.forEach((item) => {
      const li = new BaseElement('li', ['header-nav-li']).element;
      li.textContent = item;
      navUl.append(li);
    });
    navContainer.append(navUl);
    this.navContainer = navContainer;
  }
}

export default HeaderNav;
