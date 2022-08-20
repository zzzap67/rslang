class Validation {
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
