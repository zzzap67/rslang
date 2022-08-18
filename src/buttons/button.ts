import BaseElement from '../base-element/base-element';

class Button {
  public buttonElement: HTMLElement;

  constructor(name: string, optionStyles: string[] = []) {
    const button = new BaseElement('div', ['btn', ...optionStyles]).element;
    this.buttonElement = button;
    this.buttonElement.textContent = name;
  }
}

export default Button;
