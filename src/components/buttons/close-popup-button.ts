import BaseElement from '../base-element/base-element';

class ClosePopupButton {
  closePopubButtonElement: HTMLElement;

  constructor() {
    const closeButtonElement = new BaseElement('div', ['close-popup-btn']).element;
    closeButtonElement.innerText = '╳';
    closeButtonElement.addEventListener('click', ClosePopupButton.closePopup);
    this.closePopubButtonElement = closeButtonElement;
  }

  static closePopup(): void {
    const popup = document.body.querySelector('.popup');
    const overlay = document.body.querySelector('.overlay');
    popup?.remove();
    overlay?.remove();
  }
}

export default ClosePopupButton;
