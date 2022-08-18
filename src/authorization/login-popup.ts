// TODO combine this class with SighUp or leave only one class!!!
import BaseElement from '../base-element/base-element';
import Button from '../buttons/button';
import Validation from './validation';

class LoginPopup {
  loginPopupElement: HTMLElement;

  constructor() {
    const loginPopup = new BaseElement('div', ['sign-up-popup']).element;
    const fragment = document.createDocumentFragment();
    const loginSign = new BaseElement('p', ['sign-up-sign']).element;
    loginSign.textContent = 'Log In';
    const inputEmail = new BaseElement('input', ['input-sign-up', 'input-email']).element as HTMLInputElement;
    inputEmail.setAttribute('type', 'email');
    inputEmail.setAttribute('placeholder', 'Your e-mail');
    inputEmail.addEventListener('change', () => Validation.checkEmail(inputEmail.value, inputEmail));
    const inputPassword = new BaseElement('input', ['input-sign-up', 'input-password']).element as HTMLInputElement;
    inputPassword.setAttribute('type', 'password');
    inputPassword.setAttribute('placeholder', 'Your password');
    inputPassword.addEventListener('change', () => Validation.checkPassword(inputPassword.value, inputPassword));
    const signUpPopupButton = new Button('Log In').buttonElement;
    signUpPopupButton.addEventListener('click', () => this.loginUser(loginPopup, inputEmail, inputPassword));
    fragment.append(loginSign, inputEmail, inputPassword, signUpPopupButton);
    loginPopup.append(fragment);
    this.loginPopupElement = loginPopup;
  }

  private async loginUser(
    loginPopup: HTMLElement,
    inputEmail: HTMLInputElement,
    inputPassword: HTMLInputElement
  ): Promise<void> {
    // TODO move API_ADDRESS to constants
    const API_ADDRESS = 'https://react-rslang-be-team141.herokuapp.com';
    const email = inputEmail.value;
    const password = inputPassword.value;
    const newUser = {
      email: email,
      password: password,
    };
    console.log(JSON.stringify(newUser));
    // TODO move signin to constants
    const response = await fetch(`${API_ADDRESS}/signin`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    });
    const data = await response.json();
    localStorage.setItem('currentToken', JSON.stringify(data.token));
    loginPopup.remove();
  }
}
export default LoginPopup;
