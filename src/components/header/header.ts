import './header.scss';
import LoginPopup from '../authorization/login-popup';
import BaseElement from '../base-element/base-element';
import Button from '../buttons/button';
import { state } from '../store/state';
import HeaderNav from './header-nav';

class Header {
  public headerElement: HTMLElement;
  constructor() {
    const header = new BaseElement('header', ['header']).element;
    const headerWrapper = new BaseElement('header', ['header__wrapper']).element;
    const logoContainer = new BaseElement('div', ['logo-container']).element;
    const navContainer = new HeaderNav().navContainer;
    const loginContainer = new BaseElement('div', ['login-container']).element;
    const loginBtnsContainer = new BaseElement('div', ['login__btns-container']).element;
    const logInButton = new Button('LOG IN', ['header__login-btn']).buttonElement;
    const logOutButton = new Button('LOG OUT', ['header__logout-btn']).buttonElement;
    const userNameField = new BaseElement('div', ['user-name-field']).element;
    logInButton.addEventListener('click', this.handlelogIn);
    loginBtnsContainer.append(logInButton, logOutButton);
    loginContainer.append(loginBtnsContainer, userNameField);
    headerWrapper.append(logoContainer, navContainer, loginContainer);
    header.append(headerWrapper);
    this.headerElement = header;
  }

  private handlelogIn() {
    document.body.append(new LoginPopup().loginPopupElement);
  }

  static printUserName() {
    const userNameField = document.body.querySelector('.user-name-field') as HTMLElement;
    if (state.userName) {
      userNameField.textContent = `${state.userName}`;
    }
  }
}

export default Header;
