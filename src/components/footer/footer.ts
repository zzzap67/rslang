import './footer.scss';
import BaseElement from '../base-element/base-element';

class Footer {
  public footerElement: HTMLElement;
  constructor() {
    const footer = new BaseElement('footer', ['footer']).element;
    footer.innerHTML = `
    <div class="footer__wrapper">
      <div class="footer__logo">
      <a href="https://rs.school/js/" class="footer__link_logo" target="blank">
          <div class="footer__img"></div>
      </a>
      </div>
      <div class="footer__team">
          <a href="https://github.com/zzzap67" class="footer__link_team" target="blank">zzzap67</a>
          <a href="https://github.com/gar7777" class="footer__link_team" target="blank">gar</a>
          <a href="https://github.com/Kseniya-Korolchuk" class="footer__link_team" target="blank">redwood</a>
      </div>
      <div class="footer__year">
          <a href="https://github.com/zzzap67/rslang" class="footer__link_team" target="blank">Team 141 </a><span>&copy; 2022</span>
      </div>
    </div>
    `;
    this.footerElement = footer;
  }
}

export default Footer;
