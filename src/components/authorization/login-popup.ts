import BaseElement from '../base-element/base-element';
import Button from '../buttons/button';
import { apiStrings } from '../constants/constants';
import Validation from './validation';

class LoginPopup {
  loginPopupElement: HTMLElement;

  constructor() {
    const loginPopup = new BaseElement('div', ['login-popup']).element;
    const fragment = document.createDocumentFragment();
    const loginForm = new BaseElement('form', ['login-form']).element;
    const loginSign = new BaseElement('p', ['login-sign']).element;
    loginSign.textContent = 'Log In';
    const inputEmail = new BaseElement('input', ['input-login', 'input-email']).element as HTMLInputElement;
    inputEmail.setAttribute('type', 'email');
    inputEmail.setAttribute('placeholder', 'Your e-mail');
    inputEmail.setAttribute('autocomplete', 'off');
    inputEmail.addEventListener('change', () => Validation.checkEmail(inputEmail.value, inputEmail));
    const inputPassword = new BaseElement('input', ['input-login', 'input-password']).element as HTMLInputElement;
    inputPassword.setAttribute('type', 'password');
    inputPassword.setAttribute('placeholder', 'Your password (8 chars minimum)');
    inputPassword.setAttribute('autocomplete', 'off');
    inputPassword.addEventListener('change', () => Validation.checkPassword(inputPassword.value, inputPassword));
    const loginPopupButton = new Button('Log In', ['login-btn']).buttonElement;
    loginPopupButton.addEventListener('click', () => this.loginUser(loginPopup, inputEmail, inputPassword));
    const signUpButton = new BaseElement('p', ['sign-up-button']).element;
    signUpButton.textContent = `Don't authorized yet? Sign Up!`;
    signUpButton.addEventListener('click', () => this.handleCreateUser(loginPopup, inputEmail, inputPassword));
    loginForm.append(inputEmail, inputPassword, loginPopupButton);
    fragment.append(loginSign, loginForm, signUpButton);
    loginPopup.append(fragment);
    this.loginPopupElement = loginPopup;
  }

  private async loginUser(
    loginPopup: HTMLElement,
    inputEmail: HTMLInputElement,
    inputPassword: HTMLInputElement
  ): Promise<void> {
    const nameField = document.body.querySelector('.user-name-field') as HTMLElement;
    const email = inputEmail.value;
    const password = inputPassword.value;
    const newUser = {
      email: email,
      password: password,
    };
    const response = await fetch(`${apiStrings.API_ADDRESS}${apiStrings.API_SIGN_IN}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    });
    const data = await response.json();
    console.log(data.name);
    nameField.textContent = `Hi, ${data.name}!`;
    localStorage.setItem('currentToken', JSON.stringify(data.token));
    loginPopup.remove();
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
    inputName.addEventListener('change', () => Validation.checkName(inputName.value, inputName));
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
