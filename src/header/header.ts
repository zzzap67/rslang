import LoginPopup from '../authorization/login-popup';
import BaseElement from '../base-element/base-element';
import Button from '../buttons/button';

class Header {
  constructor() {
    const header = new BaseElement('header', ['header']).element;
    const logInButton = new Button('Log In').buttonElement;
    const userNameField = new BaseElement('div', ['user-name-field']).element;
    logInButton.addEventListener('click', this.handlelogIn);
    header.append(logInButton, userNameField);
    document.body.prepend(header);
  }

  private handlelogIn() {
    document.body.append(new LoginPopup().loginPopupElement);
  }
}

export default Header;
