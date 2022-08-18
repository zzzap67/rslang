import BaseElement from '../base-element/base-element';
import Button from '../buttons/button';
import Validation from './validation';

class SignUpPopup {
  signUpPopupElement: HTMLElement;

  constructor() {
    const signUpPopup = new BaseElement('div', ['sign-up-popup']).element;
    const fragment = document.createDocumentFragment();
    const signUpSign = new BaseElement('p', ['sign-up-sign']).element;
    signUpSign.textContent = 'Sign Up';
    const inputEmail = new BaseElement('input', ['input-sign-up', 'input-email']).element as HTMLInputElement;
    inputEmail.setAttribute('type', 'email');
    inputEmail.setAttribute('placeholder', 'Your e-mail');
    inputEmail.addEventListener('change', () => Validation.checkEmail(inputEmail.value, inputEmail));
    const inputPassword = new BaseElement('input', ['input-sign-up', 'input-password']).element as HTMLInputElement;
    inputPassword.setAttribute('type', 'password');
    inputPassword.setAttribute('placeholder', 'Your password');
    inputPassword.addEventListener('change', () => Validation.checkPassword(inputPassword.value, inputPassword));
    const signUpPopupButton = new Button('Sign Up').buttonElement;
    signUpPopupButton.addEventListener('click', () => this.createUser(signUpPopup, inputEmail, inputPassword));
    fragment.append(signUpSign, inputEmail, inputPassword, signUpPopupButton);
    signUpPopup.append(fragment);
    this.signUpPopupElement = signUpPopup;
  }

  private async createUser(
    signUpPopup: HTMLElement,
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
    // TODO move users to constants
    const response = await fetch(`${API_ADDRESS}/users`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    });
    await response.json();
    signUpPopup.remove();
  }
}

export default SignUpPopup;
