import BaseElement from '../../base-element/base-element';
import './section-logo.scss';

class LogoSection {
  public logoSectionElement: HTMLElement;

  constructor() {
    const logoSection = new BaseElement('section', ['section']).element;
    logoSection.textContent = 'LOGO_SECTION';
    this.logoSectionElement = logoSection;
  }
}

export default LogoSection;
