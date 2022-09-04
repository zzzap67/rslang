import './header.scss';
import LoginPopup from '../authorization/login-popup';
import BaseElement from '../base-element/base-element';
import Button from '../buttons/button';
import { state } from '../store/state';
import HeaderNav from './header-nav';
import WarningPopup from '../authorization/warning-popup';
import MainContainer from '../main-container/main-container';

class Header {
  public headerElement: HTMLElement;
  private statButton: HTMLElement;

  constructor() {
    const header = new BaseElement('header', ['header']).element;
    const headerWrapper = new BaseElement('header', ['header__wrapper']).element;
    const logoContainer = new BaseElement('div', ['logo-container']).element;
    const navContainer = new HeaderNav().navContainer;
    const loginContainer = new BaseElement('div', ['login-container']).element;
    const loginBtnsContainer = new BaseElement('div', ['login__btns-container']).element;
    const logInButton = new Button('LOG IN', ['header__login-btn']).buttonElement;
    const userNameField = new BaseElement('div', ['user-name-field']).element;
    const statButton = navContainer.querySelector('[data-role="statistics"]') as HTMLElement;
    if (state.userName) {
      userNameField.textContent = `${state.userName}`;
    }
    logInButton.addEventListener('click', () => this.handlelogIn(logInButton));
    if (!state.userName) {
      logInButton.textContent = 'LOG IN';
      logInButton.classList.remove('header__logout-btn');
      statButton.style.display = 'none';
    } else {
      logInButton.textContent = 'LOG OUT';
      logInButton.classList.add('header__logout-btn');
      statButton.style.display = 'inline-block';
    }
    loginBtnsContainer.append(logInButton);
    loginContainer.append(loginBtnsContainer, userNameField);
    headerWrapper.append(logoContainer, navContainer, loginContainer);
    header.append(headerWrapper);
    this.statButton = statButton;
    this.headerElement = header;
  }

  private handlelogIn(logInButton: HTMLElement) {
    if (logInButton.textContent === 'LOG IN') {
      document.body.append(new LoginPopup().loginPopupElement);
    } else {
      const warningPopup = new WarningPopup('Действительно хочешь выйти из аккаунта?');
      const noButton = new Button('Нет').buttonElement;
      const yesBtn = warningPopup.warningPopupElement.querySelector('.btn') as HTMLElement;
      yesBtn.textContent = 'Да';
      warningPopup.warningPopupElement.append(noButton);
      noButton.addEventListener('click', () =>
        warningPopup.closeWarningPopup(warningPopup.warningPopupElement, warningPopup.warningPopupOverlay)
      );
      yesBtn.addEventListener('click', () => {
        this.logOut(logInButton);
        warningPopup.closeWarningPopup(warningPopup.warningPopupElement, warningPopup.warningPopupOverlay);
      });
    }
  }

  private logOut(logInButton: HTMLElement) {
    state.userId = '';
    state.userName = '';
    state.token = '';
    state.page = 0;
    state.token = '';
    state.refreshToken = '';
    state.tokenExpireTime = 0;

    const userNameField = document.body.querySelector('.user-name-field') as HTMLElement;
    userNameField.textContent = '';
    localStorage.setItem('state', JSON.stringify(state));
    logInButton.textContent = 'LOG IN';
    logInButton.classList.remove('header__logout-btn');
    this.statButton.style.display = 'none';
    const mainContainer = document.body.querySelector('.main') as HTMLElement;
    mainContainer.innerHTML = '';
    mainContainer.append(new MainContainer().mainContainerElement);
  }
}

export default Header;
