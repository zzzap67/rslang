import './warning-popup.scss';

import BaseElement from '../base-element/base-element';
import Button from '../buttons/button';
import WarningOverlay from '../overlay/warning-overlay';
import Validation from './validation';

class WarningPopup {
  constructor(warningPopupText: string) {
    const warningPopup = new BaseElement('div', ['warning-popup']).element;
    const warningPopupTextContainer = new BaseElement('div', ['warning-popup-text-container']).element;
    warningPopupTextContainer.innerText = warningPopupText;
    const warningPopupButton = new Button('OK').buttonElement;
    const warningOverlay = new WarningOverlay().overlayElement;
    warningPopupButton.addEventListener('click', () => this.closeWarningPopup(warningPopup, warningOverlay));
    warningPopup.append(warningPopupTextContainer);
    warningPopup.append(warningPopupTextContainer, warningPopupButton);
    document.body.append(warningOverlay, warningPopup);
    Validation.handleEsc(warningPopup, warningOverlay);
  }

  private closeWarningPopup(warningPopup: HTMLElement, warningOverlay: HTMLElement) {
    warningOverlay.remove();
    warningPopup.remove();
  }
}

export default WarningPopup;
