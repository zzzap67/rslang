import WarningPopup from './warning-popup';

class Validation {
  static checkAllFields(loginPopup: HTMLElement, warningText: string): boolean {
    const fields = loginPopup.querySelectorAll('.input-login');
    const validFields = loginPopup.querySelectorAll('.input-login:valid');
    if (validFields.length < fields.length) {
      new WarningPopup(warningText);
      return false;
    }
    return true;
  }

  static handleEsc(popup: HTMLElement, overlay: HTMLElement) {
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        popup.remove();
        overlay.remove();
      }
    });
  }

  static checkEmail(value: string, inputField: HTMLInputElement): void {
    const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
    // TODO rewrite this function
    if (!EMAIL_REGEXP.test(value)) {
      inputField.style.backgroundColor = 'red';
    } else {
      inputField.style.backgroundColor = 'white';
    }
  }

  static checkPassword(value: string, inputField: HTMLInputElement): void {
    const MIN_CHARS_IN_PASSWORD = 8;
    // TODO rewrite this function
    if (value.length < MIN_CHARS_IN_PASSWORD) {
      inputField.style.backgroundColor = 'red';
    } else {
      inputField.style.backgroundColor = 'white';
    }
  }

  static checkName(value: string, inputField: HTMLInputElement): void {
    const MIN_CHARS_IN_NAME = 3;
    // TODO rewrite this function
    if (value.length < MIN_CHARS_IN_NAME) {
      inputField.style.backgroundColor = 'red';
    } else {
      inputField.style.backgroundColor = 'white';
    }
  }
}

export default Validation;
