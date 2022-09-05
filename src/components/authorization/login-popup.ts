import './login-popup.scss';

import BaseElement from '../base-element/base-element';
import Button from '../buttons/button';
import ClosePopupButton from '../buttons/close-popup-button';
import Overlay from '../overlay/overlay';
import { apiStrings, EMAIL_REGEXP, TOKEN_EXPIRATION_TIME } from '../store/constants';
import { state } from '../store/state';
import WarningPopup from './warning-popup';
import Validation from './validation';
import Tutorial from '../tutorial/tutorial';

class LoginPopup {
  loginPopupElement: HTMLElement;

  constructor() {
    const loginPopup = new BaseElement('div', ['popup', 'login-popup']).element;
    const overlay = new Overlay().overlayElement;
    const closePopupButton = new ClosePopupButton().closePopubButtonElement;
    const fragment = document.createDocumentFragment();
    const loginForm = new BaseElement('form', ['login-form']).element;
    const inputEmail = new BaseElement('input', ['input-login', 'input-email']).element as HTMLInputElement;
    inputEmail.setAttribute('type', 'email');
    inputEmail.setAttribute('placeholder', 'Твой e-mail');
    inputEmail.setAttribute('autocomplete', 'off');
    inputEmail.setAttribute('required', 'true');
    inputEmail.setAttribute('pattern', EMAIL_REGEXP);
    const inputPassword = new BaseElement('input', ['input-login', 'input-password']).element as HTMLInputElement;
    inputPassword.setAttribute('type', 'password');
    inputPassword.setAttribute('placeholder', 'Пароль (хотя бы 8 символов)');
    inputPassword.setAttribute('autocomplete', 'off');
    inputPassword.setAttribute('required', 'true');
    inputPassword.setAttribute('minlength', '8');
    const loginPopupButton = new Button('Log In', ['login-btn']).buttonElement;
    document.addEventListener('keypress', (e: KeyboardEvent) => this.handleEnter(e, loginPopupButton), { once: true });
    loginPopupButton.addEventListener('click', (e: Event) => {
      e.preventDefault();
      this.loginUser(loginPopup, inputEmail, inputPassword);
    });
    const signUpP = new BaseElement('p').element;
    const loginTitle = new BaseElement('span', ['span__sign-up']).element;
    loginTitle.textContent = 'Вход в аккаунт';
    const signUpButton = new BaseElement('span', ['sign-up-button']).element;
    signUpButton.textContent = 'Еще нет аккаута? Зарегистрироваться!';
    signUpP.append(loginTitle, signUpButton);
    loginForm.append(inputEmail, inputPassword, loginPopupButton);
    fragment.append(loginForm, signUpP);

    signUpButton.addEventListener('click', (e: Event) => {
      e.preventDefault();
      this.handleCreateUser(loginPopup, inputEmail, inputPassword, loginTitle);
    });
    document.body.append(overlay);
    loginForm.append(inputEmail, inputPassword, loginPopupButton);
    fragment.append(closePopupButton, loginForm, signUpButton);
    loginPopup.append(fragment);
    this.loginPopupElement = loginPopup;
    Validation.handleEsc(loginPopup, overlay);
  }

  private async loginUser(
    loginPopup: HTMLElement,
    inputEmail: HTMLInputElement,
    inputPassword: HTMLInputElement
  ): Promise<void> {
    const warningPopupText =
      'Введи правильные данные для логина. Проверь e-mail и убедись, что в пароле не меньше восьми символов.';
    if (!Validation.checkAllFields(loginPopup, warningPopupText)) return;
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
        state.refreshToken = data.refreshToken;
        state.token = data.token;
        nameField.textContent = `${state.userName}`;
        //localStorage.setItem('currentToken', data.token);
        //localStorage.setItem('refreshToken', data.refreshToken);
        const tokenExpireTime = Date.now() + TOKEN_EXPIRATION_TIME;
        state.tokenExpireTime = tokenExpireTime;
        //localStorage.setItem('tokenExpireTime', tokenExpireTime.toString());
        state.userId = data.userId;
        console.log(data.userId);
        localStorage.setItem('state', JSON.stringify(state));
        this.closePopup();
        const logInButton = document.body.querySelector('.header__login-btn') as HTMLElement;
        const statButton = document.body.querySelector('[data-role="statistics"]') as HTMLElement;
        statButton.style.display = 'inline-block';
        logInButton.textContent = 'LOG OUT';
        logInButton.classList.add('header__logout-btn');
      })
      .catch(() => {
        new WarningPopup('Проверь имя и пароль, я не могу найти ');
      });
    if (state.currentPage === 'tutorial') {
      new Tutorial();
    }
  }

  private handleCreateUser(
    loginPopup: HTMLElement,
    inputEmail: HTMLInputElement,
    inputPassword: HTMLInputElement,
    loginTitle: HTMLElement
  ): void {
    loginTitle.textContent = 'Регистрация нового пользователя';
    const signUpLink = document.querySelector('.sign-up-button') as HTMLElement;
    const loginButton = loginPopup.querySelector('.login-btn') as HTMLElement;
    const loginForm = loginPopup.querySelector('.login-form') as HTMLElement;
    const signUpButton = new Button('Sign Up', ['sign-up-btn']).buttonElement;
    const inputName = new BaseElement('input', ['input-login', 'input-name']).element as HTMLInputElement;
    signUpLink.style.display = 'none';
    inputName.setAttribute('type', 'text');
    inputName.setAttribute('placeholder', 'Имя (минимум 3 символа)');
    inputName.setAttribute('autocomplete', 'off');
    inputName.setAttribute('required', 'true');
    inputName.setAttribute('minlength', '3');
    loginButton.remove();
    loginForm.prepend(inputName);
    loginForm.append(signUpButton);
    signUpButton.addEventListener('click', (e: Event) => {
      e.preventDefault();
      this.createUser(loginPopup, inputName, inputEmail, inputPassword);
    });
  }

  private async createUser(
    loginPopup: HTMLElement,
    inputName: HTMLInputElement,
    inputEmail: HTMLInputElement,
    inputPassword: HTMLInputElement
  ): Promise<void> {
    const warningPopupText =
      'Введи правильные данные для логина. Проверь e-mail и убедись, что в имени не меньше трех, а в пароле не меньше восьми символов.';
    if (!Validation.checkAllFields(loginPopup, warningPopupText)) return;
    const email = inputEmail.value;
    const password = inputPassword.value;
    const userName = inputName.value;
    const newUser = {
      email: email,
      password: password,
      name: userName,
    };
    try {
      const response = await fetch(`${apiStrings.API_ADDRESS}${apiStrings.API_USERS}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      const status = response.status;
      if (status === 417) {
        new WarningPopup('Пользователь с таким e-mail уже зарегистрован. Укажи другой e-mail');
        return;
      }
      await response.json();
    } catch (e) {
      const err = e as Error;
      const errMessage = err.message;
      console.log(errMessage);
    }
    this.loginUser(loginPopup, inputEmail, inputPassword);
    this.closePopup();
  }

  private closePopup() {
    const overlay = document.body.querySelector('.overlay');
    const popup = document.body.querySelector('.popup');
    overlay?.remove();
    popup?.remove();
  }

  handleEnter(e: KeyboardEvent, loginPopupButton: HTMLElement) {
    const mouseEvent = new Event('click');
    if (e.key === 'Enter') {
      loginPopupButton.dispatchEvent(mouseEvent);
    }
  }
}
export default LoginPopup;
