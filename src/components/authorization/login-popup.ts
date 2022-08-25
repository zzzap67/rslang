import BaseElement from '../base-element/base-element';
import Button from '../buttons/button';
import ClosePopupButton from '../buttons/close-popup-button';
import Overlay from '../overlay/overlay';
import { apiStrings, EMAIL_REGEXP, TOKEN_EXPIRATION_TIME } from '../store/constants';
import { state } from '../store/state';
import Validation from './validation';
import WarningPopup from './warning-popup';

class LoginPopup {
  loginPopupElement: HTMLElement;

  constructor() {
    const loginPopup = new BaseElement('div', ['popup']).element;
    const overlay = new Overlay().overlayElement;
    const fragment = document.createDocumentFragment();
    const closePopupButton = new ClosePopupButton().closePopubButtonElement;
    const loginForm = new BaseElement('form', ['login-form']).element;
    const loginSign = new BaseElement('p', ['login-sign']).element;
    loginSign.textContent = 'Log In';
    const inputEmail = new BaseElement('input', ['input-login', 'input-email']).element as HTMLInputElement;
    inputEmail.setAttribute('type', 'email');
    inputEmail.setAttribute('placeholder', 'Your e-mail');
    inputEmail.setAttribute('autocomplete', 'off');
    inputEmail.setAttribute('required', 'true');
    inputEmail.setAttribute('pattern', EMAIL_REGEXP);
    // inputEmail.addEventListener('change', () => Validation.checkEmail(inputEmail.value, inputEmail));
    const inputPassword = new BaseElement('input', ['input-login', 'input-password']).element as HTMLInputElement;
    inputPassword.setAttribute('type', 'password');
    inputPassword.setAttribute('placeholder', 'Your password (8 chars minimum)');
    inputPassword.setAttribute('autocomplete', 'off');
    inputPassword.setAttribute('required', 'true');
    inputPassword.setAttribute('minlength', '8');
    // inputPassword.addEventListener('change', () => Validation.checkPassword(inputPassword.value, inputPassword));
    const loginPopupButton = new Button('Log In', ['login-btn']).buttonElement;
    loginPopupButton.addEventListener('click', () => this.loginUser(loginPopup, inputEmail, inputPassword));
    const signUpButton = new BaseElement('p', ['sign-up-button']).element;
    signUpButton.textContent = `Don't authorized yet? Sign Up!`;
    signUpButton.addEventListener('click', () => this.handleCreateUser(loginPopup, inputEmail, inputPassword));
    document.body.append(overlay);
    loginForm.append(inputEmail, inputPassword, loginPopupButton);
    fragment.append(closePopupButton, loginSign, loginForm, signUpButton);
    loginPopup.append(fragment);
    this.loginPopupElement = loginPopup;
    Validation.handleEsc(loginPopup, overlay);
  }

  private async loginUser(
    loginPopup: HTMLElement,
    inputEmail: HTMLInputElement,
    inputPassword: HTMLInputElement
  ): Promise<void> {
    if (!Validation.checkAllFields(loginPopup, 'Введите правильные данные для логина')) return;
    const nameField = document.body.querySelector('.user-name-field') as HTMLElement;
    const email = inputEmail.value;
    const password = inputPassword.value;
    const newUser = {
      email: email,
      password: password,
    };

    await fetch(`${apiStrings.API_ADDRESS}${apiStrings.API_SIGN_IN}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })
      .then(async (response) => {
        const data = await response.json();
        state.userName = data.name;
        nameField.textContent = `Hi, ${state.userName}!`;
        localStorage.setItem('currentToken', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        const tokenExpireTime = Date.now() + TOKEN_EXPIRATION_TIME;
        localStorage.setItem('tokenExpireTime', tokenExpireTime.toString());
        state.userId = data.userId;
        console.log(data.userId);
        const overlay = document.body.querySelector('.overlay') as HTMLElement;
        overlay?.remove();
        loginPopup.remove();
      })
      .catch(() => {
        new WarningPopup('Нет такого пользователя :(');
      });
  }

  private handleCreateUser(
    loginPopup: HTMLElement,
    inputEmail: HTMLInputElement,
    inputPassword: HTMLInputElement
  ): void {
    const signUpSign = loginPopup.querySelector('.login-sign') as HTMLElement;
    const loginButton = loginPopup.querySelector('.login-btn') as HTMLElement;
    const loginForm = loginPopup.querySelector('.login-form') as HTMLElement;
    const signUpButton = new Button('Sign Up', ['sign-up-btn']).buttonElement;
    const inputName = new BaseElement('input', ['input-login', 'input-name']).element as HTMLInputElement;
    inputName.setAttribute('type', 'text');
    inputName.setAttribute('placeholder', 'Your name (3 chars minimum)');
    inputName.setAttribute('autocomplete', 'off');
    inputName.setAttribute('required', 'true');
    inputName.setAttribute('minlength', '3');
    // inputName.addEventListener('change', () => Validation.checkName(inputName.value, inputName));
    signUpSign.textContent = 'Sign Up';
    loginButton.remove();
    loginForm.prepend(inputName);
    loginForm.append(signUpButton);
    signUpButton.addEventListener('click', () => this.createUser(loginPopup, inputName, inputEmail, inputPassword));
  }

  private async createUser(
    loginPopup: HTMLElement,
    inputName: HTMLInputElement,
    inputEmail: HTMLInputElement,
    inputPassword: HTMLInputElement
  ): Promise<void> {
    if (!Validation.checkAllFields(loginPopup, 'Введите правильные данные для подписки')) return;
    const email = inputEmail.value;
    const password = inputPassword.value;
    const userName = inputName.value;
    const newUser = {
      email: email,
      password: password,
      name: userName,
    };
    const response = await fetch(`${apiStrings.API_ADDRESS}${apiStrings.API_USERS}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    });
    await response.json();
    this.loginUser(loginPopup, inputEmail, inputPassword);
    loginPopup.remove();
  }
}
export default LoginPopup;
