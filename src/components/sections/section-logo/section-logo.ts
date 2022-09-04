import BaseElement from '../../base-element/base-element';
import './section-logo.scss';

class LogoSection {
  public logoSectionElement: HTMLElement;

  constructor() {
    const logoSection = new BaseElement('section', ['section', 'section-logo']).element;
    logoSection.innerHTML = `
    <div class="section__wrapper section-logo__wrapper">
      <div class="section__logo-wrapper">
          <div class="section__heading-wrapper">
              <h2 class="section__h2">Learn English</h2>
              <span class="section__heading-span">with</span>
              <h1 class="section__h1 section-logo__h1">RS <span>L</span>ang</h1>
              <div class="section__heading-text-wrapper">
                <h3 class="section__h3">Эффективное приложение для нескучного изучения английского языка</h3>
                <h3 class="section__h3"></h3>
              </div>
          </div>
      </div>
      <img src="./img/main-picture.png" alt="" class="section__logo-img">
    </div>
    `;
    this.logoSectionElement = logoSection;
  }
}

export default LogoSection;
