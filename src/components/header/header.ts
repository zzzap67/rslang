import LoginPopup from '../authorization/login-popup';
import BaseElement from '../base-element/base-element';
import Button from '../buttons/button';
import HeaderNav from './header-nav';

class Header {
  public headerElement: HTMLElement;
  constructor() {
    const header = new BaseElement('header', ['header']).element;
    const logoContainer = new BaseElement('div', ['logo-container']).element;
    const navContainer = new HeaderNav().navContainer;
    const loginContainer = new BaseElement('div', ['login-container']).element;
    const logInButton = new Button('Log In').buttonElement;
    const userNameField = new BaseElement('div', ['user-name-field']).element;
    logInButton.addEventListener('click', this.handlelogIn);
    loginContainer.append(userNameField, logInButton);
    header.append(logoContainer, navContainer, loginContainer);
    this.headerElement = header;
  }

  private handlelogIn() {
    document.body.append(new LoginPopup().loginPopupElement);
  }
}

export default Header;
