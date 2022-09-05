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
}

export default Validation;
