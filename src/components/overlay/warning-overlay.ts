import BaseElement from '../base-element/base-element';

class WarningOverlay {
  overlayElement: HTMLElement;
  constructor() {
    const warningOverlay = new BaseElement('div', ['warning-overlay']).element;
    document.body.append(warningOverlay);
    this.overlayElement = warningOverlay;
  }
}

export default WarningOverlay;
