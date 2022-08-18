import LoginPopup from '../authorization/login-popup';
import SignUpPopup from '../authorization/sign-up';
import BaseElement from '../base-element/base-element';
import Button from '../buttons/button';

class Header {
  constructor() {
    const header = new BaseElement('header', ['header']).element;
    const signUpButton = new Button('Sign Up').buttonElement;
    signUpButton.addEventListener('click', this.handleSignUp);
    const logInButton = new Button('Log In').buttonElement;
    logInButton.addEventListener('click', this.handlelogIn);
    header.append(signUpButton, logInButton);
    document.body.prepend(header);
  }

  private handleSignUp() {
    document.body.append(new SignUpPopup().signUpPopupElement);
  }

  private handlelogIn() {
    document.body.append(new LoginPopup().loginPopupElement);
  }
}

export default Header;
