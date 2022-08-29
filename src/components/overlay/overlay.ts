import './overlay.scss';

import BaseElement from '../base-element/base-element';
import ClosePopupButton from '../buttons/close-popup-button';

class Overlay {
  overlayElement: HTMLElement;
  constructor() {
    const overlay = new BaseElement('div', ['overlay']).element;
    overlay.addEventListener('click', ClosePopupButton.closePopup);
    this.overlayElement = overlay;
  }
}

export default Overlay;
